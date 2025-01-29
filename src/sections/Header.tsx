import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "./Header.scss";
import logo from "../assets/logo.png";
import appstore from "../assets/appstore.svg";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const toggleMenu = (): void => setMenuOpen(prev => !prev);
  const toggleModal = (): void => setModalOpen(prev => !prev);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  const closeOnOutsideClick = (e: MouseEvent): void => {
    if (
      !modalRef.current?.contains(e.target as Node) &&
      !buttonRef.current?.contains(e.target as Node)
    ) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  return (
    <div className="main-header">
      <section className="call-button-container">
        <button
          className={`cc-calto-action-ripple ${modalOpen ? 'active' : ''}`}
          onClick={toggleModal}
          ref={buttonRef}
        >
          <i className="fa fa-phone"></i>
        </button>

        <div className="app-store-button">
          <a
            href="https://apps.apple.com/md/app/terrarent/id1661556785"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={appstore} alt="App Store" />
          </a>
        </div>

        {modalOpen && (
          <div className="modal" ref={modalRef}>
            <div className="modal-content">
              <a
                href="https://www.instagram.com/terrarentcar/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.facebook.com/TerraRentCar/"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="tel:+37379013014"
                aria-label="Phone"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-phone-square-alt"></i>
              </a>
              <a
                href="viber://chat?number=%2B37379013014"
                aria-label="Viber"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-viber"></i>
              </a>
              <a
                href="https://wa.me/37379013014"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        )}
      </section>

      <header className={`header ${menuOpen ? "menu-open" : ""}`}>
        <div className="logo">
          <a href="#">
            <img src={logo} alt="Logo" />
          </a>
        </div>

        <div
          className={`burger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <div className="burger-line"></div>
          <div className="burger-line"></div>
          <div className="burger-line"></div>
        </div>

        <nav className={`nav ${menuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <a href="#about" onClick={toggleMenu}>
                {t('header.about')}
              </a>
            </li>
            <li>
              <a href="#gallery" onClick={toggleMenu}>
                {t('header.gallery')}
              </a>
            </li>
            <li>
              <a href="#contact" onClick={toggleMenu}>
                {t('header.contacts')}
              </a>
            </li>
          </ul>
          <div className="language-switcher">
            <span 
              onClick={() => handleLanguageChange('ro')} 
              className={currentLanguage === 'ro' ? 'active' : ''}
            >
              Ro
            </span>
            |
            <span 
              onClick={() => handleLanguageChange('ru')} 
              className={currentLanguage === 'ru' ? 'active' : ''}
            >
              Ru
            </span>
            |
            <span 
              onClick={() => handleLanguageChange('en')} 
              className={currentLanguage === 'en' ? 'active' : ''}
            >
              En
            </span>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;