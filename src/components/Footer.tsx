import { Car, Phone, Mail, MapPin, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/20 backdrop-blur border-t border-border/50">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg glow-effect">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">TERRA RENT CAR</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Премиальная аренда автомобилей в Молдове. Больше чем просто аренда - 
              ваш надежный партнер в путешествиях.
            </p>
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <span className="text-primary text-sm font-bold">F</span>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <span className="text-primary text-sm font-bold">I</span>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <span className="text-primary text-sm font-bold">T</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Услуги</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Аренда автомобилей
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Долгосрочная аренда
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Трансфер из аэропорта
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Аренда с водителем
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Корпоративная аренда
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                  О компании
                </a>
              </li>
              <li>
                <a href="#cars" className="text-muted-foreground hover:text-primary transition-colors">
                  Наш автопарк
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Условия аренды
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-muted-foreground">+373 68 123 456</p>
                  <p className="text-muted-foreground">+373 69 654 321</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-muted-foreground">info@terrarentcar.md</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-muted-foreground">ул. Штефан чел Маре 123</p>
                  <p className="text-muted-foreground">Кишинев, Молдова</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-muted-foreground">Пн-Пт: 08:00 - 20:00</p>
                  <p className="text-muted-foreground">Поддержка 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2024 Terra Rent Car. Все права защищены.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Условия использования
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;