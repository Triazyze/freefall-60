import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import ShopScreen from './src/screens/ShopScreen'; // On va le créer juste après

type ScreenState = 'HOME' | 'GAME' | 'SHOP';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('HOME');
  const [totalStars, setTotalStars] = useState<number>(0);

  // Charger les étoiles sauvegardées au démarrage de l'application
  useEffect(() => {
    const loadStars = async () => {
      try {
        const savedStars = await AsyncStorage.getItem('total_stars');
        if (savedStars !== null) {
          setTotalStars(parseInt(savedStars, 10));
        }
      } catch (e) {
        console.error("Erreur lors du chargement des étoiles", e);
      }
    };
    loadStars();
  }, []);

  // Sauvegarder les étoiles après une partie ou un achat
  const saveStars = async (newStarsAmount: number) => {
    try {
      setTotalStars(newStarsAmount);
      await AsyncStorage.setItem('total_stars', newStarsAmount.toString());
    } catch (e) {
      console.error("Erreur lors de la sauvegarde des étoiles", e);
    }
  };

  // Gestion de la fin de partie (appelée par le GameScreen)
  const handleGameOver = (finalDistance: number, starsEarned: number) => {
    const newTotal = totalStars + starsEarned;
    saveStars(newTotal);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return (
          <HomeScreen 
            onStartGame={() => setCurrentScreen('GAME')} 
            onOpenShop={() => setCurrentScreen('SHOP')} 
          />
        );
      case 'GAME':
        return (
          <GameScreen 
            onBackToMenu={() => setCurrentScreen('HOME')} 
            onGameOverRecorded={handleGameOver}
          />
        );
      case 'SHOP':
        return (
          <ShopScreen 
            totalStars={totalStars}
            onUpdateStars={saveStars}
            onBackToMenu={() => setCurrentScreen('HOME')} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});