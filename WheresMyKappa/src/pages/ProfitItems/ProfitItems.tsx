import React, { useState, useEffect } from "react";
import styles from "./CollectorList.module.css";
import { ProgressSpinner } from "primereact/progressspinner";
import { Item } from "../../interfaces/items";
import { fetchItems } from "../../services/Services";

const ProfitItems: React.FC = () => {
  const [, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return <div className={styles.pageContainer}></div>;
};

export default ProfitItems;
