import React, { useEffect, useState, useContext } from "react";
import styles from "./AddToHomeScreen.module.css";
import { LanguageContext } from "../language-context";

/**
 * Showing add to homescreen button for the user as soon as possible
 * (This also enables the PWA to be added on windows as a "desktop" app)
 * @see https://www.youtube.com/watch?v=msA284Q6yZU&t=161s&list=WL&index=10
 * @see https://love2dev.com/blog/beforeinstallprompt/
 */
const AddToHomeScreen = () => {
  const { trans } = useContext(LanguageContext);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = event => {
      event.preventDefault();
      setEvent(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  if (!event) {
    return null;
  }

  const handlePrompt = () => event.prompt();
  const handleHide = () => setEvent(null);

  return (
    <div className={styles.root}>
      <button className={styles.addToHome} onClick={handlePrompt}>
        {trans.addToHome}
      </button>
      <button className={styles.hide} onClick={handleHide}>
        {trans.hideAddToHome}
      </button>
    </div>
  );
};

export default AddToHomeScreen;
