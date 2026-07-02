import React from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ShopItem, ShopScreenProps } from "../types/shop";
import { SHOP_ITEMS } from "../constants/shopItems";
import { BackgroundKey } from "../constants/background";

export default function ShopScreen({
  totalStars,
  onUpdateStars,
  onBackToMenu,
  unlockedBackgrounds,
  currentBackground,
  onEquipBackground,
  onUnlockBackground,
}: ShopScreenProps) {
  // Une seule fonction d'achat propre qui utilise les props du parent
  const handleBuyItem = (item: ShopItem) => {
    const bgId = `sky${item.id}` as BackgroundKey;

    if (totalStars >= item.price) {
      const remainingStars = totalStars - item.price;

      // On met à jour les étoiles dans le parent
      onUpdateStars(remainingStars);
      // On débloque le background dans le parent
      onUnlockBackground(bgId);

      alert(`Achat réussi : ${item.name} !`);
    } else {
      alert("Pas assez d'étoiles !");
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
          const bgId = `sky${item.id}` as BackgroundKey;
          const isEquipped = currentBackground === bgId;
          const isUnlocked =
            unlockedBackgrounds.includes(bgId) || item.price === 0; // Le ciel 1 est gratuit/débloqué
          const canBuy = totalStars >= item.price;

          return (
            <View style={styles.itemCard}>
              <Image source={item.image} style={styles.itemIcon} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                {/* On cache le prix si c'est déjà acheté */}
                {!isUnlocked && (
                  <Text style={styles.itemPrice}>⭐ {item.price}</Text>
                )}
              </View>

              {isEquipped ? (
                // ÉTAT 1 : Déjà équipé
                <View style={[styles.buyButton, styles.equippedButton]}>
                  <Text style={styles.buyButtonText}>Équipé</Text>
                </View>
              ) : isUnlocked ? (
                // ÉTAT 2 : Acheté mais pas équipé
                <TouchableOpacity
                  style={[styles.buyButton, styles.equipButton]}
                  onPress={() => onEquipBackground(bgId)}
                >
                  <Text style={styles.buyButtonText}>Équiper</Text>
                </TouchableOpacity>
              ) : (
                // ÉTAT 3 : À acheter
                <TouchableOpacity
                  style={[
                    styles.buyButton,
                    !canBuy && styles.buyButtonDisabled,
                  ]}
                  disabled={!canBuy}
                  onPress={() => handleBuyItem(item)}
                >
                  <Text style={styles.buyButtonText}>Acheter</Text>
                </TouchableOpacity>
              )}
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
    backgroundColor: "#2c3e50",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  starsText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f1c40f",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  listContent: {
    gap: 15,
  },
  itemCard: {
    backgroundColor: "#34495e",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
  },
  itemIcon: {
    fontSize: 35,
    marginRight: 15,
    width: 60,
    height: 60,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  itemPrice: {
    fontSize: 16,
    color: "#f1c40f",
    fontWeight: "600",
    marginTop: 3,
  },
  buyButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buyButtonDisabled: {
    backgroundColor: "#95a5a6",
    opacity: 0.5,
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 60,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  equipButton: {
    backgroundColor: "#3498db",
  },
  equippedButton: {
    backgroundColor: "#16a085",
  },
});
