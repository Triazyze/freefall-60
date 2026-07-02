import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./src/screens/HomeScreen";
import GameScreen from "./src/screens/GameScreen";
import ShopScreen from "./src/screens/ShopScreen";
import { BackgroundKey } from "./src/constants/background";

type ScreenState = "HOME" | "GAME" | "SHOP";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>("HOME");
  const [totalStars, setTotalStars] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  const [currentBackground, setCurrentBackground] =
    useState<BackgroundKey>("sky1");
  const [unlockedBackgrounds, setUnlockedBackgrounds] = useState<
    BackgroundKey[]
  >(["sky1"]);

  const handleEquip = (id: BackgroundKey) => setCurrentBackground(id);
  const handleUnlock = (id: BackgroundKey) =>
    setUnlockedBackgrounds([...unlockedBackgrounds, id]);

  // Charger les étoiles sauvegardées au démarrage de l'application
  useEffect(() => {
    const loadStars = async () => {
      try {
        const savedStars = await AsyncStorage.getItem("total_stars");
        if (savedStars !== null) {
          setTotalStars(parseInt(savedStars, 10));
        }
      } catch (e) {
        console.error("Erreur lors du chargement des étoiles", e);
      }
    };
    loadStars();
  }, []);

  // Charge le record existant au démarrage de l'appli
  useEffect(() => {
    const loadHighScore = async () => {
      const saved = await AsyncStorage.getItem("high_score");
      if (saved) setHighScore(parseInt(saved, 10));
    };
    loadHighScore();
  }, []);

  useEffect(() => {
    const loadBackground = async () => {
      const savedBackground = await AsyncStorage.getItem("current_background");
      if (savedBackground) {
        setCurrentBackground(savedBackground as BackgroundKey);
      }
    };
    loadBackground();
  }, []);

  // Sauvegarder les étoiles après une partie ou un achat
  const saveStars = async (newStarsAmount: number) => {
    try {
      setTotalStars(newStarsAmount);
      await AsyncStorage.setItem("total_stars", newStarsAmount.toString());
    } catch (e) {
      console.error("Erreur lors de la sauvegarde des étoiles", e);
    }
  };

  // Gestion de la fin de partie (appelée par le GameScreen)
  const handleGameOver = async (finalDistance: number, starsEarned: number) => {
    const newTotal = totalStars + starsEarned;
    await saveStars(newTotal);

    if (finalDistance > highScore) {
      setHighScore(finalDistance);
      await AsyncStorage.setItem("high_score", finalDistance.toString());
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "HOME":
        return (
          <HomeScreen
            onStartGame={() => setCurrentScreen("GAME")}
            onOpenShop={() => setCurrentScreen("SHOP")}
            highScore={highScore}
          />
        );
      case "GAME":
        return (
          <GameScreen
            onBackToMenu={() => setCurrentScreen("HOME")}
            onGameOverRecorded={handleGameOver}
            currentBackground={currentBackground}
          />
        );
      case "SHOP":
        return (
          <ShopScreen
            totalStars={totalStars}
            onUpdateStars={saveStars}
            onBackToMenu={() => setCurrentScreen("HOME")}
            unlockedBackgrounds={unlockedBackgrounds}
            currentBackground={currentBackground}
            onEquipBackground={handleEquip}
            onUnlockBackground={handleUnlock}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});
