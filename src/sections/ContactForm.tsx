import React from 'react';
import './ContactForm.scss';

const ContactForm: React.FC = () => {
  return (
    <section className="contact-form">
      <h2>Contact Us</h2>
      <form>
        <div className="form-group" id='contact'>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
        </div>
        <textarea placeholder="Your Message" rows={5} required></textarea>
        <button type="submit">Submit</button>
      </form>
    </section>
  );
};

export default ContactForm;