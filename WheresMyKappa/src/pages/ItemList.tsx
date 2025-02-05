import React, { useState, useEffect } from "react";
import { fetchItems } from "../services/tarkovTaskService";
import { Card } from "primereact/card";
import styles from "./ItemList.module.css";
import { ProgressSpinner } from "primereact/progressspinner";
import { Item } from "../interfaces/items";

const ItemsList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    () => {
      const savedCheckedItems = localStorage.getItem("checkedItems");
      return savedCheckedItems ? JSON.parse(savedCheckedItems) : {};
    }
  );

  useEffect(() => {
    const getItems = async () => {
      try {
        const fetchedItems = await fetchItems();
        setItems(fetchedItems);
      } catch (err) {
        setError("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, []);

  const onItemClick = (itemId: string) => {
    setCheckedItems((prev) => {
      const updatedCheckedItems = {
        ...prev,
        [itemId]: !prev[itemId],
      };

      localStorage.setItem("checkedItems", JSON.stringify(updatedCheckedItems));
      return updatedCheckedItems;
    });
  };

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
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Items Needed: {items.length}</h2>

      <div className={styles.itemsContainer}>
        {items.map((item) => (
          <Card
            key={item.id}
            className={`${styles.itemCard} ${
              checkedItems[item.id] ? styles.checkedItem : ""
            }`}
            onClick={() => onItemClick(item.id)}
          >
            <div>
              <img src={item.image512pxLink} className={styles.imagePicture} />
            </div>
            <div className={styles.itemCardHeader}>{item.name}</div>
            <div className={styles.itemDescription}>{item.description}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
