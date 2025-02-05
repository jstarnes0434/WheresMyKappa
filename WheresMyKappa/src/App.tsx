import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import background from "../src/assets/KappaBackground.jpeg";
import TasksList from "./pages/TaskList";
import ItemsList from "./pages/ItemList";

const App: React.FC = () => {
  return (
    <Router>
      <div
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
          <Link to="/items" style={navLinkStyle}>
            Items
          </Link>
        </nav>

        {/* Page Content */}
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<TasksList />} />
            <Route path="/items" element={<ItemsList />} />
          </Routes>
        </div>
      </div>
    </Router>
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
