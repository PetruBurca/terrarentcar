import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './FormContact.scss';
import emailjs from 'emailjs-com';

const FormContact: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceID = 'service_m5oxp4p'; // Ваш service ID
    const templateID = 'template_vk9tspb'; // Ваш template ID
    const userID = 'WnuZfg7d7PGVIp_dO'; // Ваш user ID из EmailJS
    try {
      // Отправка данных с использованием emailjs
      const result = await emailjs.send(
        serviceID,
        templateID,
        formData,
        userID
      );
      console.log('Message sent: ', result.text);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Ошибка отправки:', error);
    }
  };

  return (
    <div className="form-contact" id='contact'>
      <div className="form-contact__container">
        {/* Левая часть */}
        <div className="form-contact__container__left">
          <h2>{t('formContact.title')}</h2>
          <div className="form-contact__profile">
            <div className="profile-image" />
            <div className="profile-text">
              <p className="highlight">Terra Rent Car</p>
              <p>
                {t('formContact.helpText')}{' '}
                <a href="mailto:terrarentcar@yahoo.com">
                  terrarentcar@yahoo.com
                </a>
              </p>
            </div>
          </div>

          {isSubmitted ? (
            <div className="thank-you-message">
              <h3>{t('formContact.thankYouTitle')}</h3>
              <p>{t('formContact.thankYouText')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-contact__field">
                <label htmlFor="name">{t('formContact.nameLabel')}</label>
                <input
                  type="text"
                  id="name"
                  placeholder={t('formContact.namePlaceholder')}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-contact__field">
                <label htmlFor="email">{t('formContact.emailLabel')}</label>
                <input
                  type="email"
                  id="email"
                  placeholder={t('formContact.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-contact__field">
                <label htmlFor="message">{t('formContact.messageLabel')}</label>
                <textarea
                  id="message"
                  placeholder={t('formContact.messagePlaceholder')}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">{t('formContact.submitButton')}</button>
            </form>
          )}
        </div>

        {/* Правая часть */}
        <div className="form-contact__container__right">
          <iframe
            className="map"
           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21750.90385838675!2d28.899720600000002!3d47.042919399999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97d1dbb350b0b%3A0xd4b3f55f787edf09!2sChirie%20auto%20-%20TerraRentCar!5e0!3m2!1sru!2s!4v1738263016307!5m2!1sru!2s"
            allowFullScreen
            loading="lazy"
            title="Google Maps"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default FormContact;