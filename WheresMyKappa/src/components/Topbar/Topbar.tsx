import { Button } from "primereact/button";
import styles from "./Topbar.module.css";
import FeedbackPrompt from "../feedbackPrompt/FeedbackPrompt";
import { useState } from "react";

const Topbar: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
  };

  return (
    <>
      <div className={styles.topbarcontainer}>
        <Button className={styles.feedbackButton} onClick={toggleModal}>
          Feedback
        </Button>
      </div>

      <FeedbackPrompt visible={showModal} onClose={toggleModal}  />
    </>
  );
};

export default Topbar;
