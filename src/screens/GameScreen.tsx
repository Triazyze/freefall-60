import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Player from "../components/Player";
import Item from "../components/Items";
import { useGameLoop } from "../hooks/useGameLoop";
import { BackgroundKey, BACKGROUNDS } from "../constants/background";

interface GameScreenProps {
  onBackToMenu: () => void;
  onGameOverRecorded: (finalDistance: number, starsEarned: number) => void;
  currentBackground: BackgroundKey;
}

export default function GameScreen({
  onBackToMenu,
  onGameOverRecorded,
  currentBackground,
}: GameScreenProps) {
  // CORRECTION ICI : On passe la prop au hook pour que la sauvegarde s'active !
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
  } = useGameLoop(onGameOverRecorded);

  return (
    <ImageBackground
      source={BACKGROUNDS[currentBackground]}
      style={styles.container}
      {...panHandlers}
      accessible={true}
    >
      {/* UI Top Bar */}
      <View style={styles.uiContainer}>
        <Text style={styles.uiText}>⭐ {score}</Text>
        <Text style={styles.uiText}>Altitude: {distance} m</Text>
      </View>

      {/* Joueur */}
      <Player x={playerX} y={playerY} size={PLAYER_SIZE} />

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

          {/* SÉCURISATION ICI : On reset le moteur de jeu avant de changer d'écran */}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
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
  finalScoreText: {
    fontSize: 18,
    color: "#fff",
  },
  button: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: "70%",
    alignItems: "center",
    marginTop: 10,
  },
  menuButton: {
    backgroundColor: "#7f8c8d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
