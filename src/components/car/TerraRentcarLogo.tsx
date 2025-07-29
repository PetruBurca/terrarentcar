import React from "react";
import "./Logo.css";

interface TerraRentcarLogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

const TerraRentcarLogo: React.FC<TerraRentcarLogoProps> = ({
  className = "",
  size = "large",
}) => {
  const sizeClasses = {
    small: "text-2xl md:text-3xl",
    medium: "text-3xl md:text-5xl",
    large: "text-5xl md:text-7xl",
  };

  return (
    <h1
      className={`font-bold mb-1 leading-tight terra-rentcar-logo ${sizeClasses[size]} ${className}`}
    >
      <span className="terra">TERRA</span>
      <span className="rentcar">Rent Car</span>
    </h1>
  );
};

export default TerraRentcarLogo;
