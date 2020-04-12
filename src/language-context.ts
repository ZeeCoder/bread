import React from "react";

export type LanguageContextValue = {
  language: string;
  changeLanguage: (language: string) => void;
  trans: Record<string, string>;
};

export const LanguageContext = React.createContext({} as LanguageContextValue);
