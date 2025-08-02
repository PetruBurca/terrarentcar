import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copy } from "fs-extra";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/" : "/",
  server: {
    host: "::",
    port: 8080,
    // Отключаем кеширование в dev режиме
    hmr: {
      overlay: true,
    },
    // Принудительно обновляем файлы
    watch: {
      usePolling: true,
    },
    // Добавляем заголовки для отключения кеширования
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  },
  // Отключаем кеширование в dev режиме
  define: {
    __DEV__: mode === "development",
  },
  plugins: [
    react(),
    {
      name: "copy-cname",
      writeBundle() {
        copy("CNAME", "dist/CNAME");
        copy("_redirects", "dist/_redirects");
        copy("404.html", "dist/404.html");
        copy(".nojekyll", "dist/.nojekyll");
        // Копируем redirect.html в корень dist
        copy("redirect.html", "dist/redirect.html");

        // Копируем файлы из dist в корень ТОЛЬКО для GitHub Pages деплоя
        // Это нужно только когда мы деплоим на GitHub Pages
        if (
          mode === "production" &&
          process.env.GITHUB_PAGES_DEPLOY === "true"
        ) {
          copy("dist/index.html", "index.html");
          copy("dist/assets", "assets");
          copy("dist/locales", "locales");
          copy("dist/robots.txt", "robots.txt");
          copy("dist/sw.js", "sw.js");
          copy("dist/privacy-policy.pdf", "privacy-policy.pdf");
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем vendor библиотеки
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select"],
          utils: [
            "clsx",
            "class-variance-authority",
            "lucide-react",
            "date-fns",
          ],
          i18n: ["i18next", "react-i18next"],
          query: ["@tanstack/react-query"],
        },
      },
    },
    // Увеличиваем лимит для больших чанков
    chunkSizeWarningLimit: 1000,
    // Оптимизация для продакшена
    minify: mode === "production" ? "terser" : false,
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
      },
    },
  },
  // Оптимизация для разработки
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "i18next",
      "react-i18next",
    ],
  },
}));
