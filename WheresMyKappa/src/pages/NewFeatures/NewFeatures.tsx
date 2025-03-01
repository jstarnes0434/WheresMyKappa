import React, { useEffect } from "react";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import styles from "./NewFeatures.module.css";

interface Feature {
  id: string;
  name: string;
  description: string;
}

interface FeatureGroup {
  date: string; // Format: "YYYY-MM-DD"
  features: Feature[];
}

const NewFeatures: React.FC = () => {
  const [loading] = React.useState<boolean>(false);

  const featureGroups: FeatureGroup[] = [
    {
      date: "2025-03-01",
      features: [
        {
          id: "lightkeeper-tasks",
          name: "Added Lightkeeper Tasks",
          description: "Added a page to show all lightkeeper tasks",
        },
        {
          id: "task-sync",
          name: "Task Synchronization",
          description:
            "Checked tasks now sync between TasksList and LightKeeper pages.",
        },
        {
          id: "task-requirements",
          name: "Task Requirements Auto-Check",
          description:
            "Checking a task automatically checks all its prerequisite tasks.",
        },
        {
          id: "hidden-hideout-levels",
          name: "Hide/Show Hideout Levels",
          description:
            "Can now show/hide hideout levels. This should make it easier to keep track of completed hideout levels.",
        },
      ],
    },
  ].sort((a: FeatureGroup, b: FeatureGroup): number => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  useEffect(() => {
    if (featureGroups.length > 0) {
      const latestDate = featureGroups[0].date; // Latest date after sorting
      localStorage.setItem("latestFeatureDate", latestDate);
    }
  }, [featureGroups]);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>New Features</h1>
      <div className={styles.featuresContainer}>
        {featureGroups.map((group) => (
          <Card
            key={group.date}
            title={
              <div className={styles.featureHeader}>
                <div>
                  {new Date(group.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            }
            className={styles.featureCard}
          >
            <div>
              {group.features.map((feature) => (
                <div key={feature.id} className={styles.featureItem}>
                  <h3 className={styles.featureName}>{feature.name}</h3>
                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ))}
        {featureGroups.length === 0 && (
          <div className={styles.noFeatures}>No new features added yet.</div>
        )}
      </div>
    </div>
  );
};

export default NewFeatures;
