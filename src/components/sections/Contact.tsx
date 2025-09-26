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
import { createContactRequest } from "@/lib/firestore";

// Функция форматирования номера телефона
const formatPhoneNumber = (input: string): string => {
  if (!input) return "";

  // Убираем все не-цифры из ввода
  const cleanDigits = input.replace(/\D/g, "");

  // Форматируем по маске 0(XX)XXXXXX
  if (cleanDigits.length === 0) {
    return "";
  } else if (cleanDigits.length === 1) {
    return cleanDigits;
  } else if (cleanDigits.length <= 3) {
    return `0(${cleanDigits.slice(1)}`;
  } else if (cleanDigits.length <= 9) {
    return `0(${cleanDigits.slice(1, 3)})${cleanDigits.slice(3)}`;
  } else {
    return `0(${cleanDigits.slice(1, 3)})${cleanDigits.slice(3, 9)}`;
  }
};

// Функция валидации email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Функция валидации телефона
const isValidPhone = (phone: string): boolean => {
  const cleanDigits = phone.replace(/\D/g, "");
  return cleanDigits.length === 9 && cleanDigits.startsWith("0");
};

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Специальная обработка для телефона
    if (name === "phone") {
      const formattedPhone = formatPhoneNumber(value);
      setFormData({
        ...formData,
        [name]: formattedPhone,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Предотвращаем повторную отправку
    if (isSubmitting) return;

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

    if (!isValidEmail(formData.email)) {
      toast({
        title: t("validation.error", "Ошибка"),
        description: t("validation.emailInvalid", "Введите корректный email"),
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

    if (!isValidPhone(formData.phone)) {
      toast({
        title: t("validation.error", "Ошибка"),
        description: t("validation.phoneInvalid", "Введите корректный номер телефона"),
        variant: "destructive",
      });
      return;
    }

    console.log("📧 Начинаем отправку сообщения...");
    setIsSubmitting(true);

    try {
      const result = await createContactRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        subject: formData.subject,
      });

      console.log("✅ Сообщение успешно отправлено:", result);

      // Минимальная задержка для лучшего UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Показываем уведомление об успехе
      toast({
        title: t("contact.successTitle", "Сообщение отправлено!"),
        description: t(
          "contact.successMessage",
          "Мы свяжемся с вами в ближайшее время."
        ),
        variant: "default",
      });

      setIsSubmitted(true);
      setIsSubmitting(false);

      // Очищаем форму
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (e) {
      console.error("❌ Ошибка отправки сообщения:", e);
      setIsSubmitting(false);
      const error = e instanceof Error ? e : new Error(String(e));
      toast({
        title: t("contact.errorTitle", "Ошибка отправки"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t("contact.phoneTitle"),
      details: [
        {
          label: t("contact.administrator"),
          phone: "+37379013014",
          isPhone: true,
        },
        {
          label: t("contact.technicalAssistant"),
          phone: "+37361131131 / +37362131370",
          isPhone: true,
        },
        {
          label: t("contact.managerConsultant"),
          phone: "+37360777137 / +37360496669",
          isPhone: true,
        },
      ],
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Phone - занимает всю высоту слева */}
                <div className="lg:row-span-3">
                  <Card className="group hover:glow-effect transition-all duration-500 bg-card/50 backdrop-blur border-border/50 h-full">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">
                            {contactInfo[0].title}
                          </h4>
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        {contactInfo[0].details.map((detail, idx) => (
                          <div key={idx} className="mb-1">
                            {typeof detail === "string" ? (
                              <p className="text-sm text-muted-foreground">
                                {detail}
                              </p>
                            ) : detail.isPhone ? (
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {detail.label}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {detail.phone
                                    .split(" / ")
                                    .map((phone, phoneIdx) => (
                                      <a
                                        key={phoneIdx}
                                        href={`tel:${phone.replace(/\s/g, "")}`}
                                        className="text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer"
                                      >
                                        {phone}
                                      </a>
                                    ))}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                {detail}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-4 italic">
                        {contactInfo[0].description}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Email, Hours, Address - справа в колонке */}
                <div className="space-y-6">
                  {contactInfo.slice(1).map((item, index) => (
                    <Card
                      key={index + 1}
                      className="group hover:glow-effect transition-all duration-500 bg-card/50 backdrop-blur border-border/50"
                      style={{ animationDelay: `${(index + 1) * 0.1}s` }}
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
                              <div key={idx} className="mb-1">
                                {typeof detail === "string" ? (
                                  <p className="text-sm text-muted-foreground">
                                    {detail}
                                  </p>
                                ) : detail.isPhone ? (
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {detail.label}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {detail.phone
                                        .split(" / ")
                                        .map((phone, phoneIdx) => (
                                          <a
                                            key={phoneIdx}
                                            href={`tel:${phone.replace(
                                              /\s/g,
                                              ""
                                            )}`}
                                            className="text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer"
                                          >
                                            {phone}
                                          </a>
                                        ))}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    {detail}
                                  </p>
                                )}
                              </div>
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
                  {isSubmitted
                    ? t("contact.messageSentTitle")
                    : t("contact.sendMessageTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  // Сообщение об успехе
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-500 mb-2">
                        {t("contact.messageSentTitle")}
                      </h3>
                      <p className="text-muted-foreground">
                        {t("contact.messageSentDesc")}
                      </p>
                    </div>
                    <Button
                      onClick={handleResetForm}
                      variant="outline"
                      className="mt-4"
                    >
                      {t(
                        "contact.sendAnotherMessage",
                        "Отправить еще одно сообщение"
                      )}
                    </Button>
                  </div>
                ) : (
                  // Форма
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">{t("contact.fullNameLabel")}</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
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
                          disabled={isSubmitting}
                          className={`mt-1 ${
                            formData.email && isValidEmail(formData.email)
                              ? "border-green-500 border-2"
                              : formData.email && !isValidEmail(formData.email)
                              ? "border-red-500 border-2"
                              : ""
                          }`}
                        />
                        {formData.email && !isValidEmail(formData.email) && (
                          <p className="text-red-500 text-sm mt-1">
                            {t("validation.emailInvalid", "Введите корректный email")}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">{t("contact.phoneLabel")}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="0(XX)XXXXXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className={`mt-1 ${
                            formData.phone && isValidPhone(formData.phone)
                              ? "border-green-500 border-2"
                              : formData.phone && !isValidPhone(formData.phone)
                              ? "border-red-500 border-2"
                              : ""
                          }`}
                        />
                        {formData.phone && !isValidPhone(formData.phone) && (
                          <p className="text-red-500 text-sm mt-1">
                            {t("validation.phoneInvalid", "Введите корректный номер телефона")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">
                        {t("contact.messageLabel")}
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        disabled={isSubmitting}
                        className="mt-1"
                        placeholder={t("contact.messagePlaceholder")}
                      />
                    </div>

                    <Button
                      type="submit"
                      className={`w-full glow-effect transition-all duration-300 ${
                        isSubmitting
                          ? "opacity-75 cursor-not-allowed"
                          : "hover:scale-105 active:scale-95"
                      }`}
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                          <span className="font-semibold">
                            {t("contact.sending", "Отправляем...")}
                          </span>
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          <span className="font-semibold">
                            {t("contact.sendMessageButton")}
                          </span>
                        </>
                      )}
                    </Button>
                  </form>
                )}
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2719.0337264862737!2d28.890631400000004!3d47.03956899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97d1dbb350b0b%3A0xd4b3f55f787edf09!2zVGVycmFSZW50Q2FyIC0g0JDQstGC0L4g0J_RgNC-0LrQsNGC!5e0!3m2!1sru!2s!4v1753961423739!5m2!1sru!2s"
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
