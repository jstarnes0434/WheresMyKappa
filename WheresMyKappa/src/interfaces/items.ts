export interface Item {
    id: string;
    name: string;
    wikiLink: string;
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
  