export interface RequiredFIRTaskItem {
    name: string;
  }
  
  export interface Objective {
    id?: string;
    count?: number;
    foundInRaid?: boolean;
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
