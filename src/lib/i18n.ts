import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const LANGS = ["ru", "en", "ro"];

// Всегда используем "ro" по умолчанию
const savedLanguage = "ro";

// Инициализация без ресурсов, всё грузим динамически
i18n.use(initReactI18next).init({
  lng: savedLanguage,
  fallbackLng: "ro",
  interpolation: { escapeValue: false },
  resources: {},
  react: {
    useSuspense: false, // Отключаем Suspense для лучшего контроля
  },
});

const baseUrl = typeof window !== "undefined" ? import.meta.env.BASE_URL ?? "/" : "/";
const localeBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

function buildLocaleUrl(lang: string) {
  return `${localeBase}locales/${lang}/${lang}.json`;
}

export function loadLocale(lang: string) {
  return fetch(buildLocaleUrl(lang))
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load locale: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      i18n.addResourceBundle(lang, "translation", data, true, true);
      i18n.changeLanguage(lang);
      return data;
    })
    .catch((error) => {
      console.error(`Error loading locale ${lang}:`, error);
      // Загружаем fallback язык
      return fetch(buildLocaleUrl("ro"))
        .then((res) => res.json())
        .then((data) => {
          i18n.addResourceBundle("ro", "translation", data, true, true);
          i18n.changeLanguage("ro");
          return data;
        });
    });
}

// Автоматически загружаем язык при инициализации
if (typeof window !== "undefined") {
  // Загружаем язык сразу, не ждем DOMContentLoaded
  loadLocale(savedLanguage).catch(console.error);
}

export default i18n;
