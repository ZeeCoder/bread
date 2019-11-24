import React, { useContext } from "react";
import styles from "./App.module.css";
import AddToHomeScreen from "../AddToHomeScreen/AddToHomeScreen";
import Lang from "../Lang/Lang";
import { LanguageContext } from "../language-context";
import PackageJSON from "../../package.json";
import Calculator from "../Calculator/Calculator";
import DefaultRecipe from "../DefaultRecipe";
import SW from "../ServiceWorker/SW";

const { version } = PackageJSON;

const App = () => {
  const { trans } = useContext(LanguageContext);

  return (
    <div className={styles.root}>
      <SW />
      <div className={styles.app}>
        <AddToHomeScreen />
        <div className={styles.titleRow}>
          <Lang />
        </div>
        <Calculator recipe={DefaultRecipe} />
      </div>

      <h2 className={styles.contactTitle}>{trans.contact}</h2>
      <div className={styles.contacts}>
        <a className={styles.contactButton} href="mailto:rpgmorpheus@gmail.com">
          E-mail
        </a>
        <a
          className={styles.contactButton}
          href="https://twitter.com/zeecoder"
          rel="noopener noreferrer"
          target="_blank"
        >
          Twitter
        </a>
      </div>
      <div className={styles.version}>v{version}</div>
    </div>
  );
};

export default App;
