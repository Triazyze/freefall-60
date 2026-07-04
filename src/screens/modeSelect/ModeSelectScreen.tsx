import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { GameMode } from "../../constants/gameParams";
import { styles } from "./ModeSelectScreen.style";

interface ModeSelectScreenProps {
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

export default function ModeSelectScreen({ onSelectMode, onBack }: ModeSelectScreenProps) {
  const modes: { id: GameMode; title: string; desc: string; color: string }[] = [
    { id: "NORMAL", title: "Mode Normal 🪂", desc: "Vitesse classique, bon équilibre.", color: "#2ecc71" },
    { id: "HARDCORE", title: "Mode Hardcore 🔥", desc: "Hyper vitesse et avalanche d'obstacles !", color: "#e74c3c" },
        { id: "WEIRD", title: "Mode Bizarre 🌈", desc: "", color: "#9b59b6" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CHOISIS TON MODE</Text>

      <View style={styles.buttonContainer}>
        {modes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[styles.modeButton, { borderColor: mode.color }]}
            onPress={() => onSelectMode(mode.id)}
          >
            <Text style={[styles.modeTitle, { color: mode.color }]}>{mode.title}</Text>
            <Text style={styles.modeDesc}>{mode.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}