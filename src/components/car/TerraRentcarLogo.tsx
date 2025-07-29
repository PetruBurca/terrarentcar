import React, { useEffect, useState } from "react";
import "./Logo.css";

interface TerraRentcarLogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

const TerraRentcarLogo: React.FC<TerraRentcarLogoProps> = ({
  className = "",
  size = "large",
}) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Проверяем загрузку шрифта
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setFontLoaded(true);
      });
    } else {
      // Fallback для старых браузеров
      setTimeout(() => setFontLoaded(true), 1000);
    }
  }, []);

  const sizeClasses = {
    small: "text-2xl md:text-3xl",
    medium: "text-3xl md:text-5xl",
    large: "text-5xl md:text-7xl",
  };

  return (
    <h1
      className={`font-bold mb-1 leading-tight terra-rentcar-logo ${
        sizeClasses[size]
      } ${className} ${fontLoaded ? "font-loaded" : "font-loading"}`}
    >
      <span className="terra">TERRA</span>
      <span className="rentcar">Rent Car</span>
    </h1>
  );
};

export default TerraRentcarLogo;
