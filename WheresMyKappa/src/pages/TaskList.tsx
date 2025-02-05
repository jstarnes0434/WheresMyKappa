import React, { useState, useEffect } from "react";
import { fetchTasks } from "../services/tarkovTaskService"; // Import the service
import { Card } from "primereact/card"; // PrimeReact Card component
import styles from "./TaskList.module.css"; // Import the CSS module
import { Task } from "../interfaces/task";
import ProgressTracker from "../components/ProgressTracker/progresstracker";
import TaskHeader from "../components/TasksHeader/TasksHeader";
import { ProgressSpinner } from "primereact/progressspinner";

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<{ [key: string]: boolean }>(
    () => {
      const savedCheckedTasks = localStorage.getItem("checkedTasks");
      return savedCheckedTasks ? JSON.parse(savedCheckedTasks) : {};
    }
  );
  const [showCheckedTasks, setShowCheckedTasks] = useState<boolean>(true); // Toggle state

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

  const onTaskClick = (taskId: string) => {
    setCheckedTasks((prev) => {
      const updatedCheckedTasks = {
        ...prev,
        [taskId]: !prev[taskId],
      };

      localStorage.setItem("checkedTasks", JSON.stringify(updatedCheckedTasks));
      return updatedCheckedTasks;
    });
  };

  const filteredTasks = tasks?.filter((task) => task.kappaRequired);

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

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className={styles.pageContainer}>
        <TaskHeader
          showCheckedTasks={showCheckedTasks}
          onSwitchChange={setShowCheckedTasks} // Update the switch state
        />
        <ProgressTracker
          totalTasks={filteredTasks.length}
          checkedTasks={checkedTasks}
        />
        <div className={styles.tasksContainer}>
          {Object.keys(tasksToDisplay).map((traderName) => (
            <Card
              key={traderName}
              title={
                <div className={styles.traderHeader}>
                  <img
                    src={tasksToDisplay[traderName][0].trader.imageLink}
                    alt={traderName}
                    className={styles.traderImage}
                  />
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
                        <div>
                          <a
                            href={task.wikiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {task.name} - Level {task.minPlayerLevel}
                          </a>
                        </div>
                        <div>
                          <img
                            src={task.taskImageLink}
                            alt={task.name}
                            className={styles.taskImage}
                          />
                        </div>

                        {task.taskRequirements && (
                          <>
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
                          </>
                        )}

                        <div></div>
                      </div>
                    </div>

                    <div>
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
          ))}
        </div>
      </div>
    </>
  );
};

export default TasksList;
