import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navLink}>
        Tasks
      </Link>
      <Link to="/collector" className={styles.navLink}>
        Collector
      </Link>
      <Link to="/cultistcalculator" className={styles.navLink}>
        Cultist Calculator
      </Link>
      <Link to="/hideoutupgrades" className={styles.navLink}>
        Hideout Upgrades
      </Link>
      <Link to="/RequiredFIRItems" className={styles.navLink}>
        Required FIR Items
      </Link>
    </nav>
  );
};

export default Navbar;
