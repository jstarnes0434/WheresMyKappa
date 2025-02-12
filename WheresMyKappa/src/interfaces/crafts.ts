export interface CraftingData {
  crafts: Craft[];
}

export interface Craft {
  id: string;
  duration: number;
  source: string;
  sourceName: string;
  level: number;
  rewardItems: RewardItem[];
  requiredItems: RequiredItem[];
}

export interface RewardItem {
  item: Item;
}

export interface RequiredItem {
  item: Item;
 
}

export interface Item {
  name: string;
  shortName: string;
  baseImageLink: string;
  image512pxLink: string;
}
