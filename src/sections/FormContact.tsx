import React from 'react';
import { useTranslation } from 'react-i18next';
import './FormContact.scss';

const FormContact: React.FC = () => {
  const { t } = useTranslation();

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
          <form>
            <div className="form-contact__field">
              <label htmlFor="name">{t('formContact.nameLabel')}</label>
              <input 
                type="text" 
                id="name" 
                placeholder={t('formContact.namePlaceholder')} 
              />
            </div>
            <div className="form-contact__field">
              <label htmlFor="email">{t('formContact.emailLabel')}</label>
              <input 
                type="email" 
                id="email" 
                placeholder={t('formContact.emailPlaceholder')} 
              />
            </div>
            <div className="form-contact__field">
              <label htmlFor="message">{t('formContact.messageLabel')}</label>
              <textarea 
                id="message" 
                placeholder={t('formContact.messagePlaceholder')} 
              />
            </div>
            <button type="submit">{t('formContact.submitButton')}</button>
          </form>
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