import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Оптимизированное разделение для мобильных
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select"],
          utils: ["clsx", "class-variance-authority", "lucide-react"],
          mobile: [
            "./src/components/sections/CarsMobile.tsx",
            "./src/components/car/CarCardMobile.tsx",
          ],
          i18n: ["react-i18next", "i18next"],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Еще больше уменьшаем лимит для мобильных
    minify: mode === "production" ? "terser" : false,
          terserOptions: {
        compress: {
          drop_console: mode === "production",
          drop_debugger: mode === "production",
          pure_funcs:
            mode === "production" ? ["console.log", "console.info", "console.warn"] : [],
          passes: mode === "production" ? 3 : 1, // Увеличиваем количество проходов
          dead_code: mode === "production", // Удаляем мертвый код
          unused: mode === "production", // Удаляем неиспользуемые переменные
        },
        mangle:
          mode === "production"
            ? {
                toplevel: true,
                safari10: true, // Оптимизация для Safari
              }
            : false,
      },
    target: "es2015",
    cssCodeSplit: false, // Отключаем разделение CSS
    sourcemap: false, // Отключаем sourcemap в продакшене
    assetsInlineLimit: 8192, // Увеличиваем лимит для инлайн ресурсов
    reportCompressedSize: false, // Отключаем отчет о размере для ускорения сборки
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
}));
