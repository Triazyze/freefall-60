import React, { useState, useEffect } from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./src/screens/HomeScreen";
import GameScreen from "./src/screens/GameScreen";
import ShopScreen from "./src/screens/ShopScreen";
import { BackgroundKey } from "./src/constants/background";

type ScreenState = "HOME" | "GAME" | "SHOP";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>("HOME");
  
  // States du jeu et de la boutique
  const [totalStars, setTotalStars] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [currentBackground, setCurrentBackground] = useState<BackgroundKey>("sky1");
  const [unlockedBackgrounds, setUnlockedBackgrounds] = useState<BackgroundKey[]>(["sky1"]);

  // 1. LE REGROUPEMENT ULTIME : Un seul chargement au démarrage de l'app
  useEffect(() => {
    const loadAllGameData = async () => {
      try {
        const [savedStars, savedHighScore, savedBg, savedUnlocked] = await Promise.all([
          AsyncStorage.getItem("total_stars"),
          AsyncStorage.getItem("high_score"),
          AsyncStorage.getItem("current_background"),
          AsyncStorage.getItem("unlocked_backgrounds"),
        ]);

        if (savedStars !== null) setTotalStars(parseInt(savedStars, 10));
        if (savedHighScore !== null) setHighScore(parseInt(savedHighScore, 10));
        if (savedBg !== null) setCurrentBackground(savedBg as BackgroundKey);
        if (savedUnlocked !== null) setUnlockedBackgrounds(JSON.parse(savedUnlocked));
      } catch (e) {
        console.error("Erreur lors du chargement des données globales", e);
      }
    };
    loadAllGameData();
  }, []);

  // 2. Fonctions d'action de la boutique (Sauvegarde + Modif du state en même temps)
  const handleEquip = async (id: BackgroundKey) => {
    setCurrentBackground(id);
    try {
      await AsyncStorage.setItem("current_background", id);
    } catch (e) {
      console.error("Erreur sauvegarde équipement", e);
    }
  };

  const handleUnlock = async (id: BackgroundKey) => {
    const updatedList = [...unlockedBackgrounds, id];
    setUnlockedBackgrounds(updatedList);
    try {
      await AsyncStorage.setItem("unlocked_backgrounds", JSON.stringify(updatedList));
    } catch (e) {
      console.error("Erreur sauvegarde achat background", e);
    }
  };

  const saveStars = async (newStarsAmount: number) => {
    setTotalStars(newStarsAmount);
    try {
      await AsyncStorage.setItem("total_stars", newStarsAmount.toString());
    } catch (e) {
      console.error("Erreur lors de la sauvegarde des étoiles", e);
    }
  };

  // Gestion de la fin de partie
  const handleGameOver = async (finalDistance: number, starsEarned: number) => {
    const newTotal = totalStars + starsEarned;
    await saveStars(newTotal); // Sauvegarde et met à jour les étoiles

    if (finalDistance > highScore) {
      setHighScore(finalDistance);
      try {
        await AsyncStorage.setItem("high_score", finalDistance.toString());
      } catch (e) {
        console.error("Erreur sauvegarde high score", e);
      }
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});