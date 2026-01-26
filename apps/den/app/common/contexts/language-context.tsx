import { createContext, useContext, useEffect, useState } from "react";
import type { Language } from "../translations/translations.ts";
import { translations } from "../translations/translations.ts";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ko"); // Default to Korean as per recent changes

  useEffect(() => {
    // Determine language from localStorage or browser settings if needed
    const savedLang = localStorage.getItem("den-language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "ko")) {
      setLanguage(savedLang);
    } else {
      // Since we modified root to 'ko', let's default to 'ko' but also respect browser if we want
      // For now, consistent default 'ko' seems appropriate given the user request
      setLanguage("ko");
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("den-language", lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    // Flattened dictionary lookup
    const translation =
      translations[language][key as keyof typeof translations.en] ||
      translations.en[key as keyof typeof translations.en] ||
      key;

    if (params) {
      let result = translation;
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(`{${paramKey}}`, String(paramValue));
      });
      return result;
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
