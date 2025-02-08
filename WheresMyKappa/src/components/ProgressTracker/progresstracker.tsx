import React, { useEffect, useState } from "react";
import styles from "../ProgressTracker/progresstracker.module.css";

interface ProgressTrackerProps {
  totalTasks: number;
  checkedTasks: { [key: string]: boolean };
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  totalTasks,
  checkedTasks,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (totalTasks > 0) {
      const checkedCount = Object.values(checkedTasks).filter(Boolean).length;
      const percentage = Math.round((checkedCount / totalTasks) * 100);
      setProgress(percentage);
    }
  }, [totalTasks, checkedTasks]);

  return (
    <div className={styles.progressContainer}>
      <h3 className={styles.progressTitle}>Task Completion: {progress}%</h3>
      <h3 className={styles.progressTitle}>
        {Object.values(checkedTasks).filter(Boolean).length} / {totalTasks} Tasks Completed
      </h3>
    </div>
  );
};

export default ProgressTracker;
