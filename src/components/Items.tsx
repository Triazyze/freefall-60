import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export type ItemType = 'BONUS'  | 'SUPERBONUS' | 'OBSTACLE' | 'MOBILEOBSTACLE';

interface ItemProps {
  x: number;
  y: number;
  size: number;
  type: ItemType;
}

export default function Item({ x, y, size, type }: ItemProps) {
  const isBonus = type === 'BONUS';
  const isSuperBonus = type === 'SUPERBONUS';
  const isMobileObstacle = type === 'MOBILEOBSTACLE';
  
  return (
    <View
      style={[
        styles.item,
        {
          width: size,
          height: size,
          backgroundColor: isBonus ? '#2ecc71' : isSuperBonus ? '#9b59b6' : isMobileObstacle ? '#e74c3c' : '#f39c12',
          borderRadius: isBonus ? 10 : 4, // Formes un peu différentes
          transform: [{ translateX: x }, { translateY: y }],
        },
      ]}
    >
      <Text style={styles.icon}>{isBonus ? '⭐' : isSuperBonus ? '🌟' : isMobileObstacle ? '🚀' : '🦅'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
  },
});