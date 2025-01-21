import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="logo">LOGO</div>
        <div className="navigation">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/services">Services</a>
        </div>
        <div className="contacts">
          <p>Email: info@example.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
        <div className="social-media">
          <a href="/">Facebook</a>
          <a href="/">Twitter</a>
          <a href="/">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;