import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface HomeScreenProps {
  onStartGame: () => void;
  onOpenShop: () => void;
  highScore: number;
  isBgScrollEnabled: boolean;
  toggleScrollSetting: () => void;
}

export default function HomeScreen({
  onStartGame,
  onOpenShop,
  highScore,
  isBgScrollEnabled,
  toggleScrollSetting,
}: HomeScreenProps) {
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setSettingsVisible(true)}
      >
        <Text style={{ fontSize: 24 }}>⚙️</Text>
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>FREEFALL 60</Text>
        <Text style={styles.subtitle}>Un avant gout de la chute libre !</Text>
        <Text style={styles.score}>Meilleur score: {highScore} m</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4a90e2",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 50,
  },
  headerContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#e0e0e0",
    fontStyle: "italic",
    marginTop: 10,
  },
  score: {
    fontSize: 26,
    color: "#e0e0e0",
    fontStyle: "italic",
    marginTop: 100,
  },
  menuContainer: {
    width: "80%",
    gap: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  playButton: {
    backgroundColor: "#2ecc71",
  },
  shopButton: {
    backgroundColor: "#f1c40f",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  settingsButton: {
    position: "absolute",
    top: 50,
    right: 25,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#2c3e50",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    gap: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  settingText: {
    fontSize: 18,
    color: "#fff",
  },
  toggleBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    minWidth: 70,
    alignItems: "center",
  },
  toggleOn: {
    backgroundColor: "#2ecc71",
  },
  toggleOff: {
    backgroundColor: "#e74c3c",
  },
  toggleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeBtn: {
    backgroundColor: "#7f8c8d",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
});
