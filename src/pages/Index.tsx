import { Header, Footer, RentSearch, About, Cars, Contact } from "@/components";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadLocale, initialLanguage } from "@/lib/i18n";
import { useTranslation } from "react-i18next";

const VALID_LANGS = ["ru", "ro", "en"];
const VALID_CATEGORIES = [
  "sedan",
  "convertible",
  "wagon",
  "break",
  "crossover",
  "suv",
  "pickup",
  "hatchback",
];

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // Используем кэшированные даты поиска
  const [searchDates, setSearchDates] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  // Автоматическое перенаправление на язык при заходе на главную страницу
  useEffect(() => {
    // Проверяем, что роутер готов
    if (typeof window === "undefined") return;

    const pathParts = location.pathname.split("/").filter(Boolean);

    // Пропускаем маршруты /car/:carSlug
    if (pathParts.length > 0 && pathParts[0] === "car") {
      return;
    }

    // Если пользователь зашел на главную страницу без языка в URL
    if (pathParts.length === 0) {
      try {
        // Определяем язык устройства с проверкой
        let deviceLang: string = "en";

        if (initialLanguage && typeof initialLanguage === "string") {
          deviceLang = initialLanguage;
        } else if (typeof window !== "undefined" && navigator.language) {
          const browserLang = navigator.language.toLowerCase().split("-")[0];
          if (VALID_LANGS.includes(browserLang as "ru" | "ro" | "en")) {
            deviceLang = browserLang;
          }
        }

        // Перенаправляем на URL с языком только если язык определен и валиден
        if (deviceLang && VALID_LANGS.includes(deviceLang)) {
          // Используем setTimeout для гарантии, что роутер готов
          setTimeout(() => {
            navigate(`/${deviceLang}`, { replace: true });
          }, 0);
        }
      } catch (error) {
        console.error("Error during language redirect:", error);
      }
      return;
    }
  }, [location.pathname, navigate]);

  // Определяем язык и категорию из URL
  useEffect(() => {
    // Проверяем путь для определения языка и категории
    const pathParts = location.pathname.split("/").filter(Boolean);

    let detectedLang: string | null = null;
    let detectedCategory: string | null = null;

    // Если первый сегмент - валидный язык
    if (pathParts.length > 0 && VALID_LANGS.includes(pathParts[0])) {
      detectedLang = pathParts[0];
      // Если второй сегмент - валидная категория
      if (pathParts.length > 1 && VALID_CATEGORIES.includes(pathParts[1])) {
        // Если категория "break", используем "wagon" (так как в данных используется "wagon")
        detectedCategory = pathParts[1] === "break" ? "wagon" : pathParts[1];
      }
    } else if (
      pathParts.length > 0 &&
      VALID_CATEGORIES.includes(pathParts[0])
    ) {
      // Если первый сегмент - категория (без языка)
      // Если категория "break", используем "wagon" (так как в данных используется "wagon")
      detectedCategory = pathParts[0] === "break" ? "wagon" : pathParts[0];
    }

    // Устанавливаем язык, если он определен из URL
    if (detectedLang && detectedLang !== i18n.language) {
      loadLocale(detectedLang);
    }
  }, [location.pathname, i18n]);

  const handleSearchDates = (dates: { from: Date | null; to: Date | null }) => {
    setSearchDates(dates);
    // Скролл к блоку с машинами
    const carsBlock = document.getElementById("cars");
    if (carsBlock) {
      carsBlock.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Определяем категорию из URL для передачи в Cars
  const getInitialCategory = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    let category: string | null = null;

    if (pathParts.length > 0 && VALID_LANGS.includes(pathParts[0])) {
      if (pathParts.length > 1 && VALID_CATEGORIES.includes(pathParts[1])) {
        // Если категория "break", используем "wagon" (так как в данных используется "wagon")
        category = pathParts[1] === "break" ? "wagon" : pathParts[1];
      }
    } else if (
      pathParts.length > 0 &&
      VALID_CATEGORIES.includes(pathParts[0])
    ) {
      // Если категория "break", используем "wagon" (так как в данных используется "wagon")
      category = pathParts[0] === "break" ? "wagon" : pathParts[0];
    }

    return category;
  };

  const initialCategory = getInitialCategory();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <RentSearch onSearch={handleSearchDates} />
        <Cars searchDates={searchDates} initialCategory={initialCategory} />
        <About />

        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
