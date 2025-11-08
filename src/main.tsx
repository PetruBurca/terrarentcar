import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import i18n, { loadLocale, initialLanguage } from "./lib/i18n";

loadLocale(initialLanguage).then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
