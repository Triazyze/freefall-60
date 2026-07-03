import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface PlayerProps {
  x: number;
  y: number;
  size: number;
  currentPlayerIcon: string;
}

export default function Player({ x, y, size, currentPlayerIcon }: PlayerProps) {
  return (
    <View
      style={[
        styles.player,
        {
          width: size,
          height: size,
          transform: [{ translateX: x }, { translateY: y }],
        },
      ]}
    >
      {/* 2. On affiche l'émoji dynamique et on adapte sa taille à la hitbox */}
      <Text style={[styles.emoji, { fontSize: size * 0.75 }]}>
        {currentPlayerIcon}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  emoji: {
  },
});