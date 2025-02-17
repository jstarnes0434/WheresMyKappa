import React from "react";
import background from "../../assets/EFTFooter2.jpg";
import TarkovClock from "../TarkovTime/TarkovTime"; // Import the TarkovClock component
import styles from "./GraphicHeader.module.css";

const GraphicHeader: React.FC = () => {
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

export default GraphicHeader;
