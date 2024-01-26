import React from "react";
import styles from "./LoadingSpinner.module.css"; // Import the CSS file

interface LoadingSpinnerProps {
  darkMode: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ darkMode }) => {
  // Use the darkMode prop to conditionally apply classes for dark mode
  const loaderClass = darkMode ? styles.loaderDark : styles.loader;

  return (
    <div className={loaderClass}>
      <div className={styles.duo + " " + styles.duo1}>
        <div className={styles.dot + " " + styles.dotA}></div>
        <div className={styles.dot + " " + styles.dotB}></div>
      </div>
      <div className={styles.duo + " " + styles.duo2}>
        <div className={styles.dot + " " + styles.dotA}></div>
        <div className={styles.dot + " " + styles.dotB}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
