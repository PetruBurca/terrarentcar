import { useState } from "react";
import { Car, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg glow-effect">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">TERRA RENT CAR</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors duration-300">
              Главная
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors duration-300">
              О нас
            </a>
            <a href="#cars" className="text-foreground hover:text-primary transition-colors duration-300">
              Автомобили
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors duration-300">
              Контакты
            </a>
          </nav>

          {/* Phone & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+373 68 123 456</span>
            </Button>
            
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            <a
              href="#home"
              className="block text-foreground hover:text-primary transition-colors duration-300"
              onClick={toggleMenu}
            >
              Главная
            </a>
            <a
              href="#about"
              className="block text-foreground hover:text-primary transition-colors duration-300"
              onClick={toggleMenu}
            >
              О нас
            </a>
            <a
              href="#cars"
              className="block text-foreground hover:text-primary transition-colors duration-300"
              onClick={toggleMenu}
            >
              Автомобили
            </a>
            <a
              href="#contact"
              className="block text-foreground hover:text-primary transition-colors duration-300"
              onClick={toggleMenu}
            >
              Контакты
            </a>
            <Button variant="outline" size="sm" className="flex items-center space-x-2 w-full justify-center">
              <Phone className="h-4 w-4" />
              <span>+373 68 123 456</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;