import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import styles from "./Topbar.module.css";
import FeedbackPrompt from "../feedbackPrompt/FeedbackPrompt";

const Topbar: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [shouldBlink, setShouldBlink] = useState<boolean>(false); // Controls blinking
  const [isNew, setIsNew] = useState<boolean>(false); // Controls yellow text
  const navigate = useNavigate();

  useEffect(() => {
    const latestFeatureDate = localStorage.getItem("latestFeatureDate");
    const lastVisited = localStorage.getItem("lastVisitedNewFeatures");

    if (latestFeatureDate) {
      const currentDate = new Date("2025-03-01"); // Fixed date as per your setup
      const featureDate = new Date(latestFeatureDate);
      const timeDifference = currentDate.getTime() - featureDate.getTime();
      const dayDifference = timeDifference / (1000 * 3600 * 24);

      // Check if the feature is within 3 days
      const isRecent = dayDifference <= 3 && dayDifference >= 0;

      if (isRecent) {
        setIsNew(true); // Always yellow if recent
        if (!lastVisited || new Date(lastVisited) < featureDate) {
          setShouldBlink(true); // Blink if not visited or new features added since last visit
        } else {
          setShouldBlink(false); // Stop blinking if visited and no new features
        }
      } else {
        setIsNew(false); // Not recent, no yellow
        setShouldBlink(false); // Not recent, no blinking
      }
    }
  }, []);

  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
  };

  const handleNewFeaturesClick = () => {
    navigate("/newfeatures");
    // Set the last visited date to now
    localStorage.setItem("lastVisitedNewFeatures", new Date().toISOString());
    setShouldBlink(false); // Stop blinking after visiting
  };

  return (
    <>
      <div className={styles.topbarcontainer}>
        <Button className={styles.feedbackButton} onClick={toggleModal}>
          Requests/Feedback
        </Button>
        <Button
          className={styles.feedbackButton}
          onClick={() =>
            window.open("https://buymeacoffee.com/jstarnes0434", "_blank")
          }
        >
          Donate
        </Button>
        <Button
          className={`${styles.feedbackButton} ${
            isNew
              ? shouldBlink
                ? styles.newFeaturesBlink
                : styles.newFeaturesStatic
              : ""
          }`}
          onClick={handleNewFeaturesClick}
        >
          New Features
        </Button>
      </div>

      <FeedbackPrompt visible={showModal} onClose={toggleModal} />
    </>
  );
};

export default Topbar;
