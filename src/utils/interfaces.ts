type ArmorSlots = "head" | "legs" | "torso" | "feet";

type Armor =
  | "leggings"
  | "chestplate"
  | "helmet"
  | "boots"
  | "cap"
  | "tunic"
  | "pants"
  | "shield"
  | "totem"
  | "sword";

interface ServerConfig {
  host: string;
  port: number;
  username: string;
  version: string;
  owner: string;
}

interface BotSettingsState {
  isLoggedIn: boolean;
  isSpawned: boolean;
  isAfraid: boolean;
  isSneaking: boolean;
  isFollowing: boolean;
  isSleeping: boolean;
  isLooking: boolean;
  willCook: boolean;
  hasFood: boolean;
  isCooking: boolean;
  hasFuel: boolean;
}

interface BotData {
  username: string
  armor: Armor[];
  armor_destinations: { [key: string]: string };
  cookable: string[];
  cooked: string[];
  armor_slots: ArmorSlots[];
  health: number;
  owner: string;
  goal: any;
  pvp: any;
  boatID: any;
}

export { ServerConfig, BotSettingsState, BotData };
