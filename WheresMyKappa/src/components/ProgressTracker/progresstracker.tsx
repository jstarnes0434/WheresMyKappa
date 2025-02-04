import React, { useEffect, useState } from "react";
import styles from "../ProgressTracker/progresstracker.module.css";
import { ProgressBar } from "primereact/progressbar";

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
      <ProgressBar
        value={progress}
        showValue={true} // Show percentage value on the progress bar
        className={styles.progressBar} // Custom CSS for progress bar style
      />
      <h3 className={styles.progressTitle}>
        {Object.values(checkedTasks).filter(Boolean).length} / {totalTasks}
      </h3>
    </div>
  );
};

export default ProgressTracker;
