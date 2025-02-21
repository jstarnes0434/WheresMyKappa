import React from "react";
import GraphicHeader from "./components/graphicHeader/GraphicHeader";
import styles from "./App.module.css"; // Import CSS module
import AppRoutes from "./components/Routing/AppRoutes";
import GraphicFooter from "./components/graphicFooter/GraphicFooter";
import Navbar from "./components/navbar/navbar";
import Topbar from "./components/Topbar/Topbar";

const App: React.FC = () => {
  return (
    <>
      <Topbar />
      <GraphicHeader />
      <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
          <AppRoutes /> {/* Use the extracted routes component */}
        </div>
      </div>

      <GraphicFooter />
    </>
  );
};

export default App;
