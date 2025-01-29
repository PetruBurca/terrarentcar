import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './FormContact.scss';

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
    // Здесь должна быть логика отправки данных
    try {
      // Пример запроса:
      // await fetch('your-api-endpoint', { method: 'POST', body: JSON.stringify(formData) });
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
            src="https://www.google.com/maps/d/u/0/embed?mid=1yCN4l8lW61kg-TyIkhGP1cnQXSzuFKs&ehbc=2E312F&noprof=1"
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