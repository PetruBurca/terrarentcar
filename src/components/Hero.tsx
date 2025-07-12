import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroVideo from "@/assets/video.mp4";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-glow gradient-text">TERRA</span>
              <br />
              <span className="text-foreground">RENT CAR</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-light">
              {t("hero.slogan")}
            </p>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              {t("hero.desc1")}
              <br />
              {t("hero.desc2")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="glow-effect animate-glow-pulse"
                asChild
              >
                <a href="#cars">
                  {t("hero.chooseCar")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="bg-background/20 backdrop-blur border-primary/30"
                asChild
              >
                <a href="#contact">{t("hero.learnMore")}</a>
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <span>{t("hero.rating")}</span>
              </div>
              <div>{t("hero.clients")}</div>
              <div>{t("hero.support")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-16 bg-gradient-to-b from-primary to-transparent rounded-full" />
      </div>
    </section>
  );
};

export default Hero;
