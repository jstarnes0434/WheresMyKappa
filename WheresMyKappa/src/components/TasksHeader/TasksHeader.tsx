import React from 'react';
import { InputSwitch } from 'primereact/inputswitch'; // Import InputSwitch component
import styles from './TasksHeader.module.css'; // You can create a CSS module to style this component

interface TaskHeaderProps {
  showCheckedTasks: boolean;
  onSwitchChange: (checked: boolean) => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ showCheckedTasks, onSwitchChange }) => {
  return (
    <div className={styles.headerContainer}>
      <h2 className={styles.headerTitle}>Tasks</h2>
      <div className={styles.switchContainer}>
        <span>Show Checked Tasks</span>
        <InputSwitch
          checked={showCheckedTasks}
          onChange={(e) => onSwitchChange(e.value)} // Pass the value when the switch is changed
        />
      </div>
    </div>
  );
};

export default TaskHeader;
