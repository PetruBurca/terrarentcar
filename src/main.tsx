import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import i18n, { loadLocale, initialLanguage } from "./lib/i18n";

loadLocale(initialLanguage)
  .catch((error) => {
    console.error("Failed to load initial locale, rendering anyway:", error);
  })
  .finally(() => {
    createRoot(document.getElementById("root")!).render(<App />);
  });
