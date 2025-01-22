import React, { useState } from "react";
import "./Header.scss";
import logo from '../assets/logo.png'

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="main-heder">
       {/* Call Button */}
       <section className="call-button">
          <button className="cc-calto-action-ripple" >
            <i className="fa fa-phone"></i>
          </button>
        </section>
        <header className={`header ${menuOpen ? "menu-open" : ""}`}>
      
      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="" />
      </div>

      {/* Burger Menu */}
      <div className={`burger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
      </div>
      

      {/* Navigation */}
      <nav className={`nav ${menuOpen ? "active" : ""}`}>
        <ul>
          <li><a href="#about" onClick={toggleMenu}>About</a></li>
          <li><a href="#gallery" onClick={toggleMenu}>Gallery</a></li>
          <li><a href="#contact" onClick={toggleMenu}>Contact</a></li>
        </ul>
      </nav>

      
    </header>
    </div>
    
    
  );
};

export default Header;