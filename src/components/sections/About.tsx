import { Shield, Clock, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/layout/card";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

// Custom CSS for enhanced animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
  }
  
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
  }
  
  .feature-card {
    position: relative;
    overflow: hidden;
  }
  
  .feature-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.5s;
    z-index: 0;
  }
  
  .feature-card:hover::before {
    opacity: 1;
    animation: spin 3s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .feature-icon {
    animation: float 3s ease-in-out infinite;
  }
  
  .feature-card:hover .feature-icon {
    animation: float 1s ease-in-out infinite;
  }
  
  .sparkle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #3b82f6;
    border-radius: 50%;
    animation: sparkle 2s ease-in-out infinite;
  }
  
  .sparkle:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
  .sparkle:nth-child(2) { top: 30%; right: 20%; animation-delay: 0.5s; }
  .sparkle:nth-child(3) { bottom: 30%; left: 30%; animation-delay: 1s; }
  .sparkle:nth-child(4) { bottom: 20%; right: 30%; animation-delay: 1.5s; }
`;

// Функция для склонения слова "год" на русском языке
function getYearWord(years: number, language: string) {
  if (language === "ru") {
    if (years % 10 === 1 && years % 100 !== 11) return "год";
    if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100))
      return "года";
    return "лет";
  }
  // Для других языков возвращаем пустую строку, так как склонение обрабатывается в локализации
  return "";
}

// Функция для склонения слова "день" на русском языке
function getDayWord(days: number, language: string) {
  if (language === "ru") {
    if (days % 10 === 1 && days % 100 !== 11) return "день";
    if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100))
      return "дня";
    return "дней";
  }
  // Для других языков возвращаем пустую строку, так как склонение обрабатывается в локализации
  return "";
}

const About = () => {
  const { t, i18n } = useTranslation();
  const features = [
    {
      icon: Shield,
      title: t("about.safetyTitle"),
      description: t("about.safetyDesc"),
    },
    {
      icon: Clock,
      title: t("about.supportTitle"),
      description: t("about.supportDesc"),
    },
    {
      icon: Award,
      title: t("about.qualityTitle"),
      description: t("about.qualityDesc"),
    },
    {
      icon: Users,
      title: t("about.personalTitle"),
      description: t("about.personalDesc"),
    },
  ];

  const foundationDate = new Date(2021, 0, 1); // 1 января 2021
  const [diff, setDiff] = useState({ years: 0, days: 0 });

  useEffect(() => {
    const updateDiff = () => {
      const now = new Date();
      let years = now.getFullYear() - foundationDate.getFullYear();
      let startOfThisYear = new Date(now.getFullYear(), 0, 1);
      let days = Math.floor(
        (now.getTime() - startOfThisYear.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (
        now <
        new Date(
          now.getFullYear(),
          foundationDate.getMonth(),
          foundationDate.getDate()
        )
      ) {
        years--;
        startOfThisYear = new Date(now.getFullYear() - 1, 0, 1);
        days = Math.floor(
          (now.getTime() - startOfThisYear.getTime()) / (1000 * 60 * 60 * 24)
        );
      }
      setDiff({ years, days });
    };
    updateDiff();
    const interval = setInterval(updateDiff, 60 * 1000); // обновлять каждую минуту
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-20 relative">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* SEO Content Block - Hidden for users, visible for search engines */}
      <div className="container mx-auto px-4 lg:px-8 mb-16 sr-only">
        <div className="bg-zinc-800/50 rounded-2xl p-8 border border-[#B90003]/30">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Аренда автомобилей в Кишиневе и Молдове
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-300 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-[#B90003] mb-4">
                Прокат автомобилей в Кишиневе
              </h3>
              <p className="mb-4">
                Terra Rent Car предлагает{" "}
                <strong>аренду авто в Кишиневе</strong> на выгодных условиях. У
                нас вы найдете широкий выбор автомобилей для{" "}
                <strong>проката в Молдове</strong> - от экономичных до
                премиальных моделей. <strong>Аренда машин в Кишиневе</strong>{" "}
                доступна 24/7 с доставкой в аэропорт и по городу.
              </p>
              <p className="mb-4">
                Наш <strong>автопрокат в Кишиневе</strong> предоставляет
                качественные автомобили с полным техническим обслуживанием.{" "}
                <strong>Аренда автомобилей в Молдове</strong>
                включает страховку и круглосуточную поддержку клиентов.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#B90003] mb-4">
                Услуги аренды авто
              </h3>
              <ul className="space-y-2">
                <li>
                  • <strong>Аренда авто аэропорт Кишинев</strong> - встречаем в
                  аэропорту
                </li>
                <li>
                  • <strong>Прокат автомобилей Кишинев</strong> - краткосрочная
                  и долгосрочная аренда
                </li>
                <li>
                  • <strong>Аренда машин Молдова</strong> - по всей стране
                </li>
                <li>
                  • <strong>Прокат авто без залога</strong> - удобные условия
                </li>
                <li>
                  • <strong>Аренда автомобилей эконом класса</strong> - от
                  20€/день
                </li>
                <li>
                  • <strong>Премиум аренда авто</strong> - люксовые автомобили
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("about.title")}{" "}
            <span className="gradient-text">TerraRentCar</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("about.slogan")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="feature-card group hover:scale-105 hover:rotate-1 transition-all duration-500 animate-fade-in bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6 text-center relative overflow-hidden">
                {/* Sparkle effects */}
                <div className="sparkle" />
                <div className="sparkle" />
                <div className="sparkle" />
                <div className="sparkle" />

                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating icon with enhanced animation */}
                <div className="relative bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 feature-icon">
                  <feature.icon className="h-8 w-8 text-white group-hover:text-white/80 transition-colors duration-300" />
                  {/* Enhanced pulse ring effect */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping opacity-0 group-hover:opacity-100" />
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse opacity-0 group-hover:opacity-100" />
                </div>

                <h3 className="text-lg font-semibold mb-2 text-foreground relative group-hover:text-primary transition-colors duration-300 z-10">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed relative group-hover:text-foreground/80 transition-colors duration-300 z-10">
                  {feature.description}
                </p>

                {/* Enhanced corner accents */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-12 group-hover:h-12 group-hover:border-primary/40" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-12 group-hover:h-12 group-hover:border-primary/40" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <h3 className="text-3xl font-bold mb-6 text-foreground">
              {t("about.whyUs")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {t("about.fleetTitle")}
                  </h4>
                  <p className="text-muted-foreground">
                    {t("about.fleetDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {t("about.pricesTitle")}
                  </h4>
                  <p className="text-muted-foreground">
                    {t("about.pricesDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {t("about.fastTitle")}
                  </h4>
                  <p className="text-muted-foreground">{t("about.fastDesc")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-slide-in-right">
            <Card className="bg-card/30 backdrop-blur border-border/50 glow-effect">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {t("about.yearsCount", {
                      count: diff.years,
                      yearsWord: getYearWord(diff.years, i18n.language),
                    })}{" "}
                    {t("about.daysCount", {
                      count: diff.days,
                      daysWord: getDayWord(diff.days, i18n.language),
                    })}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {t("about.years")}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        15000+
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("about.clients")}
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        70+
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("about.cars")}
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        24/7
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("about.support")}
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        100%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("about.quality")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
