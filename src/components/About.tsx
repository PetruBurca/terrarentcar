import { Shield, Clock, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const About = () => {
  const { t } = useTranslation();
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
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("about.title")}{" "}
            <span className="gradient-text">Terra Rent Car</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("about.slogan")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:glow-effect transition-all duration-100 animate-fade-in bg-card/50 backdrop-blur border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
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
                    {diff.years} лет {diff.days} дней
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {t("about.years")}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        500+
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("about.clients")}
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        50+
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
