import React from "react";
import styles from "./TasksHeader.module.css";
import { InputSwitch } from "primereact/inputswitch";

interface TaskHeaderProps {
  showCheckedTasks: boolean;
  onSwitchChange: (checked: boolean) => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  showCheckedTasks,
  onSwitchChange,
}) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.switchContainer}>
        <label htmlFor="checkedTasksSwitch" className={styles.switchLabel}>
          Show Checked Tasks
        </label>
        <InputSwitch
          id="checkedTasksSwitch"
          checked={showCheckedTasks}
          onChange={(e) => onSwitchChange(e.value)}
        />
      </div>
    </div>
  );
};

export default TaskHeader;
