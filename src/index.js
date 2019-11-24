import React from "react";
import ReactDOM from "react-dom";
import App from "./App/App";
import "./styles.css";
import LanguageProvider from "./LanguageProvider";

ReactDOM.render(
  <LanguageProvider>
    <App />
  </LanguageProvider>,
  document.getElementById("root")
);
