import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/lib/airtable";
import TimePicker from "@/components/ui/time-picker-wheel";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// Импорт SVG-иконок для правил
import NoSmokeIcon from "@/assets/logorule/no-smoking-sign-svgrepo-com.svg";
import NoPetsIcon from "@/assets/logorule/no-pets-svgrepo-com.svg";
import FuelIcon from "@/assets/logorule/fuel-counter-svgrepo-com.svg";
import NoDepositIcon from "@/assets/logorule/no-money-poverty-budget-poor-cash-svgrepo-com.svg";
import SpeedIcon from "@/assets/logorule/website-performance-internet-svgrepo-com.svg";
import AggressiveIcon from "@/assets/logorule/fast-acceleration-svgrepo-com.svg";

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
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
    pickupLocation: "",
    message: "",
    pickupType: "office", // по умолчанию 'заберу из офиса'
  } as {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    pickupDate: string;
    returnDate: string;
    pickupTime: string;
    returnTime: string;
    pickupLocation: string;
    message: string;
    pickupType: string;
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Для стандартного календаря
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const date = new Date(value);
    const isDisabled = disabledDays.some(
      (dd) =>
        dd.getFullYear() === date.getFullYear() &&
        dd.getMonth() === date.getMonth() &&
        dd.getDate() === date.getDate()
    );
    if (isDisabled) {
      toast({
        title: t("reservation.disabledRangeTitle", "Нельзя выбрать эти даты"),
        description: t("reservation.disabledRangeDesc", "Эта дата занята."),
        variant: "destructive",
      });
      return;
    }
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrder({
        name: formData.firstName + " " + formData.lastName,
        phone: formData.phone,
        email: formData.email,
        car: [car.id], // <-- передаём id машины как массив
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
        pickupTime: "",
        returnTime: "",
        pickupLocation: "",
        message: "",
        pickupType: "office",
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
  const goNext = () => {
    setCurrentStep((s) => {
      const next = Math.min(s + 1, STEPS.length - 1);
      if (next === 1) {
        setTimeout(() => {
          const modal = document.querySelector(
            '.DialogContent, .dialog-content, [role="dialog"]'
          );
          if (modal) {
            modal.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 50);
      }
      return next;
    });
  };
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 1000 * 60 * 5,
  });
  // Получаем только заявки по этой машине и только подтверждённые
  const carOrders = orders.filter((order) => {
    const carIds = Array.isArray(order.car)
      ? order.car.map((id) => String(id).trim())
      : [String(order.car).trim()];
    return (
      carIds.includes(String(car.id).trim()) &&
      order.status === "подтверждена" &&
      order.startDate &&
      order.endDate
    );
  });
  // Универсальный парсер дат
  function parseDate(str: string) {
    if (!str) return null;
    if (str.includes("-")) {
      // Формат YYYY-MM-DD
      const [year, month, day] = str.split("-");
      return new Date(+year, +month - 1, +day);
    } else if (str.includes(".")) {
      // Формат дд.мм.гггг
      const [day, month, year] = str.split(".");
      return new Date(+year, +month - 1, +day);
    }
    return null;
  }

  // Генерируем массив занятых дат (только дата, без времени, с универсальным парсером)
  const disabledDays: Date[] = [];
  carOrders.forEach((order) => {
    const start = parseDate(order.startDate);
    const end = parseDate(order.endDate);
    if (!start || !end) return;
    for (
      let d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      disabledDays.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    }
  });

  const isDisabled = (date: Date | undefined) =>
    !!date &&
    disabledDays.some(
      (dd) =>
        dd.getFullYear() === date.getFullYear() &&
        dd.getMonth() === date.getMonth() &&
        dd.getDate() === date.getDate()
    );

  const selected =
    isDisabled(
      formData.pickupDate ? new Date(formData.pickupDate) : undefined
    ) ||
    isDisabled(formData.returnDate ? new Date(formData.returnDate) : undefined)
      ? undefined
      : {
          from: formData.pickupDate ? new Date(formData.pickupDate) : undefined,
          to: formData.returnDate ? new Date(formData.returnDate) : undefined,
        };

  // Преобразование даты в локальный формат YYYY-MM-DD
  const toLocalDateString = (date: Date | undefined) =>
    date
      ? `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
      : "";

  // Удаляю всё, что связано с returnTime (кнопки, state, TimePicker, select и т.д.)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={
          isMobile
            ? "fixed inset-0 w-full max-w-[400px] sm:max-w-[98vw] min-w-0 min-h-[100dvh] h-[100dvh] top-0 left-0 z-[3000] bg-background overflow-y-auto rounded-none p-0 pt-4 pb-[env(safe-area-inset-bottom,12px)] px-4 sm:px-2 box-border"
            : "max-w-4xl max-h-[90vh] overflow-y-auto z-[3000] !top-1/2 !left-1/2 !translate-x-[-50%] !translate-y-[-50%] sm:max-w-lg md:max-w-2xl p-6 md:px-8 box-border"
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
          <DialogDescription className="sr-only">
            {t(
              "reservation.dialogDescription",
              "Форма бронирования автомобиля. Заполните все поля и отправьте заявку."
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Wizard steps */}
        <div className="w-full">
          {currentStep === 0 && (
            <div className="flex flex-col items-center gap-1">
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
                <div className="flex flex-col items-center gap-2">
                  <ShadcnCalendar
                    mode="range"
                    selected={selected}
                    onSelect={(range) => {
                      // Проверка на disabled
                      const isDisabled = (date: Date | undefined) =>
                        !!date &&
                        disabledDays.some(
                          (dd) =>
                            dd.getFullYear() === date.getFullYear() &&
                            dd.getMonth() === date.getMonth() &&
                            dd.getDate() === date.getDate()
                        );

                      // Если клик по disabled — сброс
                      if (isDisabled(range?.from) || isDisabled(range?.to)) {
                        toast({
                          title: t(
                            "reservation.disabledRangeTitle",
                            "Нельзя выбрать эти даты"
                          ),
                          description: t(
                            "reservation.disabledRangeDesc",
                            "В выбранном диапазоне есть занятые дни. Пожалуйста, выберите другой период."
                          ),
                          variant: "destructive",
                        });
                        setFormData((prev) => ({
                          ...prev,
                          pickupDate: "",
                          returnDate: "",
                        }));
                        return;
                      }

                      // Если диапазон выбран и пользователь кликает на дату раньше from — сброс и новая дата выдачи
                      if (range?.from && range?.to && range.to < range.from) {
                        setFormData((prev) => ({
                          ...prev,
                          pickupDate: toLocalDateString(range.to),
                          returnDate: "",
                        }));
                        return;
                      }

                      // Если только from выбран — это дата выдачи
                      if (range?.from && !range?.to) {
                        setFormData((prev) => ({
                          ...prev,
                          pickupDate: toLocalDateString(range.from),
                          returnDate: "",
                        }));
                        return;
                      }

                      // Если выбран валидный диапазон
                      if (range?.from && range?.to) {
                        setFormData((prev) => ({
                          ...prev,
                          pickupDate: toLocalDateString(range.from),
                          returnDate: toLocalDateString(range.to),
                        }));
                        return;
                      }

                      // Если ничего не выбрано — сброс
                      setFormData((prev) => ({
                        ...prev,
                        pickupDate: "",
                        returnDate: "",
                      }));
                    }}
                    disabled={disabledDays}
                    fromDate={new Date()}
                    className="rounded-xl bg-zinc-900/80 border border-zinc-700 shadow-lg p-2 text-white"
                    classNames={{
                      day_selected:
                        "bg-yellow-400 text-black hover:bg-yellow-500",
                      day_range_end: "bg-yellow-500 text-black",
                      day_today: "border-yellow-400 border-2",
                      nav_button: "hover:bg-yellow-400/20",
                    }}
                    modifiersClassNames={{
                      disabled: "calendar-day-disabled-strike",
                    }}
                  />
                  {/* После календаря: */}
                  <div className="mt-4 w-full">
                    <h3 className="text-xl font-bold text-center mb-2">
                      {t("reservation.pickupTime", "Время выдачи")}
                    </h3>
                    <TimePicker
                      value={formData.pickupTime || "10:00"}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, pickupTime: val }))
                      }
                      onClose={() => {}}
                    />
                  </div>
                </div>
              </div>

              {/* Доп. услуги */}
              <div className="w-full max-w-md sm:max-w-full mx-auto mb-2">
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
                  <Checkbox
                    checked={!!wizardData.unlimitedMileage}
                    onCheckedChange={(checked) =>
                      setWizardData((d) => ({
                        ...d,
                        unlimitedMileage: !!checked,
                      }))
                    }
                    className="data-[state=checked]:bg-yellow-400 border-yellow-400"
                  />
                </div>
              </div>

              {/* Как забрать машину */}
              <div className="w-full max-w-md sm:max-w-full mx-auto mb-2">
                <h3 className="text-xl font-bold text-center mb-2">
                  {t("reservation.pickupType", "Как забрать машину")}
                </h3>
                <RadioGroup
                  value={wizardData.pickupType || "office"}
                  onValueChange={(val) =>
                    setWizardData((d) => ({
                      ...d,
                      pickupType: val as "office" | "airport" | "address",
                    }))
                  }
                  className="flex flex-col gap-2 bg-gray-700 rounded-lg px-4 py-3 mb-2"
                >
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>
                      {t("reservation.pickupOffice", "Заберу из офиса")}
                    </span>
                    <RadioGroupItem
                      value="office"
                      className="data-[state=checked]:bg-yellow-400 border-yellow-400"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>
                      {t("reservation.pickupAirport", "Заберу из аэропорта")}
                    </span>
                    <RadioGroupItem
                      value="airport"
                      className="data-[state=checked]:bg-yellow-400 border-yellow-400"
                    />
                  </label>
                  <div className="border-t border-yellow-500 my-2"></div>
                  <label className="flex flex-col gap-1 cursor-pointer">
                    <span className="text-center">
                      {t(
                        "reservation.pickupAddress",
                        "Или доставить по адресу"
                      )}
                    </span>
                    <Input
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
                          pickupType: "address" as const,
                          pickupAddress: e.target.value,
                        }))
                      }
                    />
                  </label>
                </RadioGroup>
              </div>

              {/* Индикатор шага перед кнопкой */}
              <div className="w-full flex justify-center mb-1">
                <span className="text-sm font-semibold text-yellow-400 bg-black/30 rounded px-3 py-1">
                  {t("reservation.step", "Шаг")} {stepIndicator}
                </span>
              </div>
              {/* Шаг 1: компактные отступы */}
              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-lg font-bold py-3 rounded-xl"
                onClick={goNext}
                disabled={!formData.pickupDate || !formData.returnDate}
              >
                {t("reservation.next", "Продолжить")}
              </Button>
              <Button
                className="w-full mt-2 bg-black text-yellow-400 border-yellow-400 border-2 text-lg font-bold py-3 rounded-xl"
                variant="outline"
                onClick={goBack}
              >
                {t("reservation.back", "Назад")}
              </Button>
            </div>
          )}
          {currentStep === 1 && (
            <div className="w-full max-w-md sm:max-w-full mx-auto">
              {/* Заголовок */}
              <div className="text-2xl font-bold mb-4 text-white text-center">
                {t("reservation.confirmTitle", "Подтверждение")}
              </div>

              {/* Период аренды */}
              <div className="mb-3">
                <div className="text-lg font-bold text-yellow-400 mb-1">
                  {t("reservation.periodTitle", "Период аренды")}
                </div>
                <div className="bg-zinc-900 rounded-xl px-4 py-3 flex flex-col gap-1 border border-yellow-400">
                  {formData.pickupDate && formData.returnDate ? (
                    <>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center">
                        <span className="text-white text-base font-semibold">
                          {new Date(formData.pickupDate).toLocaleDateString(
                            "ru-RU",
                            { day: "2-digit", month: "long" }
                          )}
                          <span className="ml-1 text-yellow-400 font-bold">
                            {formData.pickupTime || "10:00"}
                          </span>
                        </span>
                        <span className="mx-2 text-yellow-400 font-bold">
                          —
                        </span>
                        <span className="text-white text-base font-semibold">
                          {new Date(formData.returnDate).toLocaleDateString(
                            "ru-RU",
                            { day: "2-digit", month: "long" }
                          )}
                          <span className="ml-1 text-yellow-400 font-bold">
                            {formData.returnTime || "10:00"}
                          </span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-zinc-400">
                      {t("reservation.periodNotSelected", "Не выбрано")}
                    </span>
                  )}
                </div>
              </div>

              {/* Геолокация */}
              <div className="mb-3">
                <div className="text-lg font-bold text-yellow-400 mb-1">
                  {t("reservation.geoTitle", "Геолокация")}
                </div>
                <div className="bg-zinc-900 rounded-xl px-4 py-3 text-base text-white border border-yellow-400">
                  {wizardData.pickupType === "office" || !wizardData.pickupType
                    ? t(
                        "reservation.officeAddress",
                        "Город Кишинев, Проспект Мирча чел Бэтрын 4/4"
                      )
                    : wizardData.pickupType === "airport"
                    ? t(
                        "reservation.airportAddress",
                        "Аэропорт Кишинев, Dacia 80/3"
                      )
                    : wizardData.pickupAddress ||
                      t("reservation.enterAddress", "Введите адрес")}
                </div>
              </div>

              {/* Правила пользования автомобилем */}
              <div className="mb-3">
                <div className="text-lg font-bold mb-2 text-yellow-400">
                  {t(
                    "reservation.rulesTitle",
                    "Правила пользования автомобилем"
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-zinc-900 rounded-xl p-4 border border-yellow-400">
                  <div className="flex items-center gap-3 text-white">
                    <img
                      src={NoSmokeIcon}
                      alt="Не курить"
                      className="w-7 h-7"
                    />
                    <span>{t("reservation.ruleNoSmoke", "Не курить")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <img
                      src={NoPetsIcon}
                      alt="Без животных"
                      className="w-7 h-7"
                    />
                    <span>{t("reservation.ruleNoPets", "Без животных")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <img
                      src={FuelIcon}
                      alt="Возврат с тем же уровнем топлива"
                      className="w-7 h-7"
                    />
                    <span>
                      {t(
                        "reservation.ruleFuel",
                        "Возврат с тем же уровнем топлива"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <img
                      src={NoDepositIcon}
                      alt="Без залога"
                      className="w-7 h-7"
                    />
                    <span>{t("reservation.ruleNoDeposit", "Без залога")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <img
                      src={SpeedIcon}
                      alt="Максимальная скорость 120 км/ч"
                      className="w-7 h-7"
                    />
                    <span>
                      {t(
                        "reservation.ruleSpeed",
                        "Максимальная скорость 120 км/ч"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <img
                      src={AggressiveIcon}
                      alt="Без агрессивной езды"
                      className="w-7 h-7"
                    />
                    <span>
                      {t(
                        "reservation.ruleNoAggressive",
                        "Без агрессивной езды"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Карта постоянного клиента */}
              <div className="mb-3">
                <div className="text-xl font-bold text-center mb-2 text-yellow-400">
                  {t(
                    "reservation.clientCardTitle",
                    "Карта постоянного клиента"
                  )}
                </div>
                <div className="flex flex-col gap-2 bg-zinc-900 rounded-xl p-4 border border-yellow-400">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span>Gold карта</span>
                    <Checkbox
                      checked={!!wizardData.goldCard}
                      onCheckedChange={(checked) =>
                        setWizardData((d) => ({ ...d, goldCard: !!checked }))
                      }
                      className="data-[state=checked]:bg-yellow-400 border-yellow-400"
                    />
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span>Club карта</span>
                    <Checkbox
                      checked={!!wizardData.clubCard}
                      onCheckedChange={(checked) =>
                        setWizardData((d) => ({ ...d, clubCard: !!checked }))
                      }
                      className="data-[state=checked]:bg-yellow-400 border-yellow-400"
                    />
                  </label>
                </div>
              </div>

              {/* Стоимость */}
              <div className="mb-0">
                <div className="text-lg font-bold text-yellow-400 mb-2">
                  {t("reservation.costTitle", "Стоимость")}
                </div>
                <div className="bg-zinc-900 rounded-xl p-4 flex flex-col gap-2 text-white border border-yellow-400">
                  <div className="flex justify-between">
                    <span>
                      {t("reservation.duration", "Продолжительность аренды")}
                    </span>{" "}
                    <span>
                      {calculateDays()} {t("reservation.days", "дн(я/ей)")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("reservation.wash", "Мойка")}</span>{" "}
                    <span>20 €</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>
                      {t("reservation.rentCost", "Стоимость за аренду авто")}
                    </span>{" "}
                    <span>{totalPrice} €</span>
                  </div>
                </div>
              </div>

              {/* Индикатор шага перед кнопкой */}
              <div className="w-full flex justify-center mb-2 mt-2">
                <span className="text-sm font-semibold text-yellow-400 bg-black/30 rounded px-3 py-1">
                  {t("reservation.step", "Шаг")} {stepIndicator}
                </span>
              </div>
              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-lg font-bold py-3 rounded-xl"
                onClick={goNext}
              >
                {t("reservation.next", "Продолжить")}
              </Button>
              <Button
                className="w-full mt-2 bg-black text-yellow-400 border-yellow-400 border-2 text-lg font-bold py-3 rounded-xl"
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
  // Адаптивное количество видимых элементов
  const [visibleCount, setVisibleCount] = useState(5);
  useEffect(() => {
    const updateCount = () => {
      setVisibleCount(window.innerWidth <= 640 ? 3 : 5);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);
  const center = Math.floor(visibleCount / 2);
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const getVisibleItems = () => {
    const half = Math.floor(visibleCount / 2);
    const arr = [];
    for (let i = -half; i <= half; i++) {
      arr.push(items[(activeIdx + i + items.length) % items.length]);
    }
    return arr;
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
        className="flex gap-1 md:gap-2 justify-center items-center py-1 md:py-2 w-full overflow-hidden flex-nowrap"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {getVisibleItems().map((item, idx) => (
          <div
            key={idx}
            onClick={() =>
              setActiveIdx(
                (activeIdx +
                  idx -
                  Math.floor(visibleCount / 2) +
                  items.length) %
                  items.length
              )
            }
            className={`rounded-lg px-1 md:px-2 py-1 md:py-2
              ${
                idx === Math.floor(visibleCount / 2)
                  ? "min-w-[110px] max-w-[140px] sm:min-w-[120px] sm:max-w-[180px] whitespace-normal break-words"
                  : "min-w-[60px] max-w-[70px] sm:min-w-[90px] sm:max-w-[90px] md:min-w-[110px] md:max-w-[110px] truncate"
              }
              text-center select-none transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer
              ${
                idx === Math.floor(visibleCount / 2)
                  ? `${colorCenter} scale-110 shadow-lg font-bold opacity-100`
                  : `${colorSide} scale-90 opacity-60`
              }
              ${animating ? "carousel-animating" : ""}`}
            style={{ zIndex: idx === Math.floor(visibleCount / 2) ? 2 : 1 }}
          >
            <div className="text-xs mb-1 opacity-70">{item.label}</div>
            <div
              className={`text-xl font-bold transition-all duration-350 ${
                idx === Math.floor(visibleCount / 2)
                  ? "scale-110 whitespace-normal break-words"
                  : "text-base scale-90 opacity-80 truncate"
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
        .calendar-day-disabled-strike::after {
          content: "";
          position: absolute;
          left: 15%;
          top: 50%;
          width: 70%;
          height: 2px;
          background: linear-gradient(90deg, #ff3333 60%, transparent 100%);
          transform: rotate(-20deg);
          pointer-events: none;
          z-index: 2;
        }
        .calendar-day-disabled-strike::before {
          content: "-";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(1.5);
          color: #ff3333;
          font-size: 1.2em;
          font-weight: bold;
          pointer-events: none;
          z-index: 3;
        }
      `}</style>
    </div>
  );
}
