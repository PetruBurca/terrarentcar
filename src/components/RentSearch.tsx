import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroVideo from "@/assets/video.mp4";
import heroPoster from "@/assets/hero-road.jpg";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@/hooks/use-mobile";
import { RentSearchCalendar } from "./RentSearchCalendar";

const RentSearch = () => {
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
      <div className="relative z-10 w-full flex flex-col items-start justify-center px-4 md:px-12 py-1 gap-8 md:gap-8">
        <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto items-center md:items-start justify-center gap-6 md:gap-12 mt-24">
          {/* Левая часть: текст, слоган, кнопки, звёзды */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-1 leading-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-white bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,255,0,0.15)]">
              TERRA
              <br />
              <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                RENT CAR
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-yellow-200 to-white bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,255,0,0.15)]">
              {t("hero.slogan")}
            </p>
            <p className="text-lg md:text-xl text-white mb-6 max-w-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
              {t("hero.desc1")}
              <br />
              {t("hero.desc2")}
            </p>
            {/* Календарь сразу после описания на мобильном, справа на десктопе */}
            <div className="block md:hidden w-full mb-4">
              <RentSearchCalendar onSearch={undefined} />
            </div>
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
          {/* Правая часть: календарь */}
          <div className="hidden md:block w-full md:w-[400px] flex-shrink-0 mt-4 md:mt-0">
            <RentSearchCalendar onSearch={undefined} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentSearch;
