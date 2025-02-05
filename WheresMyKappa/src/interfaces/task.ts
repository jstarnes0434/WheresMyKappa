export interface Trader {
  name: string;
  imageLink: string;
}

export interface Objective {
  description: string;
}

export interface Task {
  id: string;
  name: string;
  taskImageLink: string;
  taskRequirements: RequiredTask[];
  minPlayerLevel: number;
  wikiLink:string;
  objectives: Objective[]; // Correct type for objectives array
  kappaRequired: boolean;
  descriptionMessageId: string | null;
  trader: Trader;
}

export interface RequiredTask {
  task: Task;
}


export interface TaskData {
  tasks: Task[];
}

export interface ApiResponse {
  data: TaskData;
}
