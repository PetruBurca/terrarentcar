import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const LANGS = ["ru", "en", "ro"];

// Инициализация без ресурсов, всё грузим динамически
i18n.use(initReactI18next).init({
  lng: "ro",
  fallbackLng: "ro",
  interpolation: { escapeValue: false },
  resources: {},
});

export function loadLocale(lang: string) {
  return fetch(`/locales/${lang}/${lang}.json`)
    .then((res) => res.json())
    .then((data) => {
      i18n.addResourceBundle(lang, "translation", data, true, true);
      i18n.changeLanguage(lang);
    });
}

export default i18n;
