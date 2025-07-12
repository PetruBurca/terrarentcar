import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const queryClient = new QueryClient();

function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookieAccepted")) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/90 text-white px-4 py-3 flex flex-col md:flex-row items-center justify-between z-[2000] shadow-lg">
      <span className="mb-2 md:mb-0 text-sm">{t("cookie.message")}</span>
      <button
        onClick={acceptCookies}
        className="ml-0 md:ml-4 px-6 py-3 bg-primary text-white font-bold text-lg rounded-lg hover:bg-primary/80 hover:scale-105 shadow-lg transition-all duration-300"
      >
        {t("cookie.accept")}
      </button>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <CookieBanner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
