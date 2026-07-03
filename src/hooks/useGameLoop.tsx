import { useState, useEffect, useRef } from "react";
import { Dimensions, PanResponder } from "react-native";
import { ItemType } from "../components/Items";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const PLAYER_SIZE = 40;
const ITEM_SIZE = 30;

const INITIAL_SCROLL_SPEED = 200;
const MAX_SCROLL_SPEED = 750;
const ACCELERATION_RATE = 0.02;

const PIXELS_PER_METER = 15;
const INITIAL_DISTANCE_BETWEEN_ITEMS = 100 + Math.random() * 200;

export interface GameObject {
  id: string;
  x: number;
  y: number;
  type: ItemType;
  vx?: number;
}

export function useGameLoop(
  onGameOverCallback?: (finalDistance: number, finalScore: number) => void,
  dynamicScreenHeight: number = SCREEN_HEIGHT,
  isBgScrollEnabled: boolean = true,
) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [distance, setDistance] = useState(0);

  const totalPixelsFallenRef = useRef<number>(0);
  const currentScrollSpeedRef = useRef<number>(INITIAL_SCROLL_SPEED);

  const currentStarsRef = useRef<number>(0);

  const playerY = SCREEN_HEIGHT * 0.2;
  const touchStartXRef = useRef<number>(0);
  const playerXRef = useRef<number>(SCREEN_WIDTH / 2 - PLAYER_SIZE / 2);
  const itemsRef = useRef<GameObject[]>([]);
  const requestRef = useRef<number | null>(null);

  const lastSpawnDistanceRef = useRef<number>(0);
  const nextSpawnDistanceRef = useRef<number>(INITIAL_DISTANCE_BETWEEN_ITEMS);
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
        if (newX > SCREEN_WIDTH - PLAYER_SIZE)
          newX = SCREEN_WIDTH - PLAYER_SIZE;
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
      INITIAL_SCROLL_SPEED + totalPixelsFallenRef.current * ACCELERATION_RATE;
    if (newSpeed > MAX_SCROLL_SPEED) newSpeed = MAX_SCROLL_SPEED;
    currentScrollSpeedRef.current = newSpeed;

    // 2. MOUVEMENT EN PIXELS
    const pixelsMovedThisFrame = currentScrollSpeedRef.current * cappedDelta;
    totalPixelsFallenRef.current += pixelsMovedThisFrame;

    setDistance(Math.floor(totalPixelsFallenRef.current / PIXELS_PER_METER));

    // Déplacer les objets vers le haut + mouvement latéral si MOBILEOBSTACLE
    itemsRef.current = itemsRef.current.map((item) => {
      let nextX = item.x;
      let currentVx = item.vx;

      if (item.type === "MOBILEOBSTACLE" && currentVx !== undefined) {
        nextX += currentVx;
        // Rebond sur les bords de l'écran
        if (nextX < 0 || nextX > SCREEN_WIDTH - ITEM_SIZE) {
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

    itemsRef.current = itemsRef.current.filter((item) => item.y > -ITEM_SIZE);

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

    // 3. SPAWN (Système de tirage propre)
    if (
      totalPixelsFallenRef.current - lastSpawnDistanceRef.current >=
      nextSpawnDistanceRef.current
    ) {
      const randomX = Math.random() * (SCREEN_WIDTH - ITEM_SIZE);
      const rand = Math.random();

      let spawnType: ItemType = "NOTHING";
      let vx: number | undefined = undefined;
      if (rand < 0.2) {
        spawnType = "BONUS"; // 20% de chance
      } else if (rand < 0.3) {
        spawnType = "SUPERBONUS"; // 10% de chance
      } else if (rand < 0.6) {
        spawnType = "OBSTACLE"; // 30% de chance
      } else if (rand < 0.7) {
        spawnType = "MOBILEOBSTACLE"; // 10% de chance
        vx = Math.random() > 0.5 ? 2 : -2; // Vitesse latérale de départ
      } // Le reste (30%) sera du vide (NOTHING)

      itemsRef.current.push({
        id: Math.random().toString(),
        x: randomX,
        y: SCREEN_HEIGHT + ITEM_SIZE,
        type: spawnType,
        vx: vx,
      });

      lastSpawnDistanceRef.current = totalPixelsFallenRef.current;
      nextSpawnDistanceRef.current = 100 + Math.random() * 200;
    }

    // 4. COLLISIONS & GESTION DU CRASH
    const pX = playerXRef.current;
    const pY = playerY;

    itemsRef.current = itemsRef.current.filter((item) => {
      const hitX = pX < item.x + ITEM_SIZE && pX + PLAYER_SIZE > item.x;
      const hitY = pY < item.y + ITEM_SIZE && pY + PLAYER_SIZE > item.y;

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
        Math.floor(totalPixelsFallenRef.current / PIXELS_PER_METER),
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

    playerXRef.current = SCREEN_WIDTH / 2 - PLAYER_SIZE / 2;
    itemsRef.current = [];
    totalPixelsFallenRef.current = 0;
    lastSpawnDistanceRef.current = 0;
    lastTimeRef.current = 0;
    currentScrollSpeedRef.current = INITIAL_SCROLL_SPEED;
    currentStarsRef.current = 0;
    nextSpawnDistanceRef.current = INITIAL_DISTANCE_BETWEEN_ITEMS;

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
    PLAYER_SIZE,
    ITEM_SIZE,
    bgY1,
    scaleY1,
    bgY2,
    scaleY2,
    isBgScrollEnabled,
  };
}
