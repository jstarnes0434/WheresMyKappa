import React, { useEffect, useState } from "react";
import styles from "./RequiredFIRItems.module.css";
import {
  fetchRequiredFIRQuestItems,
  fetchHideoutUpgrades,
} from "../../services/Services";
import {
  HideoutStation,
  Level,
  ItemRequirement,
} from "../../interfaces/hideoutupgrade";

import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import {
  Objective,
  RequiredFIRTask,
} from "../../interfaces/requiredFIRQuestItem";

interface AggregatedItem {
  total: number;
  hideoutTotal: number;
  taskTotal: number;
  tasks: { taskName: string; count: number }[];
  hideout: { station: string; level: number; count: number }[];
}

const RequiredFIRItems: React.FC = () => {
  const [aggregatedItems, setAggregatedItems] = useState<
    Map<string, AggregatedItem>
  >(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    const aggregateItems = async () => {
      try {
        const [fetchedHideout, fetchedTasks] = await Promise.all([
          fetchHideoutUpgrades(),
          fetchRequiredFIRQuestItems(),
        ]);

        const itemMap = new Map<string, AggregatedItem>();

        fetchedHideout.hideoutStations.forEach((station: HideoutStation) => {
          station.levels.forEach((level: Level) => {
            level.itemRequirements.forEach((req: ItemRequirement) => {
              const itemName = req.item.name;
              if (!itemMap.has(itemName)) {
                itemMap.set(itemName, {
                  total: 0,
                  hideoutTotal: 0,
                  taskTotal: 0,
                  tasks: [],
                  hideout: [],
                });
              }
              itemMap.get(itemName)!.total += req.count;
              itemMap.get(itemName)!.hideoutTotal += req.count;
              itemMap.get(itemName)!.hideout.push({
                station: station.name,
                level: level.level,
                count: req.count,
              });
            });
          });
        });

        fetchedTasks.forEach((task: RequiredFIRTask) => {
          task.objectives.forEach((obj: Objective) => {
            if (obj.foundInRaid && obj.item) {
              const itemName = obj.item.name;
              if (!itemMap.has(itemName)) {
                itemMap.set(itemName, {
                  total: 0,
                  hideoutTotal: 0,
                  taskTotal: 0,
                  tasks: [],
                  hideout: [],
                });
              }
              itemMap.get(itemName)!.total += obj.count || 1;
              itemMap.get(itemName)!.taskTotal += obj.count || 1;
              itemMap.get(itemName)!.tasks.push({
                taskName: task.name,
                count: obj.count || 1,
              });
            }
          });
        });

        setAggregatedItems(itemMap);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    aggregateItems();
  }, []);

  const filteredItems = [...aggregatedItems.entries()].filter(
    ([itemName, data]) => {
      const query = searchQuery.toLowerCase();
      return (
        (!selectedItem || itemName === selectedItem) &&
        (itemName.toLowerCase().includes(query) ||
          data.tasks.some((task) =>
            task.taskName.toLowerCase().includes(query)
          ) ||
          data.hideout.some((hideout) =>
            hideout.station.toLowerCase().includes(query)
          ))
      );
    }
  );

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
          <div className={styles.searchContainer}>
            <div className={styles.searchInputs}>
              <Dropdown
                value={selectedItem}
                options={[...aggregatedItems.keys()].map((item) => ({
                  label: item,
                  value: item,
                }))}
                onChange={(e) => setSelectedItem(e.value)}
                placeholder="Select an item"
                className={styles.dropdownFilter}
              />
              <InputText
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items, tasks, or stations"
                className={styles.searchInput}
              />
            </div>
          </div>
          <div className={styles.tasksContainer}>
            {filteredItems.map(([itemName, data]) => (
              <Card key={itemName} className={styles.itemCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.itemName}>{itemName}</span>
                  <span className={styles.totalCount}>{data.total}</span>
                </div>
                {data.hideout.length > 0 && (
                  <div className={styles.questContainer}>
                    <h3 className={styles.sectionHeader}>Hideout</h3>
                    <ul className={styles.questList}>
                      {data.hideout.map((entry, index) => (
                        <li key={index} className={styles.questRequirement}>
                          <span className={styles.questName}>
                            {entry.station} (Level {entry.level})
                          </span>
                          <span className={styles.itemCount}>
                            {entry.count}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className={styles.sectionTotal}>
                      Total from Hideout: {data.hideoutTotal}
                    </div>
                  </div>
                )}
                {data.tasks.length > 0 && (
                  <div className={styles.questContainer}>
                    <h3 className={styles.sectionHeader}>Tasks</h3>
                    <ul className={styles.questList}>
                      {data.tasks.map((entry, index) => (
                        <li key={index} className={styles.questRequirement}>
                          <span className={styles.questName}>
                            {entry.taskName}
                          </span>
                          <span className={styles.itemCount}>
                            {entry.count}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className={styles.sectionTotal}>
                      Total from Tasks: {data.taskTotal}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RequiredFIRItems;
