import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TasksList from "./pages/TaskList";
import ItemsList from "./pages/ItemList";
import CultistCalculator from "./pages/CultistCalculator/CultistCalculator";
import GraphicHeader from "./components/graphicHeader/GraphicHeader";

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
          </nav>

          {/* Page Content */}
          <div style={{ flex: 1, padding: "20px" }}>
            <Routes>
              <Route path="/" element={<TasksList />} />
              <Route path="/collector" element={<ItemsList />} />
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
  padding: "10px 15px",
  borderRadius: "5px",
  background: "rgba(255, 255, 255, 0.2)",
};

export default App;
