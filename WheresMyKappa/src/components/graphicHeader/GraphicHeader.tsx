import background from "../../assets/EFTFooter2.jpg";
import TarkovClock from "../TarkovTime/TarkovTime"; // Import the TarkovClock component
import styles from "./GraphicHeader.module.css";

const GraphicHeader: React.FC = () => {
  return (
    <>
      <div className={styles.fullScreenContainer}>
        <div className={styles.clockLeft}>
          <TarkovClock raidSide="left" />
        </div>
        <div className={styles.graphicWrapper}>
          <img src={background} alt="Tarkov Background" />
        </div>
        <div className={styles.clockRight}>
          <TarkovClock raidSide="right" />
        </div>
      </div>
    </>
  );
};

export default GraphicHeader;
