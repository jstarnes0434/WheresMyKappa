import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import GraphicHeader from "./components/graphicHeader/GraphicHeader";
import styles from "./App.module.css"; // Import CSS module
import AppRoutes from "./components/Routing/AppRoutes";

const App: React.FC = () => {
  return (
    <>
      <GraphicHeader />
      <Router>
        <div className={styles.container}>
          {/* Navigation Bar */}
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
            {/*  <Link to="/crafts" className={styles.navLink}>
              Crafts
            </Link>  */}
          </nav>

          {/* Page Content */}
          <div className={styles.content}>
            <AppRoutes /> {/* Use the extracted routes component */}
          </div>
        </div>
      </Router>
    </>
  );
};

export default App;
