import React, { useContext } from "react";
import styles from "./Lang.module.css";
import { LanguageContext } from "../language-context";

const Lang = () => {
  const { language, changeLanguage } = useContext(LanguageContext);

  const handleClick = () => {
    if (language === "en") {
      changeLanguage("hu");
    } else {
      changeLanguage("en");
    }
  };

  return (
    <div className={styles.root} onClick={handleClick}>
      {language}
    </div>
  );
};

export default Lang;
