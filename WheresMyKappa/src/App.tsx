import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import GraphicHeader from "./components/graphicHeader/GraphicHeader";
import styles from "./App.module.css"; // Import CSS module
import AppRoutes from "./components/Routing/AppRoutes";
import GraphicFooter from "./components/graphicFooter/GraphicFooter";
import Navbar from "./components/navbar/navbar";

const App: React.FC = () => {
  return (
    <>
      <GraphicHeader />
      <Router>
        <div className={styles.container}>
          <Navbar />
          <div className={styles.content}>
            <AppRoutes /> {/* Use the extracted routes component */}
          </div>
        </div>
      </Router>
      <GraphicFooter />
    </>
  );
};

export default App;
