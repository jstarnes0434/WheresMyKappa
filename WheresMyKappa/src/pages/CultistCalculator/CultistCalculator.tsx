import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { ProgressSpinner } from "primereact/progressspinner";
import styles from "./CultistCalculator.module.css";
import { fetchAllItems } from "../../services/Services";
import { Item } from "../../interfaces/items";

const CultistCalculator: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<(Item | null)[]>(
    Array(5).fill(null)
  );
  const [filteredItems, setFilteredItems] = useState<Item[][]>(
    Array(5).fill([])
  );

  useEffect(() => {
    const getItems = async () => {
      try {
        const fetchedItems = await fetchAllItems();
        setItems(fetchedItems);
      } catch (err) {
        setError("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  const searchItems = (index: number, event: { query: string }) => {
    const query = event.query.toLowerCase();
    setFilteredItems((prev) => {
      const updatedFilteredItems = [...prev];
      updatedFilteredItems[index] = items.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
      return updatedFilteredItems;
    });
  };

  const handleItemChange = (index: number, item: Item | null) => {
    const updatedSelectedItems = [...selectedItems];
    updatedSelectedItems[index] = item;
    setSelectedItems(updatedSelectedItems);
  };

  const totalBasePrice = selectedItems.reduce(
    (sum, item) => sum + (item?.basePrice || 0),
    0
  );

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <ProgressSpinner />
      </div>
    );
  }

  function formatMoney(amount: number): string {
    return amount?.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className={styles.pageContainer}>
        <h2 className={styles.pageTitle}>Select Items</h2>
        <div className={styles.inputContainer}>
          {selectedItems.map((selectedItem, index) => (
            <div key={index} className={styles.inputWrapper}>
              <div className={styles.inputWithClear}>
                <AutoComplete
                  panelClassName={styles.panelClass}
                  className={styles.autocompleteinput}
                  value={selectedItem}
                  suggestions={filteredItems[index]}
                  completeMethod={(e) => searchItems(index, e)}
                  itemTemplate={(item) => (
                    <div className={styles.itemListWrapper}>
                      <div className={styles.itemListDetail}>
                        <div className={styles.panellistitem}>{item.name}</div>
                        <div className={styles.panellistprice}>
                          Base Price: ₽ {formatMoney(item.basePrice)} <br />
                          Est Flea Price: ₽ {formatMoney(item.basePrice)}
                        </div>
                      </div>
                    </div>
                  )}
                  selectedItemTemplate={(item) => (item ? `${item.name}` : "")}
                  onChange={(e) => handleItemChange(index, e.value)}
                  placeholder="Start typing an item name"
                />
                {selectedItem && (
                  <button
                    className={styles.clearButton}
                    onClick={() => handleItemChange(index, null)}
                  >
                    ✕
                  </button>
                )}
              </div>
              {selectedItem && (
                <div className={styles.basePrice}>
                  Base Price: ₽ {formatMoney(selectedItem.basePrice)}
                </div>
              )}
            </div>
          ))}
        </div>
        <h3
          className={`${styles.totalPrice} ${
            totalBasePrice > 400000 ? styles.greenText : ""
          }`}
        >
          Total Base Price: ₽ {formatMoney(totalBasePrice)}
        </h3>

        {totalBasePrice < 400000 && (
          <p className={styles.remainingAmount}>
            ₽ {formatMoney(400000 - totalBasePrice)} left to reach ₽ 400,000
          </p>
        )}
      </div>
    </>
  );
};

export default CultistCalculator;
