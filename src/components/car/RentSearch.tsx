import { Star } from "lucide-react";
import { Button } from "@/components/ui/utils/button";
import heroVideo from "@/assets/video.webm";
import heroPoster from "@/assets/hero-road.webp";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@/hooks/use-mobile";
import { RentSearchCalendar } from "./RentSearchCalendar";

const RentSearch = ({ onSearch }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <section
      id="car-search"
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        {isMobile ? (
          <img
            src={heroPoster}
            alt="Hero"
            className="w-full h-full object-cover"
            loading="eager"
            width={1200}
            height={600}
            {...{ fetchpriority: "high" }}
          />
        ) : (
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            poster={heroPoster}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>
      {/* Контейнер для центрирования и ограничения ширины */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative z-10 w-full flex flex-col md:flex-row items-start justify-center px-4 md:px-12 py-1 gap-8 md:gap-8">
          {/* Текстовый блок */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left max-w-xl mx-auto md:mx-0 mt-24">
            <h1 className="text-5xl md:text-7xl font-bold mb-1 leading-tight text-yellow-400">
              TERRA
              <br />
              <span className="text-white">RENT CAR</span>
            </h1>
            <p className="text-xl md:text-2xl text-yellow-400 mb-4 md:mb-1 font-semibold">
              {t("hero.slogan")}
            </p>
            <p className="text-lg text-white mb-6 max-w-2xl hidden md:block">
              {t("hero.desc1")}
              <br />
              {t("hero.desc2")}
            </p>

            {/* На мобильных календарь будет здесь */}
            {isMobile && (
              <div className="mb-1 w-full md:max-w-md">
                <RentSearchCalendar onSearch={onSearch} />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full md:w-auto justify-center md:justify-start">
              <Button
                size="lg"
                className="glow-effect bg-yellow-400 text-black font-bold text-lg px-8 py-4 shadow-lg hover:bg-yellow-300 transition"
                asChild
              >
                <a href="#cars">{t("hero.chooseCar")}</a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-yellow-400 text-yellow-400 font-bold text-lg px-8 py-4 hover:bg-yellow-400 hover:text-black transition"
                asChild
              >
                <a href="#contact">{t("hero.learnMore")}</a>
              </Button>
            </div>
            <div className="flex items-center space-x-6 text-sm text-yellow-300 font-semibold mb-2">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span>{t("hero.rating")}</span>
              </div>
              <div>{t("hero.clients")}</div>
              <div>{t("hero.support")}</div>
            </div>
          </div>

          {/* На десктопе календарь будет с правой стороны */}
          {!isMobile && (
            <div className="flex-1 flex items-center justify-center md:justify-end mt-24">
              <div className="w-full md:max-w-md">
                <RentSearchCalendar onSearch={onSearch} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RentSearch;
