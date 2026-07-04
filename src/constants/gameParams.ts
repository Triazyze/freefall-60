import { ItemType } from "../components/Items";

export interface GameConfig {
    PLAYER_SIZE: number;
    ITEM_SIZE: number;
    INITIAL_SCROLL_SPEED: number;
    MAX_SCROLL_SPEED: number;
    ACCELERATION_RATE: number;
    PIXELS_PER_METER: number;
    INITIAL_DISTANCE_BETWEEN_ITEMS: number;
    SPAWN_TABLE: { type: ItemType; weight: number }[];
}
export interface GameObject {
    id: string;
    x: number;
    y: number;
    type: ItemType;
    vx?: number;
}

export type GameMode = "NORMAL" | "HARDCORE" | "WEIRD";

const CONFIGS: Record<GameMode, GameConfig> = {
    NORMAL: {
        PLAYER_SIZE: 40,
        ITEM_SIZE: 30,
        INITIAL_SCROLL_SPEED: 200,
        MAX_SCROLL_SPEED: 750,
        ACCELERATION_RATE: 0.02,
        PIXELS_PER_METER: 15,
        INITIAL_DISTANCE_BETWEEN_ITEMS: 100 + Math.random() * 200,
        SPAWN_TABLE: [
            { type: "BONUS", weight: 0.20 },
            { type: "SUPERBONUS", weight: 0.10 },
            { type: "OBSTACLE", weight: 0.30 },
            { type: "MOBILEOBSTACLE", weight: 0.10 },
            { type: "NOTHING", weight: 0.30 },
        ]
    },
    HARDCORE: {
        PLAYER_SIZE: 45,
        ITEM_SIZE: 35,
        INITIAL_SCROLL_SPEED: 350,
        MAX_SCROLL_SPEED: 1100,
        ACCELERATION_RATE: 0.05,
        PIXELS_PER_METER: 15,
        INITIAL_DISTANCE_BETWEEN_ITEMS: 80 + Math.random() * 150,
        SPAWN_TABLE: [
            { type: "BONUS", weight: 0.10 },
            { type: "SUPERBONUS", weight: 0.02 },
            { type: "OBSTACLE", weight: 0.45 },
            { type: "MOBILEOBSTACLE", weight: 0.25 },
            { type: "NOTHING", weight: 0.18 },
        ]
    },
    WEIRD: {
        PLAYER_SIZE: 60,
        ITEM_SIZE: 25,
        INITIAL_SCROLL_SPEED: 120,
        MAX_SCROLL_SPEED: 3000,
        ACCELERATION_RATE: 0.1,
        PIXELS_PER_METER: 15,
        INITIAL_DISTANCE_BETWEEN_ITEMS: 120 + Math.random() * 300,
        SPAWN_TABLE: [
            { type: "BONUS", weight: 0.40 },
            { type: "SUPERBONUS", weight: 0.20 },
            { type: "OBSTACLE", weight: 0.30 },
            { type: "MOBILEOBSTACLE", weight: 0.00 },
            { type: "NOTHING", weight: 0.30 },
        ]
    }
};

export const getGameParams = (mode: GameMode): GameConfig => {
    return CONFIGS[mode] || CONFIGS.NORMAL;
};