import React, { useEffect, useState } from "react";
import styles from "./HideoutUpgrades.module.css"; // Import CSS module
import { fetchCrafts, fetchHideoutUpgrades } from "../../services/Services";
import { HideoutData } from "../../interfaces/hideoutupgrade";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { CraftingData } from "../../interfaces/crafts";

const HideoutUpgrades: React.FC = () => {
  const [hideoutUpgrades, setHideoutUpgrades] = useState<HideoutData>({
    hideoutStations: [],
  });

  const [setCrafts] = useState<CraftingData>({ crafts: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

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
      return "";
    }
  };

  useEffect(() => {
    const getHideoutData = async () => {
      try {
        const [fetchedHideoutUpgrades, fetchedCrafts] = await Promise.all([
          fetchHideoutUpgrades(),
          fetchCrafts(),
        ]);

        // Create a lookup map for crafting sources
        const craftSourceMap = new Map<string, string>();

        fetchedCrafts.crafts.forEach((craft) => {
          craft.rewardItems.forEach((reward) => {
            craftSourceMap.set(reward.item.name, craft.source);
          });
        });

        // Update hideoutUpgrades with source for required items
        const updatedHideoutUpgrades: HideoutData = {
          hideoutStations: fetchedHideoutUpgrades.hideoutStations.map(
            (station) => ({
              ...station,
              levels: station.levels.map((level) => ({
                ...level,
                itemRequirements: level.itemRequirements.map((req) => ({
                  ...req,
                  item: {
                    ...req.item,
                    source: craftSourceMap.get(req.item.name) || "",
                  },
                })),
              })),
            })
          ),
        };

        setHideoutUpgrades(updatedHideoutUpgrades);
        setCrafts(fetchedCrafts);
      } catch (err) {
        setError("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    getHideoutData();
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

  const allStations = Array.from(
    new Set(hideoutUpgrades.hideoutStations.map((station) => station.name))
  ).map((name) => ({ label: name, value: name }));

  const allLevels = Array.from(
    new Set(
      hideoutUpgrades.hideoutStations.flatMap((station) =>
        station.levels.map((level) => level.level)
      )
    )
  )
    .sort((a, b) => a - b)
    .map((level) => ({ label: `Level ${level}`, value: level }));

  const filteredHideouts = hideoutUpgrades.hideoutStations
    .filter((station) => !selectedStation || station.name === selectedStation)
    .map((station) => ({
      ...station,
      levels: station.levels.filter(
        (level) =>
          (!selectedLevel || level.level === selectedLevel) &&
          (!selectedItem ||
            level.itemRequirements.some((req) => req.item.name === selectedItem))
      ),
    }))
    .filter((station) => station.levels.length > 0); // Remove empty stations

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
          <div className={styles.filterContainer}>
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
          </div>
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
            {!selectedItem && (
              <Card
                key="aggregated-items"
                title={
                  <div className={styles.traderHeader}>
                    <i
                      className="pi pi-wrench"
                      style={{ fontSize: "3rem" }}
                    ></i>
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
                              className={isCraftable ? "" : "pi pi-times"}
                              style={{ color: isCraftable ? "" : "red" }}
                            ></i>
                          </span>
                        </li>
                      );
                    }
                  )}
                </ul>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HideoutUpgrades;
