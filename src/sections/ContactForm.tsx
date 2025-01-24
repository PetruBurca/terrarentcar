import React from "react";
import "./ContactForm.scss";

const ContactForm: React.FC = () => {
  return (
    <div className="contact-container">
      <section className="contact-title">
        <h1>связаться с нами</h1>
      </section>
      <section className="contact-section">
       
        {/* iphone  */}
        <div className="iphone-container">
          <div className="contact-form">
            <h5>MORE THAN A CAR RENTAL</h5>
            <form action="#">
              <label className="contact-label">
                <i className="contact-icon fa fa-user"></i>
                <input
                  name="firstname"
                  className="contact-field"
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </label>
              <label className="contact-label">
                <i className="contact-icon fa fa-envelope"></i>
                <input
                  name="email"
                  className="contact-field"
                  type="email"
                  placeholder="Your Email"
                  required
                />
              </label>
              <label className="contact-label">
                <i className="contact-icon fa fa-phone"></i>
                <input
                  name="contact"
                  className="contact-field"
                  type="tel"
                  placeholder="Your Phone"
                  required
                />
              </label>
              <label className="contact-label">
                <i className="contact-icon fa fa-comment"></i>
                <textarea
                  className="contact-field contact-textarea"
                  name="textarea"
                  placeholder="Your Message"
                  rows={10}
                  required
                ></textarea>
              </label>
              <button
                className="contact-field contact-button"
                value="Send"
                type="submit"
              >
                Send <i className="fa fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
        {/* googlle map */}
        <div className="contact-map-container">
          <iframe
          className="custom-google-map"
            src="https://www.google.com/maps/d/u/0/embed?mid=1yCN4l8lW61kg-TyIkhGP1cnQXSzuFKs&ehbc=2E312F&noprof=1"
            width="100%"
            height="100%"
           
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default ContactForm;