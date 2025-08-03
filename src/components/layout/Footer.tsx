import React from "react";
import { FaInstagram, FaViber, FaWhatsapp, FaFacebook } from "react-icons/fa";
import logo from "@/assets/logo.webp";
import "./Footer.scss";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img
            src={logo}
            alt="Terra Rent Car Logo"
            className="footer-logo-img"
          />
          <div className="footer-logo-text">
            TERRA <br />
            RENT <br />
            CAR
          </div>
        </div>
        <div className="footer-contacts">
          <span>
            <a
              href="tel:+37379013014"
              target="_blank"
              rel="noopener noreferrer"
            >
              +373 79 013 014
            </a>
          </span>
          <span>
            <a href="mailto:terrarentcar@yahoo.com">terrarentcar@yahoo.com</a>
          </span>
        </div>
        <div className="footer-social">
          <a
            href="https://www.instagram.com/terrarentcar/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="viber://chat?number=%2B37379013014"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Viber"
          >
            <FaViber />
          </a>
          <a
            href="https://wa.me/37379013014"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Whatsapp"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://www.facebook.com/TerraRentCar/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2021 - {new Date().getFullYear()} TERRA RENT CAR</p>
      </div>
    </footer>
  );
};

export default Footer;
