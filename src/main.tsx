import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import i18n, { loadLocale } from "./lib/i18n";

loadLocale("ro").then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
