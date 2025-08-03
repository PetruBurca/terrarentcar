import React from "react";
// import mercedesLogo from "../../assets/logos/mercedes.svg";
// import bmwLogo from "../../assets/logos/bmw.svg";
// import audiLogo from "../../assets/logos/audi.svg";
// import toyotaLogo from "../../assets/logos/toyota.svg";
// import volkswagenLogo from "../../assets/logos/volkswagen.svg";
// import fordLogo from "../../assets/logos/ford.svg";
// import lexusLogo from "../../assets/logos/lexus.svg";
import "./LogoMarquee.scss";

const logos = [
  // mercedesLogo,
  // bmwLogo,
  // lexusLogo,
  // audiLogo,
  // toyotaLogo,
  // fordLogo,
  // volkswagenLogo,
];

const LogoMarquee: React.FC = () => {
  return (
    <div className="logo-marquee-container">
      <div className="logo-marquee">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt="logo"
            className="logo-marquee-item"
          />
        ))}
        {/* Дублируем логотипы для бесконечного эффекта */}
        {logos.map((logo, index) => (
          <img
            key={index + logos.length}
            src={logo}
            alt="logo"
            className="logo-marquee-item"
          />
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;
