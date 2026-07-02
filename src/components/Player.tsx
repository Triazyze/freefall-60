import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface PlayerProps {
  x: number;
  y: number;
  size: number;
}

export default function Player({ x, y, size }: PlayerProps) {
  return (
    <View
      style={[
        styles.player,
        {
          width: size,
          height: size,
          borderRadius: size / 2, // Un cercle pour le parachutiste
          transform: [{ translateX: x }, { translateY: y }],
        },
      ]}
    >
      {/* Petit indicateur visuel, ex: un parachute */}
      <Text style={styles.emoji}>🪂</Text>
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
    fontSize: 24,
  },
});