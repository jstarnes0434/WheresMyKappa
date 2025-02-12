import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TasksList from "./pages/TaskList/TaskList";
import CultistCalculator from "./pages/CultistCalculator/CultistCalculator";
import GraphicHeader from "./components/graphicHeader/GraphicHeader";
import CollectorList from "./pages/CollectorList/CollectorList";
import Crafts from "./pages/Crafts/Crafts";

const App: React.FC = () => {
  return (
    <>
      <GraphicHeader />
      <Router>
        <div>
          {/* Navigation Bar */}
          <nav
            style={{
              padding: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Link to="/" style={navLinkStyle}>
              Tasks
            </Link>
            <Link to="/collector" style={navLinkStyle}>
              Collector
            </Link>
            <Link to="/cultistcalculator" style={navLinkStyle}>
              Cultist Calculator
            </Link>
            {/*  <Link to="/crafts" style={navLinkStyle}>
              Crafts
            </Link> */}
          </nav>

          {/* Page Content */}
          <div style={{ flex: 1, padding: "20px" }}>
            <Routes>
              <Route path="/" element={<TasksList />} />
              <Route path="/collector" element={<CollectorList />} />
              <Route path="/crafts" element={<Crafts />} />
              <Route
                path="/cultistcalculator"
                element={<CultistCalculator />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
};

// Navigation Link Styles
const navLinkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
  margin: "0 20px",

  borderRadius: "5px",
};

export default App;
