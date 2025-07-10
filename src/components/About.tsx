import { Shield, Clock, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Безопасность",
      description: "Все автомобили застрахованы и проходят регулярное техническое обслуживание"
    },
    {
      icon: Clock,
      title: "24/7 Поддержка",
      description: "Круглосуточная поддержка клиентов и помощь на дороге"
    },
    {
      icon: Award,
      title: "Премиум качество",
      description: "Только новые и ухоженные автомобили премиум-класса"
    },
    {
      icon: Users,
      title: "Персональный подход",
      description: "Индивидуальные условия аренды для каждого клиента"
    }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            О <span className="gradient-text">Terra Rent Car</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Мы создали сервис премиальной аренды автомобилей, который объединяет в себе 
            высокое качество обслуживания, безопасность и комфорт для наших клиентов.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:glow-effect transition-all duration-500 animate-fade-in bg-card/50 backdrop-blur border-border/50"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <h3 className="text-3xl font-bold mb-6 text-foreground">
              Почему выбирают нас?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Большой автопарк</h4>
                  <p className="text-muted-foreground">От экономичных моделей до премиум автомобилей</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Прозрачные цены</h4>
                  <p className="text-muted-foreground">Никаких скрытых платежей и дополнительных комиссий</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Быстрое оформление</h4>
                  <p className="text-muted-foreground">Минимум документов, максимум скорости</p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-slide-in-right">
            <Card className="bg-card/30 backdrop-blur border-border/50 glow-effect">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">5+</div>
                  <p className="text-muted-foreground mb-6">лет на рынке</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-foreground">500+</div>
                      <p className="text-sm text-muted-foreground">клиентов</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">50+</div>
                      <p className="text-sm text-muted-foreground">автомобилей</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">24/7</div>
                      <p className="text-sm text-muted-foreground">поддержка</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">100%</div>
                      <p className="text-sm text-muted-foreground">качество</p>
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