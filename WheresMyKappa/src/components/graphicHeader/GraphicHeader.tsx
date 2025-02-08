import React from "react";
import background from "../../assets/KappaBackground.jpeg";
import styles from "./GraphicHeader.module.css"

const GraphicHeader: React.FC = ({}) => {
  return (
    <>
      <div className={styles.graphicWrapper}>
        <img src={background} />
      </div>     
    </>
  );
};

export default GraphicHeader;
