import React from 'react';
import mercedesLogo from '../assets/logos/mercedes.svg';
import bmwLogo from '../assets/logos/bmw.svg';
import audiLogo from '../assets/logos/audi.svg';
import toyotaLogo from '../assets/logos/toyota.svg';
import fordLogo from '../assets/logos/ford.svg';
import volkswagenLogo from '../assets/logos/volkswagen.svg';
import lexusLogo from '../assets/logos/lexus.svg';
import './LogoMarquee.scss';

const logos = [
  mercedesLogo,
  bmwLogo,
  lexusLogo,
  audiLogo,
  toyotaLogo,
  fordLogo,
  volkswagenLogo,
];

const LogoMarquee: React.FC = () => {
  return (
    <div className="slider">
      <div className="slide-track">
        {logos.map((logo, index) => (
          <div className="slide" key={`original-${index}`}>
            <img src={logo} alt={`Logo ${index + 1}`} />
          </div>
        ))}
        {logos.map((logo, index) => (
          <div className="slide" key={`duplicate-${index}`}>
            <img src={logo} alt={`Logo Duplicate ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;