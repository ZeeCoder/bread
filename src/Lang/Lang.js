import React, { Component } from "react";
import styles from "./Lang.module.css";
import { LanguageContext } from "../language-context";

class Lang extends Component {
  handleClick(language, changeLanguage) {
    if (language === "en") {
      changeLanguage("hu");
    } else {
      changeLanguage("en");
    }
  }

  render() {
    return (
      <LanguageContext.Consumer>
        {({ language, changeLanguage }) => (
          <div
            className={styles.root}
            onClick={() => this.handleClick(language, changeLanguage)}
          >
            {language}
          </div>
        )}
      </LanguageContext.Consumer>
    );
  }
}

export default Lang;
