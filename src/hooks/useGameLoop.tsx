import { useState, useEffect, useRef } from "react";
import { Dimensions, PanResponder } from "react-native";
import { ItemType } from "../components/Items";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PARAMS, SPAWN_TABLE, GameObject } from "../constants/gameParams";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export function useGameLoop(
  onGameOverCallback?: (finalDistance: number, finalScore: number) => void,
  dynamicScreenHeight: number = SCREEN_HEIGHT,
  isBgScrollEnabled: boolean = true,
) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [distance, setDistance] = useState(0);

  const totalPixelsFallenRef = useRef<number>(0);
  const currentScrollSpeedRef = useRef<number>(PARAMS.INITIAL_SCROLL_SPEED);

  const currentStarsRef = useRef<number>(0);

  const playerY = SCREEN_HEIGHT * 0.2;
  const touchStartXRef = useRef<number>(0);
  const playerXRef = useRef<number>(SCREEN_WIDTH / 2 - PARAMS.PLAYER_SIZE / 2);
  const itemsRef = useRef<GameObject[]>([]);
  const requestRef = useRef<number | null>(null);

  const lastSpawnDistanceRef = useRef<number>(0);
  const nextSpawnDistanceRef = useRef<number>(
    PARAMS.INITIAL_DISTANCE_BETWEEN_ITEMS,
  );
  const lastTimeRef = useRef<number>(0);
  const isGameOverRef = useRef<boolean>(false);

  const [bgY1, setBgY1] = useState(0);
  const [scaleY1, setScaleY1] = useState(1);

  const [bgY2, setBgY2] = useState(dynamicScreenHeight);
  const [scaleY2, setScaleY2] = useState(-1);

  const [, forceUpdate] = useState({});

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isGameOverRef.current,
      onMoveShouldSetPanResponder: () => !isGameOverRef.current,
      onPanResponderGrant: () => {
        if (isGameOverRef.current) return;
        touchStartXRef.current = playerXRef.current;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isGameOverRef.current) return;
        let newX = touchStartXRef.current + gestureState.dx;
        if (newX < 0) newX = 0;
        if (newX > SCREEN_WIDTH - PARAMS.PLAYER_SIZE)
          newX = SCREEN_WIDTH - PARAMS.PLAYER_SIZE;
        playerXRef.current = newX;
      },
    }),
  ).current;

  const gameLoop = (timestamp: number) => {
    if (isGameOverRef.current) return;

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    const cappedDelta = Math.min(deltaTime, 0.1);

    // 1. CALCUL DE LA DIFFICULTÉ
    let newSpeed =
      PARAMS.INITIAL_SCROLL_SPEED +
      totalPixelsFallenRef.current * PARAMS.ACCELERATION_RATE;
    if (newSpeed > PARAMS.MAX_SCROLL_SPEED) newSpeed = PARAMS.MAX_SCROLL_SPEED;
    currentScrollSpeedRef.current = newSpeed;

    // 2. MOUVEMENT EN PIXELS
    const pixelsMovedThisFrame = currentScrollSpeedRef.current * cappedDelta;
    totalPixelsFallenRef.current += pixelsMovedThisFrame;

    setDistance(
      Math.floor(totalPixelsFallenRef.current / PARAMS.PIXELS_PER_METER),
    );

    // Déplacer les objets vers le haut + mouvement latéral si MOBILEOBSTACLE
    itemsRef.current = itemsRef.current.map((item) => {
      let nextX = item.x;
      let currentVx = item.vx;

      if (item.type === "MOBILEOBSTACLE" && currentVx !== undefined) {
        nextX += currentVx;
        // Rebond sur les bords de l'écran
        if (nextX < 0 || nextX > SCREEN_WIDTH - PARAMS.ITEM_SIZE) {
          currentVx = -currentVx;
        }
      }

      return {
        ...item,
        x: nextX,
        vx: currentVx,
        y: item.y - pixelsMovedThisFrame,
      };
    });

    itemsRef.current = itemsRef.current.filter(
      (item) => item.y > -PARAMS.ITEM_SIZE,
    );

    // Update du BG
    const bgMovement = isBgScrollEnabled ? pixelsMovedThisFrame : 0;

    setBgY1((prev) => {
      if (prev - bgMovement <= -dynamicScreenHeight) {
        setScaleY1(-scaleY2);
        return prev - bgMovement + dynamicScreenHeight * 2;
      }
      return prev - bgMovement;
    });

    setBgY2((prev) => {
      if (prev - bgMovement <= -dynamicScreenHeight) {
        setScaleY2(-scaleY1);
        return prev - bgMovement + dynamicScreenHeight * 2;
      }
      return prev - bgMovement;
    });

    // 3. SPAWN (Système de tirage par poids, propre et évolutif)
    if (
      totalPixelsFallenRef.current - lastSpawnDistanceRef.current >=
      nextSpawnDistanceRef.current
    ) {
      const randomX = Math.random() * (SCREEN_WIDTH - PARAMS.ITEM_SIZE);

      // --- ALGORITHME DE SÉLECTION PAR POIDS ---
      // 1. On calcule la somme totale de tous les poids configurés
      const totalWeight = SPAWN_TABLE.reduce(
        (sum, item) => sum + item.weight,
        0,
      );

      // 2. On tire un nombre aléatoire entre 0 et cette somme totale
      let rand = Math.random() * totalWeight;
      let spawnType: ItemType = "NOTHING";

      // 3. On parcourt le tableau et on soustrait les poids jusqu'à tomber sous 0
      for (const item of SPAWN_TABLE) {
        rand -= item.weight;
        if (rand <= 0) {
          spawnType = item.type;
          break;
        }
      }

      // Obstacle mobile avec vitesse aléatoire
      let vx: number | undefined = undefined;
      if (spawnType === "MOBILEOBSTACLE") {
        vx = Math.random() > 0.5 ? 2 : -2;
      }

      // Si vide, on ne spawn rien
      if (spawnType !== "NOTHING") {
        itemsRef.current.push({
          id: Math.random().toString(),
          x: randomX,
          y: SCREEN_HEIGHT + PARAMS.ITEM_SIZE,
          type: spawnType,
          vx: vx,
        });
      }

      // Réinitialisation des distances de spawn
      lastSpawnDistanceRef.current = totalPixelsFallenRef.current;
      nextSpawnDistanceRef.current = PARAMS.INITIAL_DISTANCE_BETWEEN_ITEMS
    }

    // 4. COLLISIONS & GESTION DU CRASH
    const pX = playerXRef.current;
    const pY = playerY;

    itemsRef.current = itemsRef.current.filter((item) => {
      const hitX =
        pX < item.x + PARAMS.ITEM_SIZE && pX + PARAMS.PLAYER_SIZE > item.x;
      const hitY =
        pY < item.y + PARAMS.ITEM_SIZE && pY + PARAMS.PLAYER_SIZE > item.y;

      if (hitX && hitY) {
        if (item.type === "BONUS") {
          currentStarsRef.current += 1;
          setScore(currentStarsRef.current);
          return false;
        } else if (item.type === "SUPERBONUS") {
          currentStarsRef.current += 5;
          setScore(currentStarsRef.current);
          return false;
        } else if (item.type === "NOTHING") {
          return false;
        } else {
          // Si c'est OBSTACLE ou MOBILEOBSTACLE -> Déclenchement immédiat du Game Over
          triggerGameOver();
          return true;
        }
      }
      return true;
    });

    forceUpdate({});

    if (!isGameOverRef.current) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const triggerGameOver = () => {
    isGameOverRef.current = true;
    setGameOver(true);

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }

    if (onGameOverCallback) {
      // On envoie la valeur instantanée et exacte de notre Ref de score
      onGameOverCallback(
        Math.floor(totalPixelsFallenRef.current / PARAMS.PIXELS_PER_METER),
        currentStarsRef.current,
      );
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const resetGame = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    playerXRef.current = SCREEN_WIDTH / 2 - PARAMS.PLAYER_SIZE / 2;
    itemsRef.current = [];
    totalPixelsFallenRef.current = 0;
    lastSpawnDistanceRef.current = 0;
    lastTimeRef.current = 0;
    currentScrollSpeedRef.current = PARAMS.INITIAL_SCROLL_SPEED;
    currentStarsRef.current = 0;
    nextSpawnDistanceRef.current = PARAMS.INITIAL_DISTANCE_BETWEEN_ITEMS;

    isGameOverRef.current = false;
    setScore(0);
    setDistance(0);
    setGameOver(false);

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  return {
    score,
    distance,
    gameOver,
    playerX: playerXRef.current,
    playerY,
    items: itemsRef.current,
    panHandlers: panResponder.panHandlers,
    resetGame,
    PLAYER_SIZE: PARAMS.PLAYER_SIZE,
    ITEM_SIZE: PARAMS.ITEM_SIZE,
    bgY1,
    scaleY1,
    bgY2,
    scaleY2,
    isBgScrollEnabled,
  };
}
