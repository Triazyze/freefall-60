import { ItemType } from "../components/Items";

export const PARAMS = {
  PLAYER_SIZE: 40,
  ITEM_SIZE: 30,
  INITIAL_SCROLL_SPEED: 200,
  MAX_SCROLL_SPEED: 750,
  ACCELERATION_RATE: 0.02,
  PIXELS_PER_METER: 15,
  INITIAL_DISTANCE_BETWEEN_ITEMS: 100 + Math.random() * 200
};

export const SPAWN_TABLE = [
    { type: "BONUS" as ItemType,         weight: 0.20 },
    { type: "SUPERBONUS" as ItemType,    weight: 0.10 },
    { type: "OBSTACLE" as ItemType,      weight: 0.30 },
    { type: "MOBILEOBSTACLE" as ItemType,weight: 0.10 }, 
    { type: "NOTHING" as ItemType,       weight: 0.30 },
  ];


export interface GameObject {
  id: string;
  x: number;
  y: number;
  type: ItemType;
  vx?: number;
}
