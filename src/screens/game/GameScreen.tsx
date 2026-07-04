import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import Player from "../../components/Player";
import Item from "../../components/Items";
import { useGameLoop } from "../../hooks/useGameLoop";
import { BackgroundKey, BACKGROUNDS } from "../../constants/background";
import { PLAYER_ITEMS } from "../../constants/shopItems";
import { GameMode } from "../../constants/gameParams";
import { styles } from "./GameScreen.style";

interface GameScreenProps {
  onBackToMenu: () => void;
  onGameOverRecorded: (finalDistance: number, starsEarned: number) => void;
  currentBackground: BackgroundKey;
  isBgScrollEnabled: boolean;
  currentIcon: string;
  gameMode: GameMode
}

export default function GameScreen({
  onBackToMenu,
  onGameOverRecorded,
  currentBackground,
  isBgScrollEnabled,
  currentIcon,
  gameMode
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
  } = useGameLoop( gameMode, onGameOverRecorded, screenHeight, isBgScrollEnabled);

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
      {/* --- SYSTÈME DE PARALLAXE ADAPTATIF --- */}
      <View style={StyleSheet.absoluteFill}>
        <View style={[styles.bgContainer, { top: bgY1 }]}>
          <Image
            source={BACKGROUNDS[currentBackground]}
            style={
              isBgScrollEnabled ? styles.bgImageCropped : styles.bgImageNormal
            }
          />
        </View>

        {isBgScrollEnabled && (
          <View
            style={[
              styles.bgContainer,
              { top: bgY2, transform: [{ scaleY: scaleY2 }] },
            ]}
          >
            <Image
              source={BACKGROUNDS[currentBackground]}
              style={styles.bgImageCropped}
            />
          </View>
        )}
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