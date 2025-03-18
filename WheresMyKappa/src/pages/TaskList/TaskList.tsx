import React, { useState, useEffect } from "react";
import { fetchTasks } from "../../services/Services";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { ToggleButton } from "primereact/togglebutton";
import styles from "./TaskList.module.css";
import { Task } from "../../interfaces/task";
import ProgressTracker from "../../components/ProgressTracker/progresstracker";

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [hideTaskRequirements, setHideTaskRequirements] =
    useState<boolean>(false);
  const [checkedTasks, setCheckedTasks] = useState<{ [key: string]: boolean }>(
    () => {
      const savedCheckedTasks = localStorage.getItem("checkedTasks");
      return savedCheckedTasks ? JSON.parse(savedCheckedTasks) : {};
    }
  );
  const [showCheckedTasks, setShowCheckedTasks] = useState<boolean>(() => {
    const savedShowCheckedTasks = localStorage.getItem("showCheckedTasks");
    return savedShowCheckedTasks ? JSON.parse(savedShowCheckedTasks) : true;
  });
  const [selectedMap, setSelectedMap] = useState<string | null>(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, []);

  const checkRequiredTasks = (
    taskId: string,
    updatedCheckedTasks: { [key: string]: boolean }
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.taskRequirements) {
      task.taskRequirements.forEach((req) => {
        if (req.task && !updatedCheckedTasks[req.task.id]) {
          updatedCheckedTasks[req.task.id] = true;
          checkRequiredTasks(req.task.id, updatedCheckedTasks);
        }
      });
    }
  };

  const onTaskClick = (taskId: string) => {
    setCheckedTasks((prev) => {
      const isCurrentlyChecked = !!prev[taskId];
      const updatedCheckedTasks = { ...prev };

      if (!isCurrentlyChecked) {
        updatedCheckedTasks[taskId] = true;
        checkRequiredTasks(taskId, updatedCheckedTasks);
      } else {
        updatedCheckedTasks[taskId] = false;
      }

      localStorage.setItem("checkedTasks", JSON.stringify(updatedCheckedTasks));
      return updatedCheckedTasks;
    });
  };

  const uniqueMaps = Array.from(
    new Set(tasks.map((task) => task.map?.name).filter((mapName) => mapName))
  );

  const filteredTasks = tasks.filter((task) => {
    return (
      task.kappaRequired &&
      (selectedMap ? task.map?.name === selectedMap : true) &&
      (selectedTask ? task.id === selectedTask : true)
    );
  });

  const countFilteredTasks = tasks.filter((task) => task.kappaRequired);

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const traderName = task.trader.name;
    if (!groups[traderName]) {
      groups[traderName] = [];
    }
    groups[traderName].push(task);
    return groups;
  }, {} as { [key: string]: Task[] });

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
    <div className={styles.pageContainer}>
      <ProgressTracker
        title="Kappa Task Completion"
        totalTasks={countFilteredTasks.length}
        checkedTasks={checkedTasks}
      />
      <div className={styles.filterRow}>
        <div>
          <Dropdown
            value={selectedMap}
            options={uniqueMaps.map((map) => ({ label: map, value: map }))}
            onChange={(e) => setSelectedMap(e.value)}
            placeholder="Select a Map"
            showClear
          />
        </div>
        <div>
          <Dropdown
            value={selectedTask}
            options={tasks
              .map((task) => ({ label: task.name, value: task.id }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            onChange={(e) => setSelectedTask(e.value)}
            placeholder="Select a Task"
            showClear
          />
        </div>
        <div className={styles.toggleContainer}>
          <ToggleButton
            checked={!showCheckedTasks}
            onChange={() => setShowCheckedTasks((prev) => !prev)}
            onLabel="Show Completed Quests"
            offLabel="Hide Completed Quests"
          />
        </div>
        <div className={styles.toggleContainerTaskDetails}>
          <ToggleButton
            checked={hideTaskRequirements}
            onChange={() => setHideTaskRequirements((prev) => !prev)}
            onLabel="Hide Task Details"
            offLabel="Show Task Details"
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
                      hideTaskRequirements ? styles.minimalTaskCard : ""
                    } ${checkedTasks[task.id] ? styles.checkedTask : ""}`}
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
                          <div
                            className={
                              hideTaskRequirements ? styles.minimalTaskName : ""
                            }
                          >
                            <span className={styles.taskName}>{task.name}</span>
                          </div>
                          {!hideTaskRequirements && task.taskRequirements && (
                            <div>
                              <span className={styles.minPlayerLevel}>
                                Level {task.minPlayerLevel}
                              </span>
                            </div>
                          )}
                        </a>
                      </div>
                      {!hideTaskRequirements && task.taskRequirements && (
                        <>
                          <div className={styles.mapName}>
                            {task.map?.name && <div>{task.map.name}</div>}
                          </div>
                          <div>
                            <img
                              src={task.taskImageLink}
                              className={styles.taskImage}
                              alt={task.name}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    {!hideTaskRequirements && task.taskRequirements && (
                      <>
                        <div className={styles.taskRequirements}>
                          <div className={styles.taskSubHeader}>
                            Requirements:
                          </div>
                          <ul>
                            {task.taskRequirements.map((requirement, index) =>
                              requirement.task ? (
                                <li key={index}>{requirement.task.name}</li>
                              ) : null
                            )}
                          </ul>
                        </div>
                        <div className={styles.taskObjectives}>
                          <div className={styles.taskSubHeader}>
                            Task Objectives:
                          </div>
                          <ul>
                            {task.objectives?.map((objective, index) => (
                              <li key={index}>{objective.description}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            </Card>
          ))
        ) : (
          <div className={styles.noTasksFound}>No Tasks Found</div>
        )}
      </div>
    </div>
  );
};

export default TasksList;
