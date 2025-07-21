import { useState, useEffect } from "react";
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
import { useRef } from "react";

interface Car {
  id: string;
  name: string;
  images: string[];
  price: number;
  rating: number;
  passengers: number;
  transmission: string;
  year: string;
  engine: string;
  drive: string;
  fuel: string;
  description_ru?: string;
  description_ro?: string;
  description_en?: string;
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

// Wizard steps
const STEPS = ["main", "summary", "personal"];

type WizardData = {
  // Все поля для бронирования, по мере добавления шагов
  pickupDate?: string;
  returnDate?: string;
  pickupTime?: string;
  returnTime?: string;
  unlimitedMileage?: boolean;
  pickupType?: "office" | "airport" | "address";
  pickupAddress?: string;
  goldCard?: boolean;
  clubCard?: boolean;
  // ... и т.д.
};

const CarReservationModal = ({
  isOpen,
  onClose,
  car,
}: CarReservationModalProps) => {
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 767px)");
  console.log("car", car);
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({});
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
  // Индикатор шагов
  const stepIndicator = `${currentStep + 1}/${STEPS.length}`;
  // Везде далее используем только t и i18n из одного вызова useTranslation()
  // Пример использования мультиязычных ключей для новых этапов:
  // t('reservation.step1Title', 'Основная информация')
  // t('reservation.step2Title', 'Подтверждение')
  // t('reservation.step3Title', 'Данные клиента')
  // t('reservation.next', 'Продолжить')
  // t('reservation.back', 'Назад')
  // t('reservation.book', 'Забронировать')

  const lang = i18n.language;
  const description =
    lang === "en"
      ? car.description_en || car.description_ru || car.description_ro || ""
      : lang === "ro"
      ? car.description_ro || car.description_ru || car.description_en || ""
      : car.description_ru || car.description_ro || car.description_en || "";

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

  // Навигация по шагам
  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="reservation-desc"
        className={
          isMobile
            ? "fixed inset-0 w-full max-w-[100vw] min-w-0 min-h-[100dvh] h-[100dvh] top-0 left-0 z-[3000] bg-background overflow-y-auto rounded-none p-0 pt-4 pb-[env(safe-area-inset-bottom,12px)] px-2"
            : "max-w-4xl max-h-[90vh] overflow-y-auto z-[3000] !top-1/2 !left-1/2 !translate-x-[-50%] !translate-y-[-50%] sm:max-w-lg md:max-w-2xl p-6"
        }
        style={
          isMobile
            ? { zIndex: 3000, maxWidth: "100vw", minWidth: 0 }
            : { zIndex: 3000 }
        }
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

        {/* Wizard steps */}
        <div className="w-full">
          {currentStep === 0 && (
            <div className="flex flex-col items-center gap-6">
              {/* Фото (carousel) */}
              <div className="w-full flex flex-col items-center">
                <h2 className="text-2xl font-bold text-center mb-2 text-white">
                  {car.name}
                </h2>
                <div className="relative w-full max-w-md mx-auto">
                  <img
                    src={car.images[activeIndex] || logo}
                    alt={car.name}
                    className="w-full h-64 object-cover rounded-lg border border-gray-800"
                  />
                  {/* Стрелки */}
                  {car.images && car.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-yellow-400 rounded-full p-1 hover:bg-yellow-500 transition"
                        aria-label="Prev"
                      >
                        &#8592;
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-yellow-400 rounded-full p-1 hover:bg-yellow-500 transition"
                        aria-label="Next"
                      >
                        &#8594;
                      </button>
                    </>
                  )}
                </div>
                {/* Миниатюры */}
                {car.images && car.images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-2">
                    {car.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`thumb-${idx}`}
                        className={`w-14 h-14 object-cover rounded cursor-pointer border-2 ${
                          activeIndex === idx
                            ? "border-yellow-400"
                            : "border-gray-700"
                        }`}
                        onClick={() => setActiveIndex(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Стоимость (carousel) */}
              <CarouselWithCenter
                items={[
                  {
                    label: t("reservation.pricePerDay", "1 день"),
                    value: car.pricePerDay,
                  },
                  {
                    label: t("reservation.price2to10", "2-10 дней"),
                    value: car.price2to10,
                  },
                  {
                    label: t("reservation.price11to20", "11-20 дней"),
                    value: car.price11to20,
                  },
                  {
                    label: t("reservation.price21to29", "21-29 дней"),
                    value: car.price21to29,
                  },
                  {
                    label: t("reservation.price30plus", "30+ дней"),
                    value: car.price30plus,
                  },
                ]}
                title={t("reservation.priceTitle", "Стоимость аренды")}
                colorCenter="bg-yellow-400 text-black"
                colorSide="bg-gray-800 text-white opacity-60"
                valueSuffix="€"
              />

              {/* Характеристики (carousel) */}
              <CarouselWithCenter
                items={[
                  { label: t("reservation.drive", "Привод"), value: car.drive },
                  { label: t("reservation.fuel", "Топливо"), value: car.fuel },
                  {
                    label: t("reservation.rating", "Рейтинг"),
                    value: car.rating,
                  },
                  {
                    label: t("reservation.passengers", "Количество мест"),
                    value: car.passengers,
                  },
                  {
                    label: t("reservation.transmission", "Коробка"),
                    value: car.transmission,
                  },
                  {
                    label: t("reservation.year", "Год выпуска"),
                    value: car.year,
                  },
                  {
                    label: t("reservation.engine", "Двигатель"),
                    value: car.engine,
                  },
                ]}
                title={t(
                  "reservation.featuresTitle",
                  "Характеристики автомобиля"
                )}
                colorCenter="bg-yellow-400 text-black"
                colorSide="bg-gray-800 text-white opacity-60"
              />

              {/* Календарь и время */}
              <div className="w-full max-w-md mx-auto">
                <h3 className="text-xl font-bold text-center mb-2">
                  {t("reservation.calendarTitle", "Период аренды")}
                </h3>
                {/* Здесь должен быть ваш календарь и time picker */}
                {/* ... */}
              </div>

              {/* Доп. услуги */}
              <div className="w-full max-w-md mx-auto">
                <h3 className="text-xl font-bold text-center mb-2">
                  {t("reservation.extraServices", "Дополнительные услуги")}
                </h3>
                <div className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3 mb-2">
                  <span>
                    {t(
                      "reservation.unlimitedMileage",
                      "Безлимитный километраж"
                    )}
                  </span>
                  <input
                    type="checkbox"
                    className="form-switch"
                    checked={!!wizardData.unlimitedMileage}
                    onChange={(e) =>
                      setWizardData((d) => ({
                        ...d,
                        unlimitedMileage: e.target.checked,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Как забрать машину */}
              <div className="w-full max-w-md mx-auto">
                <h3 className="text-xl font-bold text-center mb-2">
                  {t("reservation.pickupType", "Как забрать машину")}
                </h3>
                <div className="flex flex-col gap-2 bg-gray-700 rounded-lg px-4 py-3 mb-2">
                  <label className="flex items-center justify-between">
                    <span>
                      {t("reservation.pickupOffice", "Заберу из офиса")}
                    </span>
                    <input
                      type="radio"
                      name="pickupType"
                      checked={wizardData.pickupType === "office"}
                      onChange={() =>
                        setWizardData((d) => ({ ...d, pickupType: "office" }))
                      }
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>
                      {t("reservation.pickupAirport", "Заберу из аэропорта")}
                    </span>
                    <input
                      type="radio"
                      name="pickupType"
                      checked={wizardData.pickupType === "airport"}
                      onChange={() =>
                        setWizardData((d) => ({ ...d, pickupType: "airport" }))
                      }
                    />
                  </label>
                  <div className="border-t border-red-500 my-2"></div>
                  <label className="flex flex-col gap-1">
                    <span className="text-center">
                      {t(
                        "reservation.pickupAddress",
                        "Или доставить по адресу"
                      )}
                    </span>
                    <input
                      type="text"
                      className="bg-gray-800 rounded px-2 py-1 text-white"
                      placeholder={t(
                        "reservation.enterAddress",
                        "Введите адрес"
                      )}
                      value={
                        wizardData.pickupType === "address"
                          ? wizardData.pickupAddress || ""
                          : ""
                      }
                      onFocus={() =>
                        setWizardData((d) => ({ ...d, pickupType: "address" }))
                      }
                      onChange={(e) =>
                        setWizardData((d) => ({
                          ...d,
                          pickupType: "address",
                          pickupAddress: e.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Индикатор шага перед кнопкой */}
              <div className="w-full flex justify-center mb-2 mt-2">
                <span className="text-sm font-semibold text-yellow-400 bg-black/30 rounded px-3 py-1">
                  {t("reservation.step", "Шаг")} {stepIndicator}
                </span>
              </div>
              <Button className="w-full mt-2" onClick={goNext}>
                {t("reservation.next", "Продолжить")}
              </Button>
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <div className="text-center text-lg font-bold mb-4">
                {t("reservation.step2Title", "Подтверждение")}
              </div>
              {/* TODO: Здесь будут реальные поля для резюме, периода аренды, геолокации, правил, карты клиента, стоимости */}
              <Button className="w-full mt-8" onClick={goNext}>
                {t("reservation.next", "Продолжить")}
              </Button>
              <Button
                className="w-full mt-2"
                variant="outline"
                onClick={goBack}
              >
                {t("reservation.back", "Назад")}
              </Button>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <div className="text-center text-lg font-bold mb-4">
                {t("reservation.step3Title", "Данные клиента")}
              </div>
              {/* TODO: Здесь будут реальные поля для личных данных, загрузки фото, телефона, чекбокса, политики, кнопки забронировать */}
              <Button className="w-full mt-8" type="submit">
                {t("reservation.book", "Забронировать")}
              </Button>
              <Button
                className="w-full mt-2"
                variant="outline"
                onClick={goBack}
              >
                {t("reservation.back", "Назад")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarReservationModal;

// Универсальный loop-carousel с плавной анимацией смены центра
function CarouselWithCenter({
  items,
  title,
  colorCenter,
  colorSide,
  valueSuffix = "",
}) {
  const visibleCount = 5; // всегда нечетное
  const center = Math.floor(visibleCount / 2);
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const getVisibleItems = () => {
    return Array.from({ length: visibleCount }, (_, i) => {
      const idx = (activeIdx + i - center + items.length) % items.length;
      return items[idx];
    });
  };
  const prev = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 350);
    setActiveIdx((idx) => (idx - 1 + items.length) % items.length);
  };
  const next = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 350);
    setActiveIdx((idx) => (idx + 1) % items.length);
  };
  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) prev();
    if (delta < -40) next();
    touchStartX.current = null;
  };
  return (
    <div className="w-full max-w-full md:max-w-lg mx-auto relative">
      <h3 className="text-xl font-bold text-center mb-2 text-white">{title}</h3>
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 rounded-full text-yellow-400 hover:bg-yellow-500 transition"
      >
        &#8592;
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 rounded-full text-yellow-400 hover:bg-yellow-500 transition"
      >
        &#8594;
      </button>
      <div
        className="flex gap-0.5 md:gap-2 justify-center items-center py-1 md:py-2 w-full overflow-hidden flex-nowrap"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {getVisibleItems().map((item, idx) => (
          <div
            key={idx}
            onClick={() =>
              setActiveIdx(
                (activeIdx + idx - center + items.length) % items.length
              )
            }
            className={`rounded-lg px-0.5 md:px-2 py-1 md:py-2
              ${
                idx === center
                  ? "min-w-[120px] max-w-[180px] md:min-w-[140px] md:max-w-[220px] whitespace-normal break-words"
                  : "min-w-[70px] max-w-[80px] sm:min-w-[90px] sm:max-w-[90px] md:min-w-[110px] md:max-w-[110px] truncate"
              }
              text-center select-none transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer
              ${
                idx === center
                  ? `${colorCenter} scale-110 shadow-lg font-bold opacity-100`
                  : `${colorSide} scale-90 opacity-60`
              }
              ${animating ? "carousel-animating" : ""}`}
            style={{ zIndex: idx === center ? 2 : 1 }}
          >
            <div className="text-xs mb-1 opacity-70">{item.label}</div>
            <div
              className={`text-2xl font-bold transition-all duration-350 ${
                idx === center
                  ? "scale-110 whitespace-normal break-words"
                  : "scale-90 opacity-80 truncate"
              }`}
            >
              {item.value}
              {valueSuffix ? ` ${valueSuffix}` : ""}
            </div>
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1 mt-1">
        {items.map((_, idx) => (
          <span
            key={idx}
            className={`h-3 w-3 rounded-full transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]
              ${
                activeIdx === idx
                  ? "bg-yellow-400 scale-110 shadow"
                  : "bg-gray-600 scale-90 opacity-70"
              }`}
          ></span>
        ))}
      </div>
      <style>{`
        .carousel-animating {
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s cubic-bezier(0.22,1,0.36,1);
        }
      `}</style>
    </div>
  );
}
