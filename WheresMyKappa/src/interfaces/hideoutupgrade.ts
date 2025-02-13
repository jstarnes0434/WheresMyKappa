export interface Item {
  name: string;
  craftsFor: Craft[];
}

export interface Craft {
  requiredItems: RequiredItem[];
}

export interface RequiredItem {
  item: Item;
}

export interface ItemRequirement {
  id: string;
  count: number;
  item: Item;
}

export interface Level {
  description: string;
  constructionTime: number;
  id: string;
  level: number;
  itemRequirements: ItemRequirement[];
}

export interface HideoutStation {
  name: string;
  normalizedName: string;
  imageLink: string;
  id: string;
  levels: Level[];
}

export interface HideoutData {
  hideoutStations: HideoutStation[];
}
