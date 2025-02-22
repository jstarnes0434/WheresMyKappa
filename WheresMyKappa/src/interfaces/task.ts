export interface Trader {
  name: string;
  imageLink: string;
}

export interface Objective {
  description: string;
  maps: Map[];
}

export interface Task {
  id: string;
  lightkeeperRequired: boolean;
  name: string;
  taskImageLink: string;
  taskRequirements: RequiredTask[];
  minPlayerLevel: number; 
  wikiLink: string;
  objectives: Objective[]; // Correct type for objectives array
  kappaRequired: boolean;
  descriptionMessageId: string | null;
  trader: Trader;
  map: Map;
}

export interface RequiredTask {
  task: Task;
}

export interface Map {
  name: string;
}

export interface TaskData {
  tasks: Task[];
}

export interface ApiResponse {
  data: TaskData;
}
