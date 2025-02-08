export interface Item {
  id: string;
  name: string;
  wikiLink: string;
  basePrice: number;
  avg24hPrice: number;
  image512pxLink: string;
  shortName: string;
  description: string;
  weight: number;
  category: {
    name: string;
  };
}

export interface ItemData {
  items: Item[];
}
