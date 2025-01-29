import i18next from "i18next"; 
import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";



i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "ro",
    fallbackLng: "ro",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{lng}}.json",
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"],
      lookupQuerystring: "lng",
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage", "cookie"],
      convertDetectedLanguage: (lng: string) => (lng === "ru" ? "ru" : "ro"),
    },
  });

export default i18next;
