import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import Hamburger from "hamburger-react";
import FeedbackPrompt from "../feedbackPrompt/FeedbackPrompt";

const Navbar: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleModal = () => {
    setOpen(false);
    setShowModal((prevState) => !prevState);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <nav className={styles.navbar}>
        {/* Hamburger Icon */}
        <div className={styles.hamburger}>
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>

        {/* Navigation Menu (Click outside to close) */}
        <div
          ref={menuRef}
          className={`${styles.navLinks} ${isOpen ? styles.showMenu : ""}`}
        >
          <Link
            to="/kappatasks"
            className={styles.navLink}
            onClick={() => setOpen(false)}
          >
            Kappa Tasks
          </Link>
          <Link
            to="/collector"
            className={styles.navLink}
            onClick={() => setOpen(false)}
          >
            Collector
          </Link>
          <Link
            to="/cultistcalculator"
            className={styles.navLink}
            onClick={() => setOpen(false)}
          >
            Cultist Calculator
          </Link>
          <Link
            to="/hideoutupgrades"
            className={styles.navLink}
            onClick={() => setOpen(false)}
          >
            Hideout Upgrades
          </Link>
          <Link
            to="/RequiredFIRItems"
            className={styles.navLink}
            onClick={() => setOpen(false)}
          >
            Required FIR Items
          </Link>
          <Link
            to="/lightkeepertasks"
            className={styles.navLink}
            onClick={() => setOpen(false)}
          >
            Lightkeeper Tasks
          </Link>

          {/* Mobile Links for Feedback & Donate at the bottom of the menu */}
          <div className={styles.mobileBottomLinks}>
            <Link to="#" onClick={toggleModal} className={styles.navLink}>
              Feedback
            </Link>
            <Link
              to="https://buymeacoffee.com/jstarnes0434"
              target="_blank"
              className={styles.navLink}
            >
              Donate
            </Link>
            <Link
              to="/newfeatures" // Internal route to NewFeatures page
              className={styles.navLink}
            >
              New Features
            </Link>
          </div>
        </div>
      </nav>
      <FeedbackPrompt visible={showModal} onClose={toggleModal} />
    </>
  );
};

export default Navbar;
