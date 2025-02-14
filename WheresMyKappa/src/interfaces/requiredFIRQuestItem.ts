export interface RequiredFIRTaskItem {
  name: string;
  craftsFor?: RequiredItem[];
}

export interface RequiredItem {
  requiredItems: RequiredCraftItem[];
}

export interface RequiredCraftItem {
  item: ItemDetails;
}

export interface ItemDetails {
  name: string;
}

export interface Objective {
  id?: string;
  count?: number;
  foundInRaid?: boolean;
  description?: string;
  type?: string;
  item?: RequiredFIRTaskItem;
}

export interface RequiredFIRTask {
  experience: number;
  name: string;
  objectives: Objective[];
}

export interface RequiredFIRTaskData {
  tasks: RequiredFIRTask[];
}
