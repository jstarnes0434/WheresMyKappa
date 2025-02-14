import React, { useEffect, useState } from "react";
import styles from "./RequiredFIRItems.module.css";
import { fetchCrafts, fetchHideoutUpgrades } from "../../services/Services";
import { HideoutData } from "../../interfaces/hideoutupgrade";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { CraftingData } from "../../interfaces/crafts";

const RequiredFIRItems: React.FC = () => {
  const [hideoutUpgrades, setHideoutUpgrades] = useState<HideoutData>({
    hideoutStations: [],
  });
  const [, setCrafts] = useState<CraftingData>({ crafts: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    const getHideoutData = async () => {
      try {
        const [fetchedHideoutUpgrades, fetchedCrafts] = await Promise.all([
          fetchHideoutUpgrades(),
          fetchCrafts(),
        ]);

        const craftSourceMap = new Map<string, string>();
        fetchedCrafts.crafts.forEach((craft) => {
          craft.rewardItems.forEach((reward) => {
            craftSourceMap.set(reward.item.name, craft.source);
          });
        });

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

  const itemMap = new Map<
    string,
    {
      stations: { name: string; level: number; count: number }[];
      total: number;
    }
  >();

  hideoutUpgrades.hideoutStations.forEach((station) => {
    station.levels.forEach((level) => {
      level.itemRequirements.forEach((req) => {
        const itemName = req.item.name;
        const itemCount = req.count;

        if (!itemMap.has(itemName)) {
          itemMap.set(itemName, { stations: [], total: 0 });
        }

        itemMap.get(itemName)!.stations.push({
          name: station.name,
          level: level.level,
          count: itemCount,
        });

        itemMap.get(itemName)!.total += itemCount;
      });
    });
  });

  const allItems = Array.from(itemMap.keys())
    .sort()
    .map((name) => ({ label: name, value: name }));

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
            {[...itemMap.entries()].map(([itemName, { stations, total }]) => (
              <Card
                key={itemName}
                title={
                  <div className={styles.traderHeader}>
                    <span className={styles.itemName}>{itemName}</span>
                    <span className={styles.totalCount}>{total}</span>
                  </div>
                }
                className={styles.traderCard}
              >
                <div className={styles.questContainer}>
                  <h3>Quest</h3>
                  <ul className={styles.questList}>
                    {stations.map((station) => (
                      <li
                        key={`${station.name}-${station.level}`}
                        className={styles.questRequirement}
                      >
                        <span className={styles.questName}>
                          {station.name} (Level {station.level})
                        </span>
                        <span className={styles.itemCount}>
                          {station.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RequiredFIRItems;
