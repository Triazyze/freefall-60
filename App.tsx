import React, { useState, useEffect } from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./src/screens/home/HomeScreen";
import GameScreen from "./src/screens/game/GameScreen";
import ShopScreen from "./src/screens/shop/ShopScreen";
import ModeSelectScreen from "./src/screens/modeSelect/ModeSelectScreen";
import { BackgroundKey } from "./src/constants/background";
import { GameMode } from "./src/constants/gameParams";

type ScreenState = "HOME" | "MODE_SELECT" | "GAME" | "SHOP";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>("HOME");

  // States du jeu et de la boutique
  const [totalStars, setTotalStars] = useState<number>(0);
  const [highScores, setHighScores] = useState<Record<GameMode, number>>({
    NORMAL: 0,
    HARDCORE: 0,
    WEIRD: 0,
  });
  const [currentBackground, setCurrentBackground] =
    useState<BackgroundKey>("sky1");
  const [unlockedBackgrounds, setUnlockedBackgrounds] = useState<
    BackgroundKey[]
  >(["sky1"]);
  const [currentIcon, setCurrentIcon] = useState<string>("player_1");
  const [unlockedIcons, setUnlockedIcons] = useState<string[]>(["player_1"]);
  const [isBgScrollEnabled, setIsBgScrollEnabled] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<GameMode>("NORMAL");

  // Un seul chargement au démarrage de l'app
  useEffect(() => {
    const loadAllGameData = async () => {
      try {
        const [
          savedStars,
          savedScoreNormal,
          savedScoreHard,
          savedScoreWeird,
          savedBg,
          savedUnlockedBackgrounds,
          savedScrollSetting,
          savedIcons,
          savedUnlockedIcons,
        ] = await Promise.all([
          AsyncStorage.getItem("total_stars"),
          AsyncStorage.getItem("high_score_NORMAL"),
          AsyncStorage.getItem("high_score_HARDCORE"),
          AsyncStorage.getItem("high_score_WEIRD"),
          AsyncStorage.getItem("current_background"),
          AsyncStorage.getItem("unlocked_backgrounds"),
          AsyncStorage.getItem("bg_scroll_enabled"),
          AsyncStorage.getItem("current_icon"),
          AsyncStorage.getItem("unlocked_icons"),
        ]);

        if (savedStars !== null) setTotalStars(parseInt(savedStars, 10));
        setHighScores({
          NORMAL: savedScoreNormal ? parseInt(savedScoreNormal, 10) : 0,
          HARDCORE: savedScoreHard ? parseInt(savedScoreHard, 10) : 0,
          WEIRD: savedScoreWeird ? parseInt(savedScoreWeird, 10) : 0,
        });
        if (savedBg !== null) setCurrentBackground(savedBg as BackgroundKey);
        if (savedUnlockedBackgrounds !== null)
          setUnlockedBackgrounds(JSON.parse(savedUnlockedBackgrounds));
        if (savedScrollSetting !== null)
          setIsBgScrollEnabled(savedScrollSetting === "true");
        if (savedIcons !== null) {
          setCurrentIcon(savedIcons);
        } else {
          setCurrentIcon("player_1");
        }

        if (savedUnlockedIcons !== null) {
          try {
            setUnlockedIcons(JSON.parse(savedUnlockedIcons));
          } catch (jsonErr) {
            setUnlockedIcons(["player_1"]);
            await AsyncStorage.setItem(
              "unlocked_icons",
              JSON.stringify(["player_1"]),
            );
          }
        } else {
          setUnlockedIcons(["player_1"]);
        }
      } catch (e) {
        console.error("Erreur lors du chargement des données globales", e);
      }
    };
    loadAllGameData();
  }, []);

  // 2. Fonctions d'action de la boutique (Sauvegarde + Modif du state en même temps)
  const handleEquip = async (id: string, isBg: boolean) => {
    try {
      if (isBg) {
        setCurrentBackground(id as BackgroundKey);
        await AsyncStorage.setItem("current_background", id);
      } else {
        setCurrentIcon(id);
        await AsyncStorage.setItem("current_icon", id);
      }
    } catch (e) {
      console.error("Erreur lors de la sauvegarde de l'équipement", e);
    }
  };

  const handleUnlock = async (id: string, isBg: boolean) => {
    try {
      if (isBg) {
        const updatedList = [...unlockedBackgrounds, id as BackgroundKey];
        setUnlockedBackgrounds(updatedList);
        await AsyncStorage.setItem(
          "unlocked_backgrounds",
          JSON.stringify(updatedList),
        );
      } else {
        const updatedList = [...unlockedIcons, id];
        setUnlockedIcons(updatedList);
        await AsyncStorage.setItem(
          "unlocked_icons",
          JSON.stringify(updatedList),
        );
      }
    } catch (e) {
      console.error("Erreur lors de la sauvegarde de l'achat", e);
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
    await saveStars(newTotal);
    const currentModeHighScore = highScores[currentMode];

    if (finalDistance > currentModeHighScore) {
      setHighScores((prev) => ({
        ...prev,
        [currentMode]: finalDistance,
      }));

      try {
        await AsyncStorage.setItem(
          `high_score_${currentMode}`,
          finalDistance.toString(),
        );
      } catch (e) {
        console.error(`Erreur sauvegarde high score pour ${currentMode}`, e);
      }
    }
  };

  const toggleScrollSetting = async () => {
    const newValue = !isBgScrollEnabled;
    setIsBgScrollEnabled(newValue);
    try {
      await AsyncStorage.setItem("bg_scroll_enabled", newValue.toString());
    } catch (e) {
      console.error("Erreur sauvegarde paramètre scroll", e);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "HOME":
        return (
          <HomeScreen
            onStartGame={() => setCurrentScreen("MODE_SELECT")}
            onOpenShop={() => setCurrentScreen("SHOP")}
            highScores={highScores}
            isBgScrollEnabled={isBgScrollEnabled}
            toggleScrollSetting={toggleScrollSetting}
          />
        );

      case "MODE_SELECT":
        return (
          <ModeSelectScreen
            onSelectMode={(mode) => {
              setCurrentMode(mode); // FIX : Utilise setCurrentMode ici
              setCurrentScreen("GAME");
            }}
            onBack={() => setCurrentScreen("HOME")}
          />
        );
      case "GAME":
        return (
          <GameScreen
            onBackToMenu={() => setCurrentScreen("HOME")}
            onGameOverRecorded={handleGameOver}
            currentBackground={currentBackground}
            isBgScrollEnabled={isBgScrollEnabled}
            currentIcon={currentIcon}
            gameMode={currentMode} // FIX : Utilise currentMode ici
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
            unlockedIcons={unlockedIcons}
            currentIcon={currentIcon}
            onEquipBackground={(id) => handleEquip(id, true)}
            onUnlockBackground={(id) => handleUnlock(id, true)}
            onEquipIcon={(id) => handleEquip(id, false)}
            onUnlockIcon={(id) => handleUnlock(id, false)}
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
