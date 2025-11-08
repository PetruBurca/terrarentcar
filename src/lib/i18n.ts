import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const SUPPORTED_LANGS = ["ru", "ro", "en"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const DEFAULT_LANGUAGE: SupportedLang = "en";

function normalizeLang(lang: string | undefined | null): SupportedLang {
  if (!lang) return DEFAULT_LANGUAGE;
  const shortCode = lang.toLowerCase().split("-")[0];
  if (shortCode === "ro") return "ro";
  if (shortCode === "ru") return "ru";
  return DEFAULT_LANGUAGE;
}

function detectInitialLanguage(): SupportedLang {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const preferred =
    (Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language]
    ).map(normalizeLang);

  for (const lang of preferred) {
    if (SUPPORTED_LANGS.includes(lang)) {
      return lang;
    }
  }

  return DEFAULT_LANGUAGE;
}

export const initialLanguage = detectInitialLanguage();

// Инициализация без ресурсов, всё грузим динамически
i18n.use(initReactI18next).init({
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  resources: {},
  react: {
    useSuspense: false, // Отключаем Suspense для лучшего контроля
  },
});

const resolvedBase =
  typeof window !== "undefined"
    ? new URL(import.meta.env.BASE_URL ?? "/", window.location.origin).pathname
    : "/";
const localeBase = resolvedBase.endsWith("/") ? resolvedBase : `${resolvedBase}/`;

function buildLocaleUrl(lang: SupportedLang) {
  return `${localeBase}locales/${lang}/${lang}.json`;
}

export function loadLocale(lang: string | SupportedLang) {
  const targetLang = normalizeLang(lang) as SupportedLang;
  return fetch(buildLocaleUrl(targetLang))
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load locale: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      i18n.addResourceBundle(targetLang, "translation", data, true, true);
      i18n.changeLanguage(targetLang);
      return data;
    })
    .catch(async (error) => {
      console.error(`Error loading locale ${targetLang}:`, error);
      // Загружаем fallback язык
      try {
        const res = await fetch(buildLocaleUrl(DEFAULT_LANGUAGE));
        if (!res.ok) {
          throw new Error(`Failed to load fallback locale: ${res.status}`);
        }
        const data = await res.json();
        i18n.addResourceBundle(DEFAULT_LANGUAGE, "translation", data, true, true);
        i18n.changeLanguage(DEFAULT_LANGUAGE);
        return data;
      } catch (fallbackError) {
        console.error("Fallback locale loading failed:", fallbackError);
        throw fallbackError;
      }
    });
}

// Автоматически загружаем язык при инициализации
if (typeof window !== "undefined") {
  // Загружаем язык сразу, не ждем DOMContentLoaded
  loadLocale(initialLanguage).catch(console.error);
}

export default i18n;
