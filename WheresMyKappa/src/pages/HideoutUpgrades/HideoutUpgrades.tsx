import React, { useEffect, useState } from "react";
import styles from "./HideoutUpgrades.module.css"; // Import CSS module
import { fetchHideoutUpgrades } from "../../services/Services";
import { HideoutData } from "../../interfaces/hideoutupgrade";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";

const HideoutUpgrades: React.FC = () => {
  const [hideoutUpgrades, setHideoutUpgrades] = useState<HideoutData>({
    hideoutStations: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0 || minutes > 0) {
      if (hours > 0) {
        if (remainingMinutes > 0) {
          return `${hours} hours ${remainingMinutes} minutes`;
        } else {
          return `${hours} hours`;
        }
      } else {
        return `${minutes} minutes`;
      }
    } else {
      return "Instant";
    }
  };

  useEffect(() => {
    const getHideoutUpgrades = async () => {
      try {
        const fetchedCrafts = await fetchHideoutUpgrades();
        setHideoutUpgrades(fetchedCrafts);
      } catch (err) {
        setError("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };
    getHideoutUpgrades();
  }, []);

  return (
    <div className={styles.pageContainer}>
      {loading ? (
        <div className={styles.loadingScreen}>
          <ProgressSpinner />
        </div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.tasksContainer}>
          {hideoutUpgrades.hideoutStations.map((hideout) => (
            <Card
              key={hideout.id}
              title={
                <div className={styles.traderHeader}>
                  <img
                    src={hideout.imageLink}
                    alt={hideout.name}
                    className={styles.traderImage}
                  />
                  <div>{hideout.name}</div>
                </div>
              }
              className={styles.traderCard}
            >
              {hideout.levels.map((level) => (
                <div key={level.id} className={styles.levelContainer}>
                  <h3>Level {level.level}</h3>
                  <p>{level.description}</p>
                  <p>Construction Time: {formatTime(level.constructionTime)}</p>
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
                                ? "pi pi-check"
                                : "pi pi-times"
                            }
                            style={{
                              color:
                                req.item.craftsFor.length > 0 ? "green" : "red",
                            }}
                          ></i>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HideoutUpgrades;
