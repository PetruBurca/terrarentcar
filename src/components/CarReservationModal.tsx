import { useState } from "react";
import { Calendar, MapPin, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { createOrder } from "@/lib/airtable";
import logo from "@/assets/logo.png";
import { useMediaQuery } from "@/hooks/use-mobile";

interface Car {
  id: string;
  name: string;
  images: string[];
  price: number;
  category: string;
  description?: string;
  pricePerDay: number;
  price2to10: number;
  price11to20: number;
  price21to29: number;
  price30plus: number;
}

interface CarReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
}

const CarReservationModal = ({
  isOpen,
  onClose,
  car,
}: CarReservationModalProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    message: "",
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const images = Array.isArray(car.images) ? car.images : [];
  const handlePrev = () =>
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  const handleNext = () =>
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  const [showDescription, setShowDescription] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Для стандартного календаря
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrder({
        name: formData.firstName + " " + formData.lastName,
        phone: formData.phone,
        email: formData.email,
        car: car.name,
        startDate: formData.pickupDate,
        endDate: formData.returnDate,
        comment: formData.message,
        // Можно добавить pickupLocation, если нужно
      });
      toast({
        title: t("reservation.sentTitle"),
        description: t("reservation.sentDesc", { car: car.name }),
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        pickupDate: "",
        returnDate: "",
        pickupLocation: "",
        message: "",
      });
      onClose();
    } catch (e) {
      toast({
        title: t("reservation.errorTitle", "Ошибка отправки заявки"),
        description: t(
          "reservation.errorDesc",
          "Проверьте соединение или попробуйте позже."
        ),
        variant: "destructive",
      });
    }
  };

  const calculateDays = () => {
    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);
      if (isNaN(pickup.getTime()) || isNaN(returnDate.getTime())) return 1;
      if (returnDate <= pickup) return 1;
      const diffTime = Math.abs(returnDate.getTime() - pickup.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 1;
  };

  const days = calculateDays();
  const getPricePerDay = (days: number) => {
    if (days >= 30) return car.price30plus;
    if (days >= 21) return car.price21to29;
    if (days >= 11) return car.price11to20;
    if (days >= 2) return car.price2to10;
    return car.pricePerDay;
  };
  const pricePerDay = getPricePerDay(days);
  const totalPrice = pricePerDay * days;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="reservation-desc"
        className={
          isMobile
            ? "fixed inset-0 w-full min-h-[100dvh] max-w-full h-[100dvh] top-0 left-0 z-[3000] bg-background overflow-y-auto rounded-none p-2 pt-10"
            : "max-w-4xl max-h-[90vh] overflow-y-auto z-[3000] !top-1/2 !left-1/2 !translate-x-[-50%] !translate-y-[-50%] sm:max-w-lg md:max-w-2xl p-6"
        }
        style={isMobile ? { zIndex: 3000 } : { zIndex: 3000 }}
      >
        {/* Крестик всегда сверху справа */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 text-3xl text-yellow-400 hover:text-yellow-200 transition md:top-4 md:right-4"
          aria-label="Закрыть"
        >
          <X />
        </button>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t("reservation.title")}
          </DialogTitle>
        </DialogHeader>
        <p id="reservation-desc" className="sr-only">
          {t(
            "reservation.dialogDescription",
            "Форма бронирования автомобиля. Заполните все поля и отправьте заявку."
          )}
        </p>

        <div
          className={
            isMobile
              ? "flex flex-col gap-4"
              : "grid grid-cols-1 lg:grid-cols-2 gap-8"
          }
        >
          {/* Car Info */}
          <div className={isMobile ? "w-full" : undefined}>
            <Card className={isMobile ? "mb-4" : "mb-6"}>
              <CardContent className={isMobile ? "p-2" : "p-6"}>
                {images.length > 1 ? (
                  <>
                    <div className="relative mb-4">
                      <img
                        src={images[activeIndex]}
                        alt={car.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {/* Стрелки */}
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 hover:bg-primary transition"
                        aria-label="Предыдущее фото"
                      >
                        &#8592;
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 hover:bg-primary transition"
                        aria-label="Следующее фото"
                      >
                        &#8594;
                      </button>
                    </div>
                    {/* Миниатюры */}
                    <div className="flex justify-center gap-2 mt-2">
                      {images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`thumb-${idx}`}
                          className={`w-14 h-14 object-cover rounded cursor-pointer border-2 ${
                            activeIndex === idx
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                          onClick={() => setActiveIndex(idx)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <img
                    src={images.length > 0 ? images[0] : logo}
                    alt={car.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.currentTarget.src = logo;
                    }}
                  />
                )}
                <h3 className="text-xl font-bold mb-2 text-center md:text-left">
                  {car.name}
                </h3>
                <p className="text-muted-foreground mb-4 text-center md:text-left">
                  {car.category}
                </p>

                <div className="bg-secondary/50 p-3 rounded-lg">
                  <div className="flex flex-col gap-1 mb-2">
                    <div className="flex justify-between items-center">
                      <span>
                        {t("reservation.pricePerDay", "Цена за день")}
                      </span>
                      <span className="font-bold">${car.pricePerDay}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        {t("reservation.price2to10", "Цена за 2-10 дней")}
                      </span>
                      <span className="font-bold">${car.price2to10}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        {t("reservation.price11to20", "Цена за 11-20 дней")}
                      </span>
                      <span className="font-bold">${car.price11to20}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        {t("reservation.price21to29", "Цена за 21-29 дней")}
                      </span>
                      <span className="font-bold">${car.price21to29}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        {t("reservation.price30plus", "Цена от 30 дней")}
                      </span>
                      <span className="font-bold">${car.price30plus}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>{t("reservation.days")}</span>
                    <span className="font-bold">{calculateDays()}</span>
                  </div>
                  <hr className="my-2 border-border" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{t("reservation.total")}</span>
                    <span className="text-primary">${totalPrice}</span>
                  </div>
                  {/* Dropdown-описание */}
                  <div className="my-2">
                    <button
                      className="flex items-center gap-2 text-yellow-400 font-semibold focus:outline-none"
                      onClick={() => setShowDescription((v) => !v)}
                      aria-expanded={showDescription}
                    >
                      {t("cars.description", "Описание")}
                      <span
                        className={`transform transition-transform ${
                          showDescription ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                    {showDescription && (
                      <div className="mt-2 text-sm text-white bg-black/10 rounded p-2">
                        {car.description ||
                          t("cars.noDescription", "Нет описания")}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className={isMobile ? "w-full" : undefined}>
            <form
              onSubmit={handleSubmit}
              className={isMobile ? "flex flex-col gap-3" : "space-y-4"}
            >
              <div
                className={
                  isMobile ? "flex flex-col gap-3" : "grid grid-cols-2 gap-4"
                }
              >
                <div>
                  <Label htmlFor="firstName">
                    {t("reservation.firstName")}
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t("reservation.lastName")}</Label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">
                  {t("reservation.email", "Email *")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">{t("reservation.phone")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <Label htmlFor="pickupDate">
                  {t("reservation.pickupDate", "Дата получения")}
                </Label>
                <Input
                  type="date"
                  id="pickupDate"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleDateInput}
                  required
                />
                <Label htmlFor="returnDate">
                  {t("reservation.returnDate", "Дата возврата")}
                </Label>
                <Input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleDateInput}
                  required
                />
              </div>

              <div>
                <Label htmlFor="pickupLocation">
                  {t("reservation.pickupLocation")}
                </Label>
                <Input
                  id="pickupLocation"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="message">{t("reservation.message")}</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <Button type="submit" className="w-full mt-4">
                {t("reservation.send")}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarReservationModal;
