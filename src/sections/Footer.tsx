import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">TERRA RENT CAR</div>
        <div className="footer-contacts">
          <span>+373 79 013 014</span>
          <span>terrarentcar@yahoo.com</span>
        </div>
        <div className="footer-social">
          <a href="https://www.instagram.com/terrarentcar/" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="viber://chat?number=%2B37379013014" aria-label="Viber">
            <i className="fab fa-viber"></i>
          </a>
          <a href="https://wa.me/37379013014"  aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.facebook.com/TerraRentCar/" aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
        © 2021 - {new Date().getFullYear()} TERRA RENT CAR
        </p>

      </div>
    </footer>
  );
};

export default Footer;