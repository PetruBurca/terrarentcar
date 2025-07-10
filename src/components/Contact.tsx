import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Сообщение отправлено!",
      description: "Мы получили ваше сообщение и свяжемся с вами в ближайшее время.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Телефон",
      details: ["+373 68 123 456", "+373 69 654 321"],
      description: "Звоните в любое время"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@terrarentcar.md", "booking@terrarentcar.md"],
      description: "Отвечаем в течение часа"
    },
    {
      icon: MapPin,
      title: "Адрес",
      details: ["ул. Штефан чел Маре 123", "Кишинев, Молдова"],
      description: "Наш офис в центре города"
    },
    {
      icon: Clock,
      title: "Режим работы",
      details: ["Пн-Пт: 08:00 - 20:00", "Сб-Вс: 09:00 - 18:00"],
      description: "Поддержка 24/7"
    }
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Связаться <span className="gradient-text">с нами</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Готовы помочь вам с арендой автомобиля. Свяжитесь с нами любым удобным способом
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="animate-slide-in-left">
              <h3 className="text-2xl font-bold mb-6">Как с нами связаться</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((item, index) => (
                  <Card 
                    key={index} 
                    className="group hover:glow-effect transition-all duration-500 bg-card/50 backdrop-blur border-border/50"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                          {item.details.map((detail, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">
                              {detail}
                            </p>
                          ))}
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-8 bg-card/30 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-4">Социальные сети</h4>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm" className="hover:glow-effect">
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="hover:glow-effect">
                      Instagram
                    </Button>
                    <Button variant="outline" size="sm" className="hover:glow-effect">
                      Telegram
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-in-right">
            <Card className="bg-card/50 backdrop-blur border-border/50 glow-effect">
              <CardHeader>
                <CardTitle className="text-2xl">Отправить сообщение</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Полное имя *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Тема сообщения *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Сообщение *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="mt-1"
                      placeholder="Расскажите нам о ваших потребностях в аренде автомобиля..."
                    />
                  </div>

                  <Button type="submit" className="w-full glow-effect" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Отправить сообщение
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-16 animate-fade-in">
          <Card className="overflow-hidden bg-card/30 backdrop-blur border-border/50">
            <CardContent className="p-0">
              <div className="h-64 bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-foreground mb-2">Наше расположение</h4>
                  <p className="text-muted-foreground">Кишинев, Молдова</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Интерактивная карта будет доступна в ближайшее время
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;