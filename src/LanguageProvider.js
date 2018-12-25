import React, { Component } from "react";
import localforage from "localforage";
import { LanguageContext } from "./language-context";
import translations from "./translations";

const getCurrentLanguage = async () => {
  try {
    const language = await localforage.getItem("language");

    if (language) {
      return language;
    }
  } catch (error) {
    console.error(`Failed to fetch language stored: ${error}.`);
  }

  return navigator.language.includes("en") ? "en" : "hu";
};

class LanguageProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      language: null,
      changeLanguage: this.changeLanguage,
      trans: {}
    };
  }

  changeLanguage = async language => {
    this.setState({
      language,
      trans: translations[language]
    });

    localforage.setItem("language", language).catch(error => {
      console.error(`Failed to save language selection: ${error}.`);
    });
  };

  async componentDidMount() {
    const language = await getCurrentLanguage();

    this.setState({
      language,
      trans: translations[language]
    });
  }

  render() {
    if (!this.state.language) {
      return null;
    }

    return (
      <LanguageContext.Provider value={this.state}>
        {this.props.children}
      </LanguageContext.Provider>
    );
  }
}

export default LanguageProvider;
