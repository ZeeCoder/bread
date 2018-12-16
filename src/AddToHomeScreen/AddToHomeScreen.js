import React, { Component } from "react";
import styles from "./AddToHomeScreen.module.css";

/**
 * Showing add to homescreen button for the user as soon as possible
 * (This also enables the PWA to be added on windows as a "desktop" app)
 * @see https://www.youtube.com/watch?v=msA284Q6yZU&t=161s&list=WL&index=10
 * @see https://love2dev.com/blog/beforeinstallprompt/
 */
class AddToHomeScreen extends Component {
  state = {
    installPromptEvent: null
  };

  componentDidMount() {
    window.addEventListener(
      "beforeinstallprompt",
      this.handleBeforeInstallPrompt
    );
  }

  componentWillUnmount() {
    window.removeEventListener("beforeinstallprompt");
  }

  handleBeforeInstallPrompt = event => {
    event.preventDefault();
    this.setState({ installPromptEvent: event });
  };

  handleAddToHome = () => {
    this.state.installPromptEvent.prompt();
  };

  handleHide = () => this.setState({ installPromptEvent: null });

  render() {
    if (!this.state.installPromptEvent) {
      return null;
    }

    return (
      <div className={styles.root}>
        <button className={styles.addToHome} onClick={this.handleAddToHome}>
          Add To Home Screen
        </button>
        <button className={styles.hide} onClick={this.handleHide}>
          Hide
        </button>
      </div>
    );
  }
}

export default AddToHomeScreen;
