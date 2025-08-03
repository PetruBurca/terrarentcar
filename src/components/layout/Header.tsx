import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Car, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/utils/button";
import logo from "@/assets/logo.webp";
import appstore from "../../assets/appstore.svg";
import { FaInstagram, FaFacebook, FaViber, FaWhatsapp } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { FaPhoneSquareAlt } from "react-icons/fa";
const CallContactsModal = lazy(() => import("../modals/CallContactsModal"));
import { useTranslation } from "react-i18next";
import { loadLocale } from "@/lib/i18n";

// Расширяем window для easter egg
declare global {
  interface Window {
    terraRentCarEasterEgg?: () => void;
  }
}

const LANGS = [
  { code: "ro", label: "Ro" },
  { code: "ru", label: "Ru" },
  { code: "en", label: "En" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || "ro");
  const [iconSpin, setIconSpin] = useState<"spin-in" | "spin-out" | "">("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleModal = () => {
    if (isClosing) return;
    if (!modalOpen) {
      setIsModalVisible(true);
      setIconSpin("spin-in");
      setModalOpen(true);
    } else {
      setIsClosing(true);
      setIconSpin("spin-out");
      setTimeout(() => {
        setModalOpen(false);
        setIsModalVisible(false);
        setIsClosing(false);
      }, 300);
    }
  };

  // Для анимации крестика при закрытии вне модалки
  const handleCloseWithAnimation = () => {
    if (isClosing) return;
    setIsClosing(true);
    setIconSpin("spin-out");
    setTimeout(() => {
      setModalOpen(false);
      setIsModalVisible(false);
      setIsClosing(false);
    }, 300); // 300мс = длительность анимации
  };

  const handleLangChange = (lang: string) => {
    setCurrentLang(lang);
    loadLocale(lang);
  };

  // Синхронизируем язык при загрузке компонента
  useEffect(() => {
    const savedLang = "ro";

    // Убеждаемся, что язык загружен в i18n
    if (i18n.language !== savedLang) {
      loadLocale(savedLang);
    }

    setCurrentLang(savedLang);
  }, []);

  // Слушаем изменения языка в i18n
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  // Закрытие модалки по клику вне
  useEffect(() => {
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (
        !modalRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setModalOpen(false);
      }
    };
    if (modalOpen) document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [modalOpen]);

  // Закрытие мобильного меню по клику вне и по Escape
  useEffect(() => {
    const closeMenuOnOutsideClick = (e: MouseEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !menuButtonRef.current?.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    const closeMenuOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", closeMenuOnOutsideClick);
      document.addEventListener("keydown", closeMenuOnEscape);
    }

    return () => {
      document.removeEventListener("mousedown", closeMenuOnOutsideClick);
      document.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Кнопка звонка */}
      <div className="fixed right-6 bottom-10 flex flex-col items-center z-[1000]">
        <button
          ref={buttonRef}
          className={`animate-call-ripple bg-black w-16 h-16 p-4 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/20 ${
            modalOpen ? "ring-4 ring-primary/40" : ""
          }`}
          onClick={toggleModal}
          aria-label="Контакты"
        >
          {modalOpen ? (
            <X
              className={`w-8 h-8 ${
                iconSpin === "spin-in"
                  ? "animate-spin-in"
                  : iconSpin === "spin-out"
                  ? "animate-spin-out"
                  : ""
              }`}
              onAnimationEnd={() => setIconSpin("")}
            />
          ) : (
            <Phone
              className={`w-8 h-8 ${
                iconSpin === "spin-in"
                  ? "animate-spin-in"
                  : iconSpin === "spin-out"
                  ? "animate-spin-out"
                  : ""
              }`}
              onAnimationEnd={() => setIconSpin("")}
            />
          )}
        </button>
        {isModalVisible && (
          <Suspense fallback={null}>
            <CallContactsModal
              open={modalOpen}
              onClose={() => {
                setIconSpin("spin-out");
                setTimeout(() => {
                  setModalOpen(false);
                  setIsModalVisible(false);
                }, 300);
              }}
              onCloseWithAnimation={handleCloseWithAnimation}
              buttonRef={buttonRef}
            />
          </Suspense>
        )}
      </div>

      {/* Кнопка App Store по центру внизу */}
      <div className="fixed left-1/2 bottom-5 -translate-x-1/2 z-[1000] app-store-button bg-transparent flex justify-center">
        <a
          href="https://apps.apple.com/md/app/terrarent/id1661556785"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="App Store"
        >
          <img
            src={appstore}
            alt="App Store"
            className="w-[150px] object-contain"
          />
        </a>
      </div>

      <header className="fixed top-2 left-1/2 -translate-x-1/2 z-50 max-w-3xl w-[95vw] rounded-3xl bg-black/30 backdrop-blur-lg shadow-lg border border-white/20 px-4 py-2">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center space-x-3">
            <a
              href="#"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                console.log(
                  `
🎉 %cО ты нашел! 🎉
%c
🚗 Тогда удачи в выборе машины! 🚗
🏎️ Надеемся, что ты найдешь свою идеальную! 🏎️
💫 Удачи в путешествиях! 💫

%c🎯 Продолжай исследовать сайт!
%c
                `,
                  "color: #ff6b35; font-size: 18px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);",
                  "color: #ffffff; font-size: 14px;",
                  "color: #00ff00; font-size: 16px; font-weight: bold;",
                  "color: #ffff00; font-size: 14px; font-family: monospace;"
                );
              }}
              title="🎮 Попробуй кликнуть!"
            >
              <img
                src={logo}
                alt="Logo"
                className="w-24 h-auto object-contain hover:scale-105 transition-transform duration-200"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#car-search"
              className="font-oswald text-white/90 hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-white/60 hover:after:w-full after:transition-all after:duration-300 text-lg font-medium"
            >
              {t("header.chooseCar", "Выбор машины")}
            </a>
            <a
              href="#about"
              className="font-oswald text-white/90 hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-white/60 hover:after:w-full after:transition-all after:duration-300 text-lg font-medium"
            >
              {t("header.about")}
            </a>
            <a
              href="#cars"
              className="font-oswald text-white/90 hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-white/60 hover:after:w-full after:transition-all after:duration-300 text-lg font-medium"
            >
              {t("header.cars")}
            </a>
            <a
              href="#contact"
              className="font-oswald text-white/90 hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-white/60 hover:after:w-full after:transition-all after:duration-300 text-lg font-medium"
            >
              {t("header.contact")}
            </a>
          </nav>

          {/* Переключатель языков */}
          <div className="hidden md:flex items-center space-x-2 text-white/80 text-base font-semibold select-none">
            <FaGlobe className="w-5 h-5 mr-1 opacity-1" />
            {LANGS.map((lang, idx) => (
              <span
                key={lang.code}
                onClick={() => handleLangChange(lang.code)}
                className={`cursor-pointer px-1 ${
                  currentLang === lang.code
                    ? "text-white underline"
                    : "hover:text-white/90"
                }`}
              >
                {lang.label}
              </span>
            ))}
          </div>

          {/* Бургер-меню */}
          <button
            ref={menuButtonRef}
            onClick={toggleMenu}
            className="md:hidden p-2 text-white hover:text-primary transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`
            md:hidden
            origin-top
            transition-all duration-300 ease-in-out overflow-hidden
            ${
              isMenuOpen
                ? "w-11/12 mx-auto max-h-[300px] opacity-100 scale-y-100"
                : "w-0 max-h-0 opacity-0 scale-y-95"
            }
            py-1 space-y-2 text-center
          `}
        >
          <a
            href="#car-search"
            className={`block font-oswald text-white/90 hover:text-white transition-all duration-300 transform text-lg font-medium
              ${
                isMenuOpen
                  ? "opacity-100 translate-y-0 delay-50"
                  : "opacity-0 -translate-y-2 delay-0"
              }`}
            style={{ transitionProperty: "opacity, transform" }}
            onClick={() => {
              toggleMenu();
              // Плавный скролл к элементу
              setTimeout(() => {
                const element = document.getElementById("car-search");
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }, 300);
            }}
          >
            {t("header.chooseCar", "Выбор машины")}
          </a>
          <a
            href="#about"
            className={`block font-oswald text-white/90 hover:text-white transition-all duration-300 transform text-lg font-medium
              ${
                isMenuOpen
                  ? "opacity-100 translate-y-0 delay-100"
                  : "opacity-0 -translate-y-2 delay-0"
              }`}
            style={{ transitionProperty: "opacity, transform" }}
            onClick={() => {
              toggleMenu();
              // Плавный скролл к элементу
              setTimeout(() => {
                const element = document.getElementById("about");
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }, 300);
            }}
          >
            {t("header.about")}
          </a>
          <a
            href="#cars"
            className={`block font-oswald text-white/90 hover:text-white transition-all duration-300 transform text-lg font-medium
              ${
                isMenuOpen
                  ? "opacity-100 translate-y-0 delay-200"
                  : "opacity-0 -translate-y-2 delay-0"
              }`}
            style={{ transitionProperty: "opacity, transform" }}
            onClick={() => {
              toggleMenu();
              // Плавный скролл к элементу
              setTimeout(() => {
                const element = document.getElementById("cars");
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }, 300);
            }}
          >
            {t("header.cars")}
          </a>
          <a
            href="#contact"
            className={`block font-oswald text-white/90 hover:text-white transition-all duration-300 transform text-lg font-medium
              ${
                isMenuOpen
                  ? "opacity-100 translate-y-0 delay-300"
                  : "opacity-0 -translate-y-2 delay-0"
              }`}
            style={{ transitionProperty: "opacity, transform" }}
            onClick={() => {
              toggleMenu();
              // Плавный скролл к элементу
              setTimeout(() => {
                const element = document.getElementById("contact");
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }, 300);
            }}
          >
            {t("header.contact")}
          </a>
          <div className="flex justify-center items-center space-x-2 text-white/80 text-base font-semibold mt-2">
            <FaGlobe className="w-5 h-5 mr-1 opacity-80" />
            {LANGS.map((lang, idx) => (
              <span
                key={lang.code}
                onClick={() => handleLangChange(lang.code)}
                className={`cursor-pointer px-1 ${
                  currentLang === lang.code
                    ? "text-white underline"
                    : "hover:text-white/90"
                }`}
              >
                {lang.label}
              </span>
            ))}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
