import React, { useState, useEffect } from "react";
import { fetchLightKeeperTasks } from "../../services/Services"; // Import the service
import { Card } from "primereact/card"; // PrimeReact Card component
import { Dropdown } from "primereact/dropdown"; // PrimeReact Dropdown component
import { ProgressSpinner } from "primereact/progressspinner";
import { ToggleButton } from "primereact/togglebutton"; // PrimeReact ToggleButton component
import styles from "./Lightkeeper.module.css"; // Import the CSS module
import { Task } from "../../interfaces/task";
import ProgressTracker from "../../components/ProgressTracker/progresstracker";

const LightKeeper: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<{ [key: string]: boolean }>(
    () => {
      const savedCheckedTasks = localStorage.getItem("checkedTasks");
      return savedCheckedTasks ? JSON.parse(savedCheckedTasks) : {};
    }
  );
  const [showCheckedTasks, setShowCheckedTasks] = useState<boolean>(() => {
    // Initialize from localStorage or default to true
    const savedShowCheckedTasks = localStorage.getItem("showCheckedTasks");
    return savedShowCheckedTasks ? JSON.parse(savedShowCheckedTasks) : true;
  });
  const [selectedMap, setSelectedMap] = useState<string | null>(null); // Selected map for filtering

  useEffect(() => {
    const getTasks = async () => {
      try {
        const fetchedTasks = await fetchLightKeeperTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, []);

  const onTaskClick = (taskId: string) => {
    setCheckedTasks((prev) => {
      const updatedCheckedTasks = { ...prev, [taskId]: !prev[taskId] };
      localStorage.setItem("checkedTasks", JSON.stringify(updatedCheckedTasks));
      return updatedCheckedTasks;
    });
  };

  // Extract unique task map names for dropdown, accounting for null maps
  const uniqueMaps = Array.from(
    new Set(tasks.map((task) => task.map?.name).filter((mapName) => mapName))
  );

  // Filter tasks based on the selected map
  const filteredTasks = tasks.filter((task) => {
    return (
      task.lightkeeperRequired &&
      (selectedMap ? task.map?.name === selectedMap : true) &&
      (selectedTask ? task.id === selectedTask : true) // Task selection filter
    );
  });

  const countFilteredTasks = tasks.filter((task) => {
    return task.lightkeeperRequired;
  });

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const traderName = task.trader.name;
    if (!groups[traderName]) {
      groups[traderName] = [];
    }
    groups[traderName].push(task);
    return groups;
  }, {} as { [key: string]: Task[] });

  // Show or hide checked tasks based on the switch
  const tasksToDisplay = Object.keys(groupedTasks).reduce(
    (result, traderName) => {
      const traderTasks = groupedTasks[traderName].filter(
        (task) => showCheckedTasks || !checkedTasks[task.id]
      );
      if (traderTasks.length > 0) {
        result[traderName] = traderTasks;
      }
      return result;
    },
    {} as { [key: string]: Task[] }
  );

  // Save the showCheckedTasks value in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("showCheckedTasks", JSON.stringify(showCheckedTasks));
  }, [showCheckedTasks]);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <>
      <div className={styles.pageContainer}>
        <ProgressTracker
          totalTasks={countFilteredTasks.length}
          checkedTasks={checkedTasks}
        />

        {/* Dropdown to filter tasks by task map */}
        <div className={styles.filterRow}>
          {/* Map Selection Dropdown */}
          <div>
            <Dropdown
              value={selectedMap}
              options={uniqueMaps.map((map) => ({ label: map, value: map }))}
              onChange={(e) => setSelectedMap(e.value)}
              placeholder="Select a Map"
              showClear
            />
          </div>

          {/* Task Selection Dropdown */}
          <div>
            <Dropdown
              value={selectedTask}
              options={tasks
                .map((task) => ({ label: task.name, value: task.id }))
                .sort((a, b) => a.label.localeCompare(b.label))} // Sorting alphabetically
              onChange={(e) => setSelectedTask(e.value)}
              placeholder="Select a Task"
              showClear
            />
          </div>

          {/* Toggle Completed Tasks */}
          <div className={styles.toggleContainer}>
            <ToggleButton
              checked={!showCheckedTasks}
              onChange={() => setShowCheckedTasks((prev) => !prev)}
              onLabel="Show Completed Quests"
              offLabel="Hide Completed Quests"
            />
          </div>
        </div>

        <div className={styles.tasksContainer}>
          {Object.keys(tasksToDisplay).length > 0 ? (
            Object.keys(tasksToDisplay).map((traderName) => (
              <Card
                key={traderName}
                title={
                  <div className={styles.traderHeader}>
                    <img
                      src={tasksToDisplay[traderName][0].trader.imageLink}
                      alt={traderName}
                      className={styles.traderImage}
                    />
                    <div>{traderName}</div>
                  </div>
                }
                className={styles.traderCard}
              >
                <div>
                  {tasksToDisplay[traderName].map((task) => (
                    <Card
                      key={task.id}
                      className={`${styles.taskCard} ${
                        checkedTasks[task.id] ? styles.checkedTask : ""
                      }`}
                      onClick={() => onTaskClick(task.id)}
                    >
                      <div className={styles.taskCardHeader}>
                        <div>
                          <a
                            href={task.wikiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className={styles.taskName}>{task.name}</span>
                            <span className={styles.minPlayerLevel}>
                              - Level {task.minPlayerLevel}
                            </span>
                          </a>
                        </div>
                        <div className={styles.mapName}>
                          {task.map?.name && <div>{task.map?.name}</div>}
                        </div>
                        <div>
                          <img
                            src={task.taskImageLink}
                            className={styles.taskImage}
                          />
                        </div>
                        <div className={styles.taskRequirements}>
                          {task.taskRequirements && (
                            <>
                              <div className={styles.taskSubHeader}>
                                Requirements:
                              </div>
                              <ul>
                                {task.taskRequirements.map(
                                  (requirement, index) =>
                                    requirement.task ? (
                                      <li key={index}>
                                        {requirement.task.name}
                                      </li>
                                    ) : null
                                )}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>

                      <div className={styles.taskObjectives}>
                        <div className={styles.taskSubHeader}>
                          Task Objectives:
                        </div>
                        {task.objectives?.map((objective, index) => (
                          <li key={index}>{objective.description}</li>
                        ))}
                        <br />
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            ))
          ) : (
            <div className={styles.noTasksFound}>No Tasks Found</div> // Display when no tasks match
          )}
        </div>
      </div>
    </>
  );
};

export default LightKeeper;
