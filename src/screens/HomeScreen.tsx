import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import asyncStorage from "@react-native-async-storage/async-storage";

interface HomeScreenProps {
  onStartGame: () => void;
  onOpenShop: () => void;
  highScore: number;
}

export default function HomeScreen({
  onStartGame,
  onOpenShop,
  highScore,
}: HomeScreenProps) {
  return (
    <View style={styles.container}>
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
});
