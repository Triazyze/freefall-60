import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "./HomeScreen.style";
import { GameMode } from "../../constants/gameParams";

interface HomeScreenProps {
  onStartGame: () => void;
  onOpenShop: () => void;
  highScores: Record<GameMode, number>;
  isBgScrollEnabled: boolean;
  toggleScrollSetting: () => void;
}

export default function HomeScreen({
  onStartGame,
  onOpenShop,
  highScores,
  isBgScrollEnabled,
  toggleScrollSetting,
}: HomeScreenProps) {
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/gameAssets/home_background.jpg")}
        style={styles.backgroundImage}
      />
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setSettingsVisible(true)}
      >
        <Text style={{ fontSize: 24 }}>⚙️</Text>
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>FREEFALL 60</Text>
        <Text style={styles.subtitle}>Un avant gout de la chute libre !</Text>
        <View style={styles.highScoreContainer}>
          <Text style={styles.scoreTitle}>Meilleurs scores :</Text>
          <Text style={styles.score}>Normal: {highScores.NORMAL} m</Text>
          <Text style={styles.score}>Hardcore: {highScores.HARDCORE} m</Text>
          <Text style={styles.score}>Bizarre: {highScores.WEIRD} m</Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.button, styles.playButton]}
          onPress={onStartGame}
        >
          <Text style={styles.buttonText}>JOUER</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.shopButton]}
          onPress={onOpenShop}
        >
          <Text style={styles.buttonText}>BOUTIQUE</Text>
        </TouchableOpacity>
      </View>

      {/* --- MODAL DES PARAMÈTRES --- */}
      <Modal visible={settingsVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Paramètres</Text>

            {/* Ligne du Toggle */}
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Défilement du fond :</Text>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  isBgScrollEnabled ? styles.toggleOn : styles.toggleOff,
                ]}
                onPress={toggleScrollSetting}
              >
                <Text style={styles.toggleText}>
                  {isBgScrollEnabled ? "ON" : "OFF"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bouton Fermer */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSettingsVisible(false)}
            >
              <Text style={{ color: "#fff" }}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
