import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import localforage from "localforage";
import { LanguageContext, LanguageContextValue } from "./language-context";
import translations from "./translations";

const getCurrentLanguage = async (): Promise<string> => {
  try {
    const language = await localforage.getItem<string>("language");

    if (language) {
      return language;
    }
  } catch (error) {
    console.error(`Failed to fetch language stored: ${error}.`);
  }

  return navigator.language.includes("en") ? "en" : "hu";
};

type Props = {
  children: ReactNode;
};

const LanguageProvider = ({ children }: Props) => {
  const [language, setLanguage] = useState("en");
  const trans = translations[language];

  const changeLanguage = useCallback((lang: string): void => {
    setLanguage(lang);
    localforage.setItem("language", lang).catch((error) => {
      console.error(`Failed to save language selection: ${error}.`);
    });
  }, []);

  const context = useMemo<LanguageContextValue>(
    () => ({
      trans,
      language,
      changeLanguage,
    }),
    [language, trans, changeLanguage]
  );

  useEffect(() => {
    let ignore = false;
    getCurrentLanguage().then((lang) => {
      if (!ignore) {
        setLanguage(lang);
      }
    });

    return () => {
      ignore = true;
    };
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
