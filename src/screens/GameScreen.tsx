import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import Player from "../components/Player";
import Item from "../components/Items";
import { useGameLoop } from "../hooks/useGameLoop";
import { BackgroundKey, BACKGROUNDS } from "../constants/background";
import { PLAYER_ITEMS } from "../constants/shopItems";

interface GameScreenProps {
  onBackToMenu: () => void;
  onGameOverRecorded: (finalDistance: number, starsEarned: number) => void;
  currentBackground: BackgroundKey;
  isBgScrollEnabled: boolean;
  currentIcon: string;
}

export default function GameScreen({
  onBackToMenu,
  onGameOverRecorded,
  currentBackground,
  isBgScrollEnabled,
  currentIcon,
}: GameScreenProps) {
  // On garde une hauteur locale qui s'adaptera parfaitement à l'écran
  const [screenHeight, setScreenHeight] = useState(800);

  const {
    score,
    distance,
    gameOver,
    playerX,
    playerY,
    items,
    panHandlers,
    resetGame,
    PLAYER_SIZE,
    ITEM_SIZE,
    bgY1,
    scaleY1,
    bgY2,
    scaleY2,
  } = useGameLoop(onGameOverRecorded, screenHeight, isBgScrollEnabled);

  const activeIconObject = PLAYER_ITEMS.find((item) => item.id === currentIcon);
  const playerEmoji = activeIconObject?.icon || "🪂";

  return (
    <View
      style={styles.container}
      {...panHandlers}
      accessible={true}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setScreenHeight(height);
      }}
    >
      {/* --- ARRIÈRE-PLAN ANIMÉ EN MIROIR COMPLÈTEMENT STABLE --- */}
      <View style={StyleSheet.absoluteFill}>
        <Image
          source={BACKGROUNDS[currentBackground]}
          style={[
            styles.bgImage,
            { opacity: 0.7, top: bgY1, transform: [{ scaleY: scaleY1 }] },
          ]}
        />
        <Image
          source={BACKGROUNDS[currentBackground]}
          style={[
            styles.bgImage,
            { opacity: 0.7, top: bgY2, transform: [{ scaleY: scaleY2 }] },
          ]}
        />

        {/* ☁️ BANDEAU DE BRUME CORRIGÉ ☁️ */}
        <View
          style={[
            styles.transitionBlur,
            {
              top: bgY1 + screenHeight - 30,
            },
          ]}
        />
      </View>

      {/* UI Top Bar */}
      <View style={styles.uiContainer}>
        <Text style={styles.uiText}>⭐ {score}</Text>
        <Text style={styles.uiText}>Altitude: {distance} m</Text>
      </View>

      {/* Joueur */}
      <Player
        x={playerX}
        y={playerY}
        size={PLAYER_SIZE}
        currentPlayerIcon={playerEmoji}
      />

      {/* Obstacles et bonus */}
      {items.map((item) => (
        <Item
          key={item.id}
          x={item.x}
          y={item.y}
          size={ITEM_SIZE}
          type={item.type}
        />
      ))}

      {/* Overlay de Game Over */}
      {gameOver && (
        <View style={styles.gameOverContainer} pointerEvents="auto">
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.finalScoreText}>Distance : {distance} m</Text>
          <Text style={styles.finalScoreText}>⭐ {score}</Text>

          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>Recommencer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.menuButton]}
            onPress={() => {
              resetGame();
              onBackToMenu();
            }}
          >
            <Text style={styles.buttonText}>Menu Principal</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", overflow: "hidden" },
  bgImage: {
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    transform: [{ scaleX: 1.9 }],
  },
  transitionBlur: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(227, 227, 227, 0.5)",
  },
  uiContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  uiText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  gameOverContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    gap: 15,
  },
  gameOverText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 10,
  },
  finalScoreText: { fontSize: 18, color: "#fff" },
  button: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: "70%",
    alignItems: "center",
    marginTop: 10,
  },
  menuButton: { backgroundColor: "#7f8c8d" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
