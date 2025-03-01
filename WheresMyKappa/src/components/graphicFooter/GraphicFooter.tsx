import React from "react";
import background from "../../assets/EFTFooter.jpeg";
import styles from "./GraphicFooter.module.css";

const GraphicFooter: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.graphicWrapper}>
        <img src={background} alt="Tarkov Background" />{" "}
      </div>
    </div>
  );
};

export default GraphicFooter;
