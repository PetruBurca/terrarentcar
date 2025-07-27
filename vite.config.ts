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
        },
      },
    },
    chunkSizeWarningLimit: 800, // Уменьшаем лимит для мобильных
    minify: mode === "production" ? "terser" : false,
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
        pure_funcs:
          mode === "production" ? ["console.log", "console.info"] : [],
        passes: mode === "production" ? 2 : 1,
      },
      mangle:
        mode === "production"
          ? {
              toplevel: true,
            }
          : false,
    },
    target: "es2015",
    cssCodeSplit: false, // Отключаем разделение CSS
    sourcemap: false, // Отключаем sourcemap в продакшене
    assetsInlineLimit: 4096, // Увеличиваем лимит для инлайн ресурсов
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
}));
