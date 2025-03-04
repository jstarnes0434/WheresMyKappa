import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { postFeedbackData } from "../../services/Services";
import styles from "./FeedbackPrompt.module.css";

interface FeedbackPromptProps {
  visible: boolean;
  onClose: () => void;
}

const FeedbackPrompt: React.FC<FeedbackPromptProps> = ({
  visible,
  onClose,
}) => {
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<string | null>(null);
  const [pageName, setPageName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);

  const toastRef = useRef<Toast>(null); // Toast reference

  const feedbackTypes = [
    { label: "Feedback", value: "Feedback" },
    { label: "Bug", value: "Bug" },
    { label: "Request", value: "Request" },
  ];

  const pageNames = [
    { label: "Tasks", value: "Tasks" },
    { label: "Collector", value: "Collector" },
    { label: "Cultist Calculator", value: "CultistCalculator" },
    { label: "Hideout Upgrades", value: "HideoutUpgrades" },
    { label: "Required FIR Items", value: "RequiredFIRItems" },
    { label: "General", value: "General" },
  ];

  const handleSubmit = async () => {
    if (!feedbackType || !pageName || !feedback) return;

    setSubmitting(true);
    try {
      await postFeedbackData(feedbackType, pageName, feedback);
      setFeedback("");
      setFeedbackType(null);
      setPageName(null);
      setFeedbackSuccess(true);

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to submit feedback. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled =
    !feedbackType || !pageName || !feedback || submitting;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setFeedbackSuccess(false);
      onClose();
    }
  };

  if (!visible) return null;

  // Show success message (thumbs up and text) if submission is successful
  if (feedbackSuccess) {
    return (
      <div className={styles.modalOverlay} onClick={handleOverlayClick}>
        <div className={styles.modalContent} style={{ textAlign: "center" }}>
          <i className={`pi pi-thumbs-up ${styles.successIcon}`} />
          <div className={styles.successMessage}>
            Thank you for your feedback
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast ref={toastRef} />
      <div className={styles.modalOverlay} onClick={handleOverlayClick}>
        <div className={styles.modalContent}>
          <h3>Submit Feedback</h3>

          <div className={styles.dropdownContainer}>
            <Dropdown
              value={feedbackType}
              options={feedbackTypes}
              onChange={(e) => setFeedbackType(e.value)}
              placeholder="Select Feedback Type"
            />
          </div>

          <div className={styles.dropdownContainer}>
            <Dropdown
              value={pageName}
              options={pageNames}
              onChange={(e) => setPageName(e.value)}
              placeholder="Select Page Name"
            />
          </div>

          <div className={styles.inputtextContainer}>
            <InputTextarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here..."
              rows={5}
              autoResize
            />
          </div>

          <div className={styles.modalButtons}>
            {submitting && (
              <ProgressSpinner style={{ width: "25px", height: "25px" }} />
            )}
            {!submitting && (
              <Button
                label="Submit"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackPrompt;
