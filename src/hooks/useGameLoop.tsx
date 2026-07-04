import { useState, useEffect, useRef } from "react";
import { Dimensions, PanResponder } from "react-native";
import { ItemType } from "../components/Items";
import { getGameParams, GameObject, GameMode } from "../constants/gameParams";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export function useGameLoop(
  gameMode: GameMode,
  onGameOverCallback?: (finalDistance: number, finalScore: number) => void,
  dynamicScreenHeight: number = SCREEN_HEIGHT,
  isBgScrollEnabled: boolean = true,
) {
  // 💡 MODIFICATION : On récupère le profil de configuration propre au mode choisi !
  const currentParams = getGameParams(gameMode);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [distance, setDistance] = useState(0);

  const totalPixelsFallenRef = useRef<number>(0);
  const currentScrollSpeedRef = useRef<number>(
    currentParams.INITIAL_SCROLL_SPEED,
  );

  const currentStarsRef = useRef<number>(0);

  const playerY = SCREEN_HEIGHT * 0.2;
  const touchStartXRef = useRef<number>(0);
  const playerXRef = useRef<number>(
    SCREEN_WIDTH / 2 - currentParams.PLAYER_SIZE / 2,
  );
  const itemsRef = useRef<GameObject[]>([]);
  const requestRef = useRef<number | null>(null);

  const lastSpawnDistanceRef = useRef<number>(0);
  const nextSpawnDistanceRef = useRef<number>(
    currentParams.INITIAL_DISTANCE_BETWEEN_ITEMS,
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
        if (newX > SCREEN_WIDTH - currentParams.PLAYER_SIZE)
          newX = SCREEN_WIDTH - currentParams.PLAYER_SIZE;
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
      currentParams.INITIAL_SCROLL_SPEED +
      totalPixelsFallenRef.current * currentParams.ACCELERATION_RATE;
    if (newSpeed > currentParams.MAX_SCROLL_SPEED)
      newSpeed = currentParams.MAX_SCROLL_SPEED;
    currentScrollSpeedRef.current = newSpeed;

    // 2. MOUVEMENT EN PIXELS
    const pixelsMovedThisFrame = currentScrollSpeedRef.current * cappedDelta;
    totalPixelsFallenRef.current += pixelsMovedThisFrame;

    setDistance(
      Math.floor(totalPixelsFallenRef.current / currentParams.PIXELS_PER_METER),
    );

    // Déplacer les objets vers le haut + mouvement latéral si MOBILEOBSTACLE
    itemsRef.current = itemsRef.current.map((item) => {
      let nextX = item.x;
      let currentVx = item.vx;

      if (item.type === "MOBILEOBSTACLE" && currentVx !== undefined) {
        nextX += currentVx;
        if (nextX < 0 || nextX > SCREEN_WIDTH - currentParams.ITEM_SIZE) {
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
      (item) => item.y > -currentParams.ITEM_SIZE,
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

    // 3. SPAWN (Système de tirage par poids dynamique)
    if (
      totalPixelsFallenRef.current - lastSpawnDistanceRef.current >=
      nextSpawnDistanceRef.current
    ) {
      const randomX = Math.random() * (SCREEN_WIDTH - currentParams.ITEM_SIZE);

      // --- ALGORITHME DE SÉLECTION PAR POIDS ---
      const totalWeight = currentParams.SPAWN_TABLE.reduce(
        (sum, item) => sum + item.weight,
        0,
      );

      let rand = Math.random() * totalWeight;
      let spawnType: ItemType = "NOTHING";

      for (const item of currentParams.SPAWN_TABLE) {
        rand -= item.weight;
        if (rand <= 0) {
          spawnType = item.type;
          break;
        }
      }

      let vx: number | undefined = undefined;
      if (spawnType === "MOBILEOBSTACLE") {
        vx = Math.random() > 0.5 ? 2 : -2;
      }

      if (spawnType !== "NOTHING") {
        itemsRef.current.push({
          id: Math.random().toString(),
          x: randomX,
          y: SCREEN_HEIGHT + currentParams.ITEM_SIZE,
          type: spawnType,
          vx: vx,
        });
      }

      lastSpawnDistanceRef.current = totalPixelsFallenRef.current;
      nextSpawnDistanceRef.current =
        currentParams.INITIAL_DISTANCE_BETWEEN_ITEMS;
    }

    // 4. COLLISIONS & GESTION DU CRASH
    const pX = playerXRef.current;
    const pY = playerY;

    itemsRef.current = itemsRef.current.filter((item) => {
      const hitX =
        pX < item.x + currentParams.ITEM_SIZE &&
        pX + currentParams.PLAYER_SIZE > item.x;
      const hitY =
        pY < item.y + currentParams.ITEM_SIZE &&
        pY + currentParams.PLAYER_SIZE > item.y;

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
      onGameOverCallback(
        Math.floor(
          totalPixelsFallenRef.current / currentParams.PIXELS_PER_METER,
        ),
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

    playerXRef.current = SCREEN_WIDTH / 2 - currentParams.PLAYER_SIZE / 2;
    itemsRef.current = [];
    totalPixelsFallenRef.current = 0;
    lastSpawnDistanceRef.current = 0;
    lastTimeRef.current = 0;
    currentScrollSpeedRef.current = currentParams.INITIAL_SCROLL_SPEED;
    currentStarsRef.current = 0;
    nextSpawnDistanceRef.current = currentParams.INITIAL_DISTANCE_BETWEEN_ITEMS;

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
    PLAYER_SIZE: currentParams.PLAYER_SIZE,
    ITEM_SIZE: currentParams.ITEM_SIZE,
    bgY1,
    scaleY1,
    bgY2,
    scaleY2,
    isBgScrollEnabled,
  };
}
