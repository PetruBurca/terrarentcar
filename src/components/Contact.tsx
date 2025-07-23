import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/utils/button";
import { Input } from "@/components/ui/inputs/input";
import { Label } from "@/components/ui/utils/label";
import { Textarea } from "@/components/ui/inputs/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/card";
import { toast } from "@/components/ui/utils/use-toast";
import { useTranslation } from "react-i18next";
import { createContactRequest } from "@/lib/airtable";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация полей
    if (!formData.name.trim()) {
      toast({
        title: t("validation.error", "Ошибка"),
        description: t("validation.nameRequired", "Введите ваше имя"),
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: t("validation.error", "Ошибка"),
        description: t("validation.emailRequired", "Введите email"),
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.phone.trim()) {
      toast({
        title: t("validation.error", "Ошибка"),
        description: t("validation.phoneRequired", "Введите телефон"),
        variant: "destructive",
      });
      return;
    }

    try {
      await createContactRequest({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });
      
      toast({
        title: t("contact.messageSentTitle"),
        description: t("contact.messageSentDesc"),
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      toast({
        title: t("contact.errorTitle"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t("contact.phoneTitle"),
      details: ["+37379013014"],
      description: t("contact.phoneDesc"),
    },
    {
      icon: Mail,
      title: t("contact.emailTitle"),
      details: ["terrarentcar@yahoo.com"],
      description: t("contact.emailDesc"),
    },
    {
      icon: MapPin,
      title: t("contact.addressTitle"),
      details: [t("contact.addressDetails")],
      description: t("contact.addressDesc"),
    },
    {
      icon: Clock,
      title: t("contact.hoursTitle"),
      details: [t("contact.hoursDetails1"), t("contact.hoursDetails2")],
      description: t("contact.hoursDesc"),
    },
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("contact.title")}{" "}
            <span className="gradient-text">{t("contact.titleAccent")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="animate-slide-in-left">
              <h3 className="text-2xl font-bold mb-6">
                {t("contact.howToContact")}
              </h3>

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
                          <h4 className="font-semibold text-foreground mb-1">
                            {item.title}
                          </h4>
                          {item.details.map((detail, idx) => (
                            <p
                              key={idx}
                              className="text-sm text-muted-foreground"
                            >
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
                  <h4 className="font-semibold text-foreground mb-4">
                    {t("contact.socialTitle")}
                  </h4>
                  <div className="flex space-x-4">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover:glow-effect"
                    >
                      <a
                        href="https://www.facebook.com/TerraRentCar/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover:glow-effect"
                    >
                      <a
                        href="https://www.instagram.com/terrarentcar/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover:glow-effect"
                    >
                      <a
                        href="https://t.me/TerraRentCar"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Telegram
                      </a>
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
                <CardTitle className="text-2xl">
                  {t("contact.sendMessageTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">{t("contact.fullNameLabel")}</Label>
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
                      <Label htmlFor="email">{t("contact.emailLabel")}</Label>
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
                      <Label htmlFor="phone">{t("contact.phoneLabel")}</Label>
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
                    <Label htmlFor="message">{t("contact.messageLabel")}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="mt-1"
                      placeholder={t("contact.messagePlaceholder")}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full glow-effect"
                    size="lg"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {t("contact.sendMessageButton")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-16 text-center animate-fade-in">
          <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <MapPin className="inline-block mr-2" />
            {t("contact.locationTitle")}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t("contact.locationDesc")}
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d840.515912373403!2d28.891003583096374!3d47.03942002676709!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97d1dbb350b0b%3A0xd4b3f55f787edf09!2zVGVycmFSZW50Q2FyIC0g0JDQstGC0L4g0J_RgNC-0LrQsNGC!5e0!3m2!1sru!2sus!4v1752309334562!5m2!1sru!2sus"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;
