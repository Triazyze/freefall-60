import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  icon: string;
}

// Exemple d'articles dans la boutique
const SHOP_ITEMS: ShopItem[] = [
  { id: '1', name: 'Parachute Rouge', price: 10, icon: '🪂' },
  { id: '2', name: 'Combinaison Alien', price: 25, icon: '👽' },
  { id: '3', name: 'Cape de Super-héros', price: 50, icon: '🦸' },
  { id: '4', name: 'Parachute en Or', price: 100, icon: '✨' },
];

interface ShopScreenProps {
  totalStars: number;
  onUpdateStars: (newStars: number) => void;
  onBackToMenu: () => void;
}

export default function ShopScreen({ totalStars, onUpdateStars, onBackToMenu }: ShopScreenProps) {
  
  const handleBuyItem = (item: ShopItem) => {
    if (totalStars >= item.price) {
      const remainingStars = totalStars - item.price;
      onUpdateStars(remainingStars);
      alert(`Achat réussi : ${item.name} !`);
      // Plus tard, on sauvegardera aussi l'item débloqué ici
    } else {
      alert("Pas assez d'étoiles ! Continue à sauter en parachute !");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>BOUTIQUE</Text>
        <Text style={styles.starsText}>⭐ {totalStars}</Text>
      </View>

      {/* Liste des items */}
      <FlatList
        data={SHOP_ITEMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const canBuy = totalStars >= item.price;
          return (
            <View style={styles.itemCard}>
              <Text style={styles.itemIcon}>{item.icon}</Text>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>⭐ {item.price}</Text>
              </View>
              <TouchableOpacity
                style={[styles.buyButton, !canBuy && styles.buyButtonDisabled]}
                onPress={() => handleBuyItem(item)}
              >
                <Text style={styles.buyButtonText}>Acheter</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* Bouton Retour */}
      <TouchableOpacity style={styles.backButton} onPress={onBackToMenu}>
        <Text style={styles.backButtonText}>Retour au Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  starsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f1c40f',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  listContent: {
    gap: 15,
  },
  itemCard: {
    backgroundColor: '#34495e',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
  },
  itemIcon: {
    fontSize: 35,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemPrice: {
    fontSize: 16,
    color: '#f1c40f',
    fontWeight: '600',
    marginTop: 3,
  },
  buyButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buyButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.5,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});