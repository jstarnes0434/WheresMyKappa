import React from "react";
import background from "../src/assets/KappaBackground.jpeg";
import TasksList from "./pages/TaskList";


const App: React.FC = () => {
  return (
    <div>
      <div
       style={{
        backgroundImage: `url(${background})`,
        backgroundSize: '100% 100%', // Stretch image to fit full screen
        backgroundPosition: 'center', // Center the image
        height: '100vh', // Make sure the container takes up full viewport height
        width: '100%', // Ensure it takes up the full width
      }}
      >
        <TasksList /> {/* Render the TaskList component */}
      </div>
    </div>
  );
};

export default App;
