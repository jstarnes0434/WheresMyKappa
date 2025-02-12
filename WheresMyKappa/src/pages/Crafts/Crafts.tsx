import React, { useState, useEffect } from "react";
import styles from "./Crafts.module.css";
import { ProgressSpinner } from "primereact/progressspinner";
import { fetchCrafts } from "../../services/Services";
import { CraftingData } from "../../interfaces/crafts";
import { Tooltip } from "primereact/tooltip";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const Crafts: React.FC = () => {
  const [crafts, setCrafts] = useState<CraftingData>({ crafts: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<{
    [key: string]: boolean;
  }>({});
  const [filterItem, setFilterItem] = useState<string | null>(null); // Filter is initially null
  const [searchInput, setSearchInput] = useState<string>(""); // Search input is initially empty

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  useEffect(() => {
    const getItems = async () => {
      try {
        const fetchedCrafts = await fetchCrafts();
        setCrafts(fetchedCrafts);

        // Initialize expandedGroups to have all groups expanded
        const initialExpandedGroups: { [key: string]: boolean } = {};
        fetchedCrafts.crafts.forEach((craft) => {
          if (!initialExpandedGroups[craft.sourceName]) {
            initialExpandedGroups[craft.sourceName] = true; // Set true to expand by default
          }
        });
        setExpandedGroups(initialExpandedGroups); // Set the expanded groups state
      } catch (err) {
        setError("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  const allRewardItemNames = Array.from(
    new Set(
      crafts.crafts.flatMap(
        (craft) =>
          craft.rewardItems
            ?.map((reward) => reward.item?.shortName)
            .filter(Boolean) // Ensure no null or undefined values are included
      )
    )
  );

  const groupedCrafts = crafts.crafts.reduce((groups, craft) => {
    if (!groups[craft.sourceName]) {
      groups[craft.sourceName] = [];
    }
    groups[craft.sourceName].push(craft);
    return groups;
  }, {} as { [key: string]: CraftingData["crafts"] });

  const sortedGroups = Object.keys(groupedCrafts)
    .sort()
    .map((sourceName) => {
      const sortedCrafts = groupedCrafts[sourceName].sort((a, b) =>
        a.source.localeCompare(b.source)
      );
      return { sourceName, crafts: sortedCrafts };
    });

  const filteredCrafts = sortedGroups.map((group) => {
    const filteredCrafts = group.crafts.filter((craft) => {
      const hasMatchingReward = craft.rewardItems?.some((reward) => {
        const shortName = reward.item?.shortName?.toLowerCase() || ""; // Default to empty string if null or undefined
        return (
          // If no filter or search input is set, return all items
          (!filterItem && !searchInput) ||
          (filterItem && shortName === filterItem.toLowerCase()) ||
          (searchInput && shortName.includes(searchInput.toLowerCase()))
        );
      });
      return hasMatchingReward;
    });

    return { ...group, crafts: filteredCrafts };
  });

  const toggleGroup = (sourceName: string) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [sourceName]: !prevState[sourceName],
    }));
  };

  // Clear filter logic
  const clearFilters = () => {
    setFilterItem(null); // Clear the selected dropdown filter
    setSearchInput(""); // Clear the search input field
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
          <div className={styles.filterBar}>
            <Dropdown
              value={filterItem}
              options={allRewardItemNames.map((name) => ({
                label: name,
                value: name,
              }))}
              onChange={(e) => setFilterItem(e.value)}
              placeholder="Select Reward Item"
              className={styles.filterDropdown}
            />
            <InputText
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Reward Item"
              className={styles.filterInput}
            />
            <Button
              label="Clear Filters"
              icon="pi pi-times"
              onClick={clearFilters}
              className="p-button-secondary"
            />
          </div>
          <div className={styles.craftsContainer}>
            <Tooltip />
            {filteredCrafts.map((group) => (
              <div key={group.sourceName} className={styles.groupCard}>
                <div className={styles.groupHeader}>
                  <h2>{group.sourceName}</h2>
                  <i
                    className={`${
                      expandedGroups[group.sourceName]
                        ? "pi pi-caret-up"
                        : "pi pi-caret-down"
                    } ${styles.caretIcon}`}
                    onClick={() => toggleGroup(group.sourceName)}
                  ></i>
                </div>
                {expandedGroups[group.sourceName] && (
                  <div className={styles.craftsList}>
                    {group.crafts.map((craft) => (
                      <div key={craft.id} className={styles.craftsCard}>
                        <div className={styles.cardHeader}>
                          <div className={styles.craftSource}>
                            {craft.source}
                          </div>
                          <div className={styles.craftDuration}>
                            {formatDuration(craft.duration)}
                          </div>
                        </div>
                        <div className={styles.cardDetails}>
                          {/* Required Items (Left) */}
                          <div className={styles.requiredSection}>
                            {craft.requiredItems?.map((required, index) =>
                              required.item ? (
                                <div
                                  key={index}
                                  className={styles.itemCard}
                                  data-pr-tooltip={required.item.name}
                                  data-pr-position="top"
                                >
                                  <img
                                    src={required.item.image512pxLink}
                                    alt={required.item.name}
                                    className={styles.requiredImg}
                                  />
                                  <div className={styles.itemName}>
                                    {required.item.shortName}
                                  </div>
                                </div>
                              ) : null
                            )}
                          </div>

                          {/* Arrow (Middle) */}
                          <div className={styles.arrow}>
                            <i
                              className="pi pi-arrow-right"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>

                          {/* Reward Items (Right) */}
                          <div className={styles.rewardSection}>
                            {craft.rewardItems?.map((reward, index) =>
                              reward.item ? (
                                <div key={index} className={styles.itemCard}>
                                  <img
                                    src={reward.item.image512pxLink}
                                    alt={reward.item.name}
                                    className={styles.rewareImg}
                                  />
                                  <div className={styles.itemName}>
                                    <a href={reward.item.wikiLink}>
                                      {reward.item.shortName}
                                    </a>
                                  </div>
                                </div>
                              ) : null
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Crafts;
