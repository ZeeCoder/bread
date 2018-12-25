import React from "react";

export const LanguageContext = React.createContext({
  language: "en",
  changeLanguage: () => {},
  trans: key => key
});
