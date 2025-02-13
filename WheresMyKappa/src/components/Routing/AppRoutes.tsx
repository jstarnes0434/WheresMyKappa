import React from "react";
import { Routes, Route } from "react-router-dom";
import TasksList from "../../pages/TaskList/TaskList";
import CollectorList from "../../pages/CollectorList/CollectorList";
import Crafts from "../../pages/Crafts/Crafts";
import CultistCalculator from "../../pages/CultistCalculator/CultistCalculator";
import HideoutUpgrades from "../../pages/HideoutUpgrades/HideoutUpgrades";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TasksList />} />
      <Route path="/collector" element={<CollectorList />} />
      <Route path="/crafts" element={<Crafts />} />
      <Route path="/cultistcalculator" element={<CultistCalculator />} />
      <Route path="/hideoutUpgrades" element={<HideoutUpgrades />} />
    </Routes>
  );
};

export default AppRoutes;
