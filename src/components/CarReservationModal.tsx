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

interface Car {
  id: string;
  name: string;
  images: string[];
  price: number;
  category: string;
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
      const diffTime = Math.abs(returnDate.getTime() - pickup.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 1;
  };

  const totalPrice = calculateDays() * car.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="reservation-desc"
        className="max-w-4xl max-h-[90vh] overflow-y-auto z-[3000] !top-1/2 !left-1/2 !translate-x-[-50%] !translate-y-[-50%] sm:max-w-lg md:max-w-2xl"
        style={{ zIndex: 3000 }}
      >
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car Info */}
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
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
                    src={images.length > 0 ? images[0] : "/placeholder.jpg"}
                    alt={car.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                <p className="text-muted-foreground mb-4">{car.category}</p>

                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>{t("reservation.pricePerDay")}</span>
                    <span className="font-bold">${car.price}</span>
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="pickupDate"
                    className="flex items-center space-x-1"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{t("reservation.pickupDate")}</span>
                  </Label>
                  <Input
                    id="pickupDate"
                    name="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="returnDate"
                    className="flex items-center space-x-1"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{t("reservation.returnDate")}</span>
                  </Label>
                  <Input
                    id="returnDate"
                    name="returnDate"
                    type="date"
                    value={formData.returnDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="pickupLocation"
                  className="flex items-center space-x-1"
                >
                  <MapPin className="h-4 w-4" />
                  <span>{t("reservation.pickupLocation")}</span>
                </Label>
                <Input
                  id="pickupLocation"
                  name="pickupLocation"
                  placeholder={t("reservation.pickupLocationPlaceholder")}
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="message">{t("reservation.wishes")}</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder={t("reservation.wishesPlaceholder")}
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" className="flex-1 glow-effect">
                  {t("reservation.send")}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  {t("reservation.cancel")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarReservationModal;
