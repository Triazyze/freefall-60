import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export type ItemType = 'BONUS'  | 'SUPERBONUS' | 'OBSTACLE' | 'MOBILEOBSTACLE' | 'NOTHING';

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
  const nothing = type === 'NOTHING';
  
  return (
    <View
      style={[
        styles.item,
        {
          width: size,
          height: size,
          backgroundColor: isBonus ? '#43c67a' : isSuperBonus ? '#23bfe6' : isMobileObstacle ? '#e74c3c' : nothing ? 'transparent' : '#f39c12',
          borderRadius: isBonus || isSuperBonus ? 20 : 4,
          transform: [{ translateX: x }, { translateY: y }],
        },
      ]}
    >
      <Text style={styles.icon}>{isBonus ? '⭐' : isSuperBonus ? '🌟' : isMobileObstacle ? '🚀' : nothing ? '' : '🦅'}</Text>
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