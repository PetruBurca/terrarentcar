import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import i18n, { loadLocale } from "./lib/i18n";

loadLocale("ro").then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});

// Register Service Worker с улучшенной логикой
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      // Принудительное обновление при новой версии
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Показываем уведомление об обновлении
              if (confirm("Доступна новая версия сайта. Обновить сейчас?")) {
                newWorker.postMessage({ type: "SKIP_WAITING" });
                window.location.reload();
              }
            }
          });
        }
      });

      // Обработка обновлений
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    } catch (error) {
      console.error("SW registration failed:", error);
    }
  });
}
