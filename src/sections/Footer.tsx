import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">TERRA <br />RENT <br />CAR</div>
        <div className="footer-contacts">
          <span><a href="tel:+37379013014" target='_blank'>+373 79 013 014</a></span>
          <span><a href= "mailto:terrarentcar@yahoo.com">terrarentcar@yahoo.com</a></span>
        </div>
        <div className="footer-social">
          <a href="https://www.instagram.com/terrarentcar/" target='_blank' aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="viber://chat?number=%2B37379013014"  target='_blank' aria-label="Viber">
            <i className="fab fa-viber"></i>
          </a>
          <a href="https://wa.me/37379013014" target='_blank' aria-label="Watsapp">
            <i className="fab fa-whatsapp"></i>
          </a>
          <a href="https://www.facebook.com/TerraRentCar/"  target='_blank' aria-label="Facebook">
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

