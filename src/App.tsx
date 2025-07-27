import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Устанавливаем язык из localStorage или по умолчанию
    const savedLang = localStorage.getItem("language") || "ro";
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;
