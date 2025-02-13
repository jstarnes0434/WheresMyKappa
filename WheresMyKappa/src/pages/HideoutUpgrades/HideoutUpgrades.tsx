import React, { useEffect, useState } from "react";
import styles from "./HideoutUpgrades.module.css"; // Import CSS module
import { fetchHideoutUpgrades } from "../../services/Services";
import { HideoutData } from "../../interfaces/hideoutupgrade";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";

const HideoutUpgrades: React.FC = () => {
  const [hideoutUpgrades, setHideoutUpgrades] = useState<HideoutData>({
    hideoutStations: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

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

  const allItems = Array.from(
    new Set(
      hideoutUpgrades.hideoutStations.flatMap((station) =>
        station.levels.flatMap((level) =>
          level.itemRequirements.map((req) => req.item.name)
        )
      )
    )
  )
    .sort()
    .map((name) => ({ label: name, value: name }));

  const filteredHideouts = selectedItem
    ? hideoutUpgrades.hideoutStations.filter((station) =>
        station.levels.some((level) =>
          level.itemRequirements.some((req) => req.item.name === selectedItem)
        )
      )
    : hideoutUpgrades.hideoutStations;

  const getAggregatedItemRequirements = () => {
    const itemTotals: { [key: string]: number } = {};

    hideoutUpgrades.hideoutStations.forEach((station) => {
      station.levels.forEach((level) => {
        level.itemRequirements.forEach((req) => {
          const itemName = req.item.name;
          itemTotals[itemName] = (itemTotals[itemName] || 0) + req.count;
        });
      });
    });

    return itemTotals;
  };

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
          <Dropdown
            value={selectedItem}
            options={allItems}
            onChange={(e) => setSelectedItem(e.value)}
            placeholder="Filter by Required Item"
            className={styles.dropdownFilter}
            showClear
            filter
          />
          <div className={styles.tasksContainer}>
            {/* New Card for Aggregated Items */}

            {/* Existing Hideout Station Cards */}
            {filteredHideouts.map((hideout) => (
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
                    <p>Construction Time: {level.constructionTime} seconds</p>
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
                                  req.item.craftsFor.length > 0
                                    ? "green"
                                    : "red",
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
            <Card
              key="aggregated-items"
              title={
                <div className={styles.traderHeader}>
                  <i className="pi pi-wrench" style={{ fontSize: "3rem" }}></i>
                  <div>Total Item Requirements</div>
                </div>
              }
              className={styles.traderCard}
            >
              <ul className={styles.requirementsList}>
                {Object.entries(getAggregatedItemRequirements()).map(
                  ([itemName, totalCount]) => {
                    const item = hideoutUpgrades.hideoutStations
                      .flatMap((station) =>
                        station.levels.flatMap(
                          (level) => level.itemRequirements
                        )
                      )
                      .find((req) => req.item.name === itemName)?.item;

                    const isCraftable = item
                      ? item.craftsFor.length > 0
                      : false;

                    return (
                      <li key={itemName} className={styles.itemRequirement}>
                        <span className={styles.itemText}>
                          {totalCount}x {itemName}
                        </span>
                        <span className={styles.icon}>
                          <i
                            className={
                              isCraftable ? "pi pi-check" : "pi pi-times"
                            }
                            style={{ color: isCraftable ? "green" : "red" }}
                          ></i>
                        </span>
                      </li>
                    );
                  }
                )}
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default HideoutUpgrades;
