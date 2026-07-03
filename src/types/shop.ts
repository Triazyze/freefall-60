import { BackgroundKey } from "../constants/background";

export interface ShopScreenProps {
  totalStars: number;
  onUpdateStars: (newStars: number) => void;
  onBackToMenu: () => void;
  unlockedBackgrounds: BackgroundKey[];
  currentBackground: BackgroundKey;
  onEquipBackground: (id: BackgroundKey) => void;
  onUnlockBackground: (id: BackgroundKey) => void;
  unlockedIcons: string[];
  currentIcon: string;
  onEquipIcon: (id: string) => void;
  onUnlockIcon: (id: string) => void;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  icon?: string;
  image?: string;
}