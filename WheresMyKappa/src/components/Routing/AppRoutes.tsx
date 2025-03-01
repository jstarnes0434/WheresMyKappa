import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TasksList from "../../pages/TaskList/TaskList";
import CollectorList from "../../pages/CollectorList/CollectorList";
import Crafts from "../../pages/Crafts/Crafts";
import CultistCalculator from "../../pages/CultistCalculator/CultistCalculator";
import HideoutUpgrades from "../../pages/HideoutUpgrades/HideoutUpgrades";
import RequiredFIRItemsPage from "../../pages/RequiredFIRItems/RequiredFIRItems";
import LightKeeper from "../../pages/lightkeeper/Lightkeeper";
import NewFeatures from "../../pages/NewFeatures/NewFeatures";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/kappatasks" replace />} />
      <Route path="/kappatasks" element={<TasksList />} />
      <Route path="/collector" element={<CollectorList />} />
      <Route path="/crafts" element={<Crafts />} />
      <Route path="/cultistcalculator" element={<CultistCalculator />} />
      <Route path="/hideoutUpgrades" element={<HideoutUpgrades />} />
      <Route path="/requiredFIRItems" element={<RequiredFIRItemsPage />} />
      <Route path="/newfeatures" element={<NewFeatures />} />
      <Route path="/lightkeepertasks" element={<LightKeeper />} />
    </Routes>
  );
};

export default AppRoutes;
