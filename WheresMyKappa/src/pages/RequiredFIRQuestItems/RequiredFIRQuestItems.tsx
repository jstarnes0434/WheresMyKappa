import React, { useEffect, useState } from "react";
import styles from "./RequiredFIRQuestItems.module.css"; // Import CSS module
import { fetchRequiredFIRQuestItems } from "../../services/Services";
import { ProgressSpinner } from "primereact/progressspinner";
import { RequiredFIRTask } from "../../interfaces/requiredFIRQuestItem";

const RequiredFIRQuestItemsPage: React.FC = () => {
  const [, setRequiredFirItems] = useState<RequiredFIRTask[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRequiredFIRItems = async () => {
      try {
        const fetchedFIRItems = await fetchRequiredFIRQuestItems();
        console.log(fetchedFIRItems);
        setRequiredFirItems(fetchedFIRItems);
      } catch (err) {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    getRequiredFIRItems(); // Ensure the function is called inside useEffect
  }, []); // Dependency array should be properly closed

  return (
    <div className={styles.pageContainer}>
      {loading ? (
        <div className={styles.loadingScreen}>
          <ProgressSpinner />
        </div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <div>test</div>
          {/*  <div className={styles.filterContainer}>
            <Dropdown
              value={selectedStation}
              options={allStations}
              onChange={(e) => setSelectedStation(e.value)}
              placeholder="Filter by Hideout Station"
              className={styles.dropdownFilter}
              showClear
              filter
            />
            <Dropdown
              value={selectedLevel}
              options={allLevels}
              onChange={(e) => setSelectedLevel(e.value)}
              placeholder="Filter by Level"
              className={styles.dropdownFilter}
              showClear
            />
            <Dropdown
              value={selectedItem}
              options={allItems}
              onChange={(e) => setSelectedItem(e.value)}
              placeholder="Filter by Required Item"
              className={styles.dropdownFilter}
              showClear
              filter
            />
          </div>*/}
          {/* <div className={styles.tasksContainer}>
            {requiredFirItems.map((task) => (
              <Card
                key={task.name}
                title={
                  <div className={styles.traderHeader}>
                    <div>{task.name}</div>
                  </div>
                }
                className={styles.traderCard}
              >
                {task.objectives.map((objective) => (
                  <div key={level.id} className={styles.levelContainer}>
                    <h3>Level {level.level}</h3>
                    <p>{level.description}</p>
                    <p>
                      Construction Time: {formatTime(level.constructionTime)}
                    </p>
                    <h4>Requirements:</h4>
                    <ul className={styles.requirementsList}>
                      {level.itemRequirements.map((req) => (
                        <li key={req.id} className={styles.itemRequirement}>
                          <span className={styles.itemText}>
                            {req.count}x {req.item.name}
                          </span>
                          <span className={styles.icon}>
                            <i
                              className={
                                req.item.craftsFor.length > 0
                                  ? ""
                                  : "pi pi-times"
                              }
                              style={{
                                color:
                                  req.item.craftsFor.length > 0 ? "" : "red",
                              }}
                            ></i>
                            <span style={{ color: "green" }}>
                              {" "}
                              {req.item.source}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Card>
            ))}
          </div> */}
        </>
      )}
    </div>
  );
};

export default RequiredFIRQuestItemsPage;
