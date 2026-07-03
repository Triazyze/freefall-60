import React, { useState } from "react";
import { Image, View, Text, TouchableOpacity, FlatList } from "react-native";
import { ShopScreenProps } from "../../types/shop";
import { SHOP_ITEMS, PLAYER_ITEMS } from "../../constants/shopItems";
import { BackgroundKey } from "../../constants/background";
import { styles } from "./ShopScreen.style";

type TabType = "BACKGROUNDS" | "ICONS";

export default function ShopScreen({
  totalStars,
  onUpdateStars,
  onBackToMenu,
  unlockedBackgrounds,
  currentBackground,
  onEquipBackground,
  onUnlockBackground,
  unlockedIcons,
  currentIcon,
  onEquipIcon,
  onUnlockIcon,
}: ShopScreenProps) {
  // Onglet actif par défaut
  const [activeTab, setActiveTab] = useState<TabType>("BACKGROUNDS");

  // Fonction d'achat universelle (gère BG et Icônes)
  // Fonction d'achat universelle nettoyée
  const handleBuyItem = (
    id: string,
    price: number,
    name: string,
    isBg: boolean,
  ) => {
    if (totalStars >= price) {
      onUpdateStars(totalStars - price);

      // On appelle DIRECTEMENT la bonne prop passée par le parent
      if (isBg) {
        onUnlockBackground(id as BackgroundKey);
      } else {
        onUnlockIcon(id);
      }

      alert(`Achat réussi : ${name} !`);
    } else {
      alert("Pas assez d'étoiles !");
    }
  };

  // On sélectionne la bonne liste de données selon l'onglet actif
  const currentData = activeTab === "BACKGROUNDS" ? SHOP_ITEMS : PLAYER_ITEMS;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>BOUTIQUE</Text>
        <Text style={styles.starsText}>⭐ {totalStars}</Text>
      </View>

      {/* --- BARRE D'ONGLETS --- */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "BACKGROUNDS" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("BACKGROUNDS")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "BACKGROUNDS" && styles.activeTabButtonText,
            ]}
          >
            Fonds
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "ICONS" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("ICONS")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "ICONS" && styles.activeTabButtonText,
            ]}
          >
            Icônes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste des items unique et dynamique */}
      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isBgTab = activeTab === "BACKGROUNDS";

          const bgId = `sky${item.id}` as BackgroundKey;
          const iconId = item.id;

          const isEquipped = isBgTab
            ? currentBackground === bgId
            : currentIcon === iconId;

          const isUnlocked = isBgTab
            ? unlockedBackgrounds.includes(bgId) || item.price === 0
            : unlockedIcons.includes(iconId) || item.price === 0;

          const canBuy = totalStars >= item.price;

          return (
            <View style={styles.itemCard}>
              {/* Rendu visuel dynamique : Image pour le BG, Text (émoji) pour l'icône */}
              {isBgTab ? (
                <Image
                  source={(item as any).image}
                  style={styles.itemIconImage}
                />
              ) : (
                <View style={styles.itemIconEmojiContainer}>
                  <Text style={styles.itemIconEmoji}>{(item as any).icon}</Text>
                </View>
              )}

              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                {!isUnlocked && (
                  <Text style={styles.itemPrice}>⭐ {item.price}</Text>
                )}
              </View>

              {isEquipped ? (
                <View style={[styles.buyButton, styles.equippedButton]}>
                  <Text style={styles.buyButtonText}>Équipé</Text>
                </View>
              ) : isUnlocked ? (
                <TouchableOpacity
                  style={[styles.buyButton, styles.equipButton]}
                  onPress={() =>
                    isBgTab ? onEquipBackground(bgId) : onEquipIcon(iconId)
                  }
                >
                  <Text style={styles.buyButtonText}>Équiper</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.buyButton,
                    !canBuy && styles.buyButtonDisabled,
                  ]}
                  disabled={!canBuy}
                  onPress={() =>
                    handleBuyItem(
                      isBgTab ? bgId : iconId,
                      item.price,
                      item.name,
                      isBgTab,
                    )
                  }
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
