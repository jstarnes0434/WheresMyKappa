import React from "react";
import styles from "./TasksHeader.module.css"; // You can create a CSS module to style this component
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
    <>
      <div className={styles.headerContainer}>
        <div className={styles.switchContainer}>
          Show Checked Tasks
          <div className="p-inputswitch">
            <InputSwitch
              checked={showCheckedTasks}
              onChange={(e) => onSwitchChange(e.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskHeader;
