import React from "react";
import background from "../../assets/EFTFooter.jpeg";
import TarkovClock from "../TarkovTime"; // Import the TarkovClock component
import styles from "./GraphicFooter.module.css";

const GraphicFooter: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Left Raid Time */}
      <div className={styles.clockLeft}>
        <TarkovClock raidSide="left" />
      </div>

      {/* Graphic Image */}
      <div className={styles.graphicWrapper}>
        <img src={background} alt="Tarkov Background" />
      </div>

      {/* Right Raid Time */}
      <div className={styles.clockRight}>
        <TarkovClock raidSide="right" />
      </div>
    </div>
  );
};

export default GraphicFooter;
