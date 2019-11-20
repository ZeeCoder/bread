import React, { useState, useEffect, useMemo, useCallback } from "react";
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

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null);
  const trans = translations[language];

  const changeLanguage = useCallback(lang => {
    setLanguage(lang);
    localforage.setItem("language", lang).catch(error => {
      console.error(`Failed to save language selection: ${error}.`);
    });
  }, []);

  const context = useMemo(
    () => ({
      trans,
      language,
      changeLanguage
    }),
    [language, trans, changeLanguage]
  );

  useEffect(() => {
    let ignore = false;
    getCurrentLanguage().then(lang => {
      if (!ignore) {
        setLanguage(lang);
      }
    });

    return () => (ignore = true);
  }, []);

  if (!language) {
    return null;
  }

  return (
    <LanguageContext.Provider value={context}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
