import React from "react";
import styles from "./SkeletonLoader.module.css";
import { Skeleton } from "primereact/skeleton";

const SkeletonLoader: React.FC = () => {
  return (
    <div className={styles.container}>
      <Skeleton height="20rem" width="50rem"></Skeleton>
    </div>
  );
};

export default SkeletonLoader;
