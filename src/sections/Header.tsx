import React, { useEffect, useState } from "react";
import "./Header.scss";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`header ${isScrolled ? "header--scrolled" : ""}`}>
      <div className="header__tabs">
        <a href="#section1" className="header__tab">
          Section 1
        </a>
        <a href="#section2" className="header__tab">
          Section 2
        </a>
        <a href="#section3" className="header__tab">
          Section 3
        </a>
        <a href="#section4" className="header__tab">
          Section 4
        </a>
      </div>
      <div className="header__slider"></div>
    </nav>
  );
};

export default Header;