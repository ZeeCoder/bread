import React, { useEffect, useState, useContext } from "react";
import styles from "./SW.module.css";
import { LanguageContext } from "../language-context";
import * as serviceWorker from "./serviceWorker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlug, faRedoAlt } from "@fortawesome/free-solid-svg-icons";

const STATE__INSTALLED = "installed";
const STATE__UPDATED = "updated";

const SW = () => {
  const { trans } = useContext(LanguageContext);
  const [state, setState] = useState(null);
  const [show, setShow] = useState(false);

  const showState = state => {
    setState(state);
    setTimeout(() => setShow(true), 20);
  };

  const hideState = () => setShow(false);

  useEffect(() => {
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.register({
      onSuccess: () => showState(STATE__INSTALLED),
      onUpdate: () => showState(STATE__UPDATED)
    });
  }, []);

  if (state === STATE__INSTALLED || state === STATE__UPDATED) {
    const isInstalled = state === STATE__INSTALLED;

    return (
      <div
        className={`${styles.root} ${show ? styles.show : ""}`}
        onClick={hideState}
      >
        {isInstalled ? trans.appInstalled : trans.appUpdated}
        <FontAwesomeIcon
          icon={isInstalled ? faPlug : faRedoAlt}
          className={styles.icon}
        />
      </div>
    );
  }

  return null;
};

export default SW;
