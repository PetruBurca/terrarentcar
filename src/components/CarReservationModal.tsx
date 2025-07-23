import { useState, useEffect, useCallback, useMemo } from "react";
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
import { translateCarSpec } from "@/lib/carTranslations";
import { formatDateRange } from "@/lib/dateHelpers";
import logo from "@/assets/logo.png";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useRef } from "react";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/lib/airtable";
import TimePicker from "@/components/ui/time-picker-wheel";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Импорт SVG-иконок для правил
import NoSmokeIcon from "@/assets/logorule/no-smoking-sign-svgrepo-com.svg";
import NoPetsIcon from "@/assets/logorule/no-pets-svgrepo-com.svg";
import FuelIcon from "@/assets/logorule/fuel-counter-svgrepo-com.svg";
import NoDepositIcon from "@/assets/logorule/no-money-poverty-budget-poor-cash-svgrepo-com.svg";
import SpeedIcon from "@/assets/logorule/website-performance-internet-svgrepo-com.svg";
import AggressiveIcon from "@/assets/logorule/fast-acceleration-svgrepo-com.svg";
// Примеры фото паспорта
import PasportFront from "@/assets/pasport/front.png";
import PasportBack from "@/assets/pasport/back.png";

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
  const [selectedCountryCode, setSelectedCountryCode] = useState("+373");
  const [uploadedPhotos, setUploadedPhotos] = useState({
    front: false,
    back: false,
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "10:00", // Устанавливаю начальное значение
    returnTime: "",
    pickupLocation: "",
    message: "",
    pickupType: "office", // по умолчанию 'заберу из офиса'
    idnp: "", // добавлено поле idnp
    pickupAddress: "",
    unlimitedMileage: false,
    goldCard: false,
    clubCard: false,
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
    idnp: string;
    pickupAddress: string;
    unlimitedMileage: boolean;
    goldCard: boolean;
    clubCard: boolean;
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
        title: t("reservation.disabledRangeTitle"),
        description: t("reservation.disabledRangeDesc"),
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

    // Предотвращаем повторную отправку
    if (isSubmitting) return;

    setIsSubmitting(true);
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);

    try {
      await createOrder({
        name: formData.firstName + " " + formData.lastName,
        phone: formData.phone,
        email: formData.email,
        car: [car.id], // <-- передаём id машины как массив
        startDate: formData.pickupDate,
        endDate: formData.returnDate,
        comment: formData.message,
        pickupTime: formData.pickupTime,
        idnp: formData.idnp,
        pickupType: formData.pickupType,
        pickupAddress: formData.pickupAddress,
        unlimitedMileage: formData.unlimitedMileage,
        goldCard: formData.goldCard,
        clubCard: formData.clubCard,
        idPhotoFront: formDataObj.get("idPhotoFront") as File,
        idPhotoBack: formDataObj.get("idPhotoBack") as File,
        totalCost: totalPrice + 20,
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
        pickupTime: "10:00", // Сброс на начальное значение
        returnTime: "",
        pickupLocation: "",
        message: "",
        pickupType: "office",
        idnp: "", // сброс idnp
        pickupAddress: "",
        unlimitedMileage: false,
        goldCard: false,
        clubCard: false,
      });
      setUploadedPhotos({ front: false, back: false });
      setPrivacyAccepted(false);
      setIsSubmitting(false);
      onClose();
    } catch (e) {
      toast({
        title: t("reservation.errorTitle"),
        description: t("reservation.errorDesc"),
        variant: "destructive",
      });
      setIsSubmitting(false); // Разблокируем кнопку при ошибке
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

  // Валидация для каждого шага
  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: {
        // Шаг 1 - основная информация
        if (!formData.pickupDate) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.pickupDateRequired",
              "Выберите дату выдачи"
            ),
            variant: "destructive",
          });
          return false;
        }
        if (!formData.returnDate) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.returnDateRequired",
              "Выберите дату возврата"
            ),
            variant: "destructive",
          });
          return false;
        }
        if (!formData.pickupTime) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.pickupTimeRequired",
              "Выберите время выдачи"
            ),
            variant: "destructive",
          });
          return false;
        }
        // Проверяем, что дата возврата не раньше даты выдачи
        const pickup = new Date(formData.pickupDate);
        const returnDate = new Date(formData.returnDate);
        if (returnDate <= pickup) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.invalidDateRange",
              "Дата возврата должна быть позже даты выдачи"
            ),
            variant: "destructive",
          });
          return false;
        }
        // Проверяем адрес доставки если выбрана доставка
        if (
          wizardData.pickupType === "address" &&
          !wizardData.pickupAddress?.trim()
        ) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.addressRequired",
              "Введите адрес доставки"
            ),
            variant: "destructive",
          });
          return false;
        }
        return true;
      }

      case 1: {
        // Шаг 2 - подтверждение (нет дополнительных полей для валидации)
        return true;
      }

      case 2: {
        // Шаг 3 - персональные данные
        if (!formData.firstName.trim()) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t("validation.firstNameRequired", "Введите имя"),
            variant: "destructive",
          });
          return false;
        }
        if (!formData.lastName.trim()) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t("validation.lastNameRequired", "Введите фамилию"),
            variant: "destructive",
          });
          return false;
        }
        if (!formData.email.trim()) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t("validation.emailRequired", "Введите email"),
            variant: "destructive",
          });
          return false;
        }
        // Проверка формата email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.emailInvalid",
              "Введите корректный email"
            ),
            variant: "destructive",
          });
          return false;
        }
        if (!formData.phone.trim()) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.phoneRequired",
              "Введите номер телефона"
            ),
            variant: "destructive",
          });
          return false;
        }
        // Проверка длины телефона (минимум 7 цифр после кода страны)
        const phoneDigits = formData.phone.replace(/\D/g, "");
        if (phoneDigits.length < 10) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.phoneInvalid",
              "Введите корректный номер телефона"
            ),
            variant: "destructive",
          });
          return false;
        }
        if (!formData.idnp.trim()) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t("validation.idnpRequired", "Введите IDNP"),
            variant: "destructive",
          });
          return false;
        }
        // Проверка IDNP (должен содержать минимум 10 цифр)
        const idnpDigits = formData.idnp.replace(/\D/g, "");
        if (idnpDigits.length < 10) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.idnpInvalid",
              "IDNP должен содержать минимум 10 цифр"
            ),
            variant: "destructive",
          });
          return false;
        }
        // Проверка загрузки фото документов
        if (!uploadedPhotos.front) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.frontPhotoRequired",
              "Загрузите фото лицевой стороны документа"
            ),
            variant: "destructive",
          });
          return false;
        }
        if (!uploadedPhotos.back) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.backPhotoRequired",
              "Загрузите фото обратной стороны документа"
            ),
            variant: "destructive",
          });
          return false;
        }
        // Проверка согласия с политикой конфиденциальности
        if (!privacyAccepted) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.privacyRequired",
              "Необходимо согласие на обработку персональных данных"
            ),
            variant: "destructive",
          });
          return false;
        }
        return true;
      }

      default:
        return true;
    }
  };

  // Навигация по шагам с валидацией
  const goNext = () => {
    // Валидируем текущий шаг перед переходом
    if (!validateStep(currentStep)) {
      return; // Останавливаем переход если валидация не прошла
    }

    // Синхронизируем данные из wizardData в formData перед переходом
    setFormData((prev) => ({
      ...prev,
      pickupType: wizardData.pickupType || "office",
      pickupAddress: wizardData.pickupAddress || "",
      unlimitedMileage: wizardData.unlimitedMileage || false,
      goldCard: wizardData.goldCard || false,
      clubCard: wizardData.clubCard || false,
    }));

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
      if (next === 2) {
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

  // Сброс состояния при закрытии модала
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsSubmitting(false);
      setPrivacyAccepted(false);
      setUploadedPhotos({ front: false, back: false });
    }
  }, [isOpen]);

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 1000 * 60 * 5,
  });
  // Получаем только заявки по этой машине и только подтверждённые
  const carOrders = orders.filter((order) => {
    console.log("=== DEBUG: CarReservationModal order filtering ===");
    console.log("Order:", {
      id: order.id,
      carIds: order.carIds,
      status: order.status,
      startDate: order.startDate,
      endDate: order.endDate,
    });
    console.log("Current car ID:", car.id);

    const hasCarId = order.carIds && order.carIds.includes(car.id);
    const isConfirmed =
      order.status === "подтверждена" || order.status === "подтвержден";
    const hasDates = order.startDate && order.endDate;

    console.log("Filter results:", { hasCarId, isConfirmed, hasDates });
    console.log("Order matches:", hasCarId && isConfirmed && hasDates);

    return hasCarId && isConfirmed && hasDates;
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

  // Список стран с кодами
  const countries = [
    { code: "+373", name: "Moldova", flag: "🇲🇩" },
    { code: "+1", name: "USA/Canada", flag: "🇺🇸" },
    { code: "+7", name: "Russia", flag: "🇷🇺" },
    { code: "+40", name: "Romania", flag: "🇷🇴" },
    { code: "+380", name: "Ukraine", flag: "🇺🇦" },
    { code: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "+33", name: "France", flag: "🇫🇷" },
    { code: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "+44", name: "UK", flag: "🇬🇧" },
    { code: "+48", name: "Poland", flag: "🇵🇱" },
    { code: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "+43", name: "Austria", flag: "🇦🇹" },
    { code: "+32", name: "Belgium", flag: "🇧🇪" },
    { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
    { code: "+36", name: "Hungary", flag: "🇭🇺" },
    { code: "+90", name: "Turkey", flag: "🇹🇷" },
    { code: "+972", name: "Israel", flag: "🇮🇱" },
    { code: "+86", name: "China", flag: "🇨🇳" },
    { code: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "+82", name: "South Korea", flag: "🇰🇷" },
    { code: "+91", name: "India", flag: "🇮🇳" },
    { code: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={isSubmitting ? undefined : onClose}>
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
          onClick={isSubmitting ? undefined : onClose}
          className={`absolute top-3 right-3 z-20 text-3xl text-yellow-400 hover:text-yellow-200 transition md:top-4 md:right-4 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label={t("reservation.cancel")}
          disabled={isSubmitting}
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
        <div className="w-full pb-4">
          {currentStep === 0 && (
            <div className="flex flex-col items-center gap-1 pb-4">
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
                    label: t("reservation.pricePerDay"),
                    value: car.pricePerDay,
                  },
                  {
                    label: t("reservation.price2to10"),
                    value: car.price2to10,
                  },
                  {
                    label: t("reservation.price11to20"),
                    value: car.price11to20,
                  },
                  {
                    label: t("reservation.price21to29"),
                    value: car.price21to29,
                  },
                  {
                    label: t("reservation.price30plus"),
                    value: car.price30plus,
                  },
                ]}
                title={t("reservation.priceTitle")}
                colorCenter="bg-yellow-400 text-black"
                colorSide="bg-gray-800 text-white opacity-60"
                valueSuffix="€"
              />

              {/* Характеристики (carousel) */}
              <CarouselWithCenter
                items={[
                  {
                    label: t("reservation.drive"),
                    value: translateCarSpec("drive", car.drive, t),
                  },
                  {
                    label: t("reservation.fuel"),
                    value: translateCarSpec("fuel", car.fuel, t),
                  },
                  {
                    label: t("reservation.rating"),
                    value: car.rating,
                  },
                  {
                    label: t("reservation.passengers"),
                    value: car.passengers,
                  },
                  {
                    label: t("reservation.transmission"),
                    value: translateCarSpec(
                      "transmission",
                      car.transmission,
                      t
                    ),
                  },
                  {
                    label: t("reservation.year"),
                    value: car.year,
                  },
                  {
                    label: t("reservation.engine"),
                    value: car.engine,
                  },
                ]}
                title={t("reservation.featuresTitle")}
                colorCenter="bg-yellow-400 text-black"
                colorSide="bg-gray-800 text-white opacity-60"
              />

              {/* Календарь и время */}
              <div className="w-full max-w-md mx-auto">
                <h3 className="text-xl font-bold text-center mb-2">
                  {t("reservation.calendarTitle")}
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
                      {t("reservation.pickupTime")}
                    </h3>
                    <TimePicker
                      value={formData.pickupTime}
                      onChange={(val) => {
                        setFormData((prev) => {
                          const newData = { ...prev, pickupTime: val };
                          return newData;
                        });
                      }}
                      onClose={() => {}}
                    />
                  </div>
                </div>
              </div>

              {/* Доп. услуги */}
              <div className="w-full max-w-md sm:max-w-full mx-auto mb-2">
                <h3 className="text-xl font-bold text-center mb-2">
                  {t("reservation.extraServices")}
                </h3>
                <div className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3 mb-2">
                  <span>{t("reservation.unlimitedMileage")}</span>
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
                  {t("reservation.pickupType")}
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
                    <span>{t("reservation.pickupOffice")}</span>
                    <RadioGroupItem
                      value="office"
                      className="data-[state=checked]:bg-yellow-400 border-yellow-400"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>{t("reservation.pickupAirport")}</span>
                    <RadioGroupItem
                      value="airport"
                      className="data-[state=checked]:bg-yellow-400 border-yellow-400"
                    />
                  </label>
                  <div className="border-t border-yellow-500 my-2"></div>
                  <label className="flex flex-col gap-1 cursor-pointer">
                    <span className="text-center">
                      {t("reservation.pickupAddress")}
                    </span>
                    <Input
                      type="text"
                      className="bg-gray-800 rounded px-2 py-1 text-white"
                      placeholder={t("reservation.enterAddress")}
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
                  {t("reservation.step")} {stepIndicator}
                </span>
              </div>
              {/* Шаг 1: компактные отступы */}
              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-lg font-bold py-3 rounded-xl"
                onClick={goNext}
                disabled={!formData.pickupDate || !formData.returnDate}
              >
                {t("reservation.next")}
              </Button>
              <Button
                className="w-full mt-2 bg-black text-yellow-400 border-yellow-400 border-2 text-lg font-bold py-3 rounded-xl"
                variant="outline"
                onClick={goBack}
              >
                {t("reservation.back")}
              </Button>
            </div>
          )}
          {currentStep === 1 && (
            <div className="w-full max-w-md sm:max-w-full mx-auto pb-4">
              {/* Заголовок */}
              <div className="text-2xl font-bold mb-4 text-white text-center">
                {t("reservation.confirmTitle")}
              </div>

              {/* Период аренды */}
              <div className="mb-3">
                <div className="text-lg font-bold text-yellow-400 mb-1">
                  {t("reservation.periodTitle")}
                </div>
                <div className="bg-zinc-900 rounded-xl px-4 py-3 flex flex-col gap-1 border border-yellow-400">
                  {formData.pickupDate && formData.returnDate ? (
                    <div className="text-white text-base font-semibold text-center">
                      {(() => {
                        const dates = formatDateRange(
                          formData.pickupDate,
                          formData.returnDate,
                          i18n.language
                        );
                        return (
                          <>
                            {dates.start}
                            <span className="mx-2 text-yellow-400 font-bold">
                              —
                            </span>
                            {dates.end}
                            <span className="ml-2 text-yellow-400 font-bold">
                              {formData.pickupTime}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <span className="text-zinc-400">
                      {t("reservation.periodNotSelected")}
                    </span>
                  )}
                </div>
              </div>

              {/* Геолокация */}
              <div className="mb-3">
                <div className="text-lg font-bold text-yellow-400 mb-1">
                  {t("reservation.geoTitle")}
                </div>
                <div className="bg-zinc-900 rounded-xl px-4 py-3 text-base text-white border border-yellow-400">
                  {wizardData.pickupType === "office" || !wizardData.pickupType
                    ? t("reservation.officeAddress")
                    : wizardData.pickupType === "airport"
                    ? t("reservation.airportAddress")
                    : wizardData.pickupAddress || t("reservation.enterAddress")}
                </div>
              </div>

              {/* Правила пользования автомобилем */}
              <div className="mb-3">
                <div className="text-lg font-bold mb-2 text-yellow-400">
                  {t("reservation.rulesTitle")}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-zinc-900 rounded-xl p-4 border border-yellow-400">
                  <div className="flex items-center gap-3 text-white">
                    <img
                      src={NoSmokeIcon}
                      alt="Не курить"
                      className="w-7 h-7"
                    />
                    <span>{t("reservation.ruleNoSmoke")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <img src={NoPetsIcon} alt="No pets" className="w-7 h-7" />
                    <span>{t("reservation.ruleNoPets")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <img src={FuelIcon} alt="Fuel return" className="w-7 h-7" />
                    <span>{t("reservation.ruleFuel")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <img
                      src={NoDepositIcon}
                      alt="No deposit"
                      className="w-7 h-7"
                    />
                    <span>{t("reservation.ruleNoDeposit")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <img
                      src={SpeedIcon}
                      alt="Speed limit"
                      className="w-7 h-7"
                    />
                    <span>{t("reservation.ruleSpeed")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <img
                      src={AggressiveIcon}
                      alt="No aggressive driving"
                      className="w-7 h-7"
                    />
                    <span>{t("reservation.ruleNoAggressive")}</span>
                  </div>
                </div>
              </div>

              {/* Карта постоянного клиента */}
              <div className="mb-3">
                <div className="text-xl font-bold text-center mb-2 text-yellow-400">
                  {t("reservation.clientCardTitle")}
                </div>
                <div className="flex flex-col gap-2 bg-zinc-900 rounded-xl p-4 border border-yellow-400">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span>{t("reservation.goldCard")}</span>
                    <Checkbox
                      checked={!!wizardData.goldCard}
                      onCheckedChange={(checked) =>
                        setWizardData((d) => ({ ...d, goldCard: !!checked }))
                      }
                      className="data-[state=checked]:bg-yellow-400 border-yellow-400"
                    />
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span>{t("reservation.clubCard")}</span>
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
                  {t("reservation.costTitle")}
                </div>
                <div className="bg-zinc-900 rounded-xl p-4 flex flex-col gap-2 text-white border border-yellow-400">
                  <div className="flex justify-between">
                    <span>{t("reservation.duration")}</span>{" "}
                    <span>
                      {calculateDays()} {t("reservation.days")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("reservation.wash")}</span> <span>20 €</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>{t("reservation.rentCost")}</span>{" "}
                    <span>{totalPrice} €</span>
                  </div>
                </div>
              </div>

              {/* Индикатор шага перед кнопкой */}
              <div className="w-full flex justify-center mb-2 mt-2">
                <span className="text-sm font-semibold text-yellow-400 bg-black/30 rounded px-3 py-1">
                  {t("reservation.step")} {stepIndicator}
                </span>
              </div>
              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-lg font-bold py-3 rounded-xl"
                onClick={goNext}
              >
                {t("reservation.next")}
              </Button>
              <Button
                className="w-full mt-2 bg-black text-yellow-400 border-yellow-400 border-2 text-lg font-bold py-3 rounded-xl"
                variant="outline"
                onClick={goBack}
              >
                {t("reservation.back")}
              </Button>
            </div>
          )}
          {currentStep === 2 && (
            <form
              className="w-full max-w-md sm:max-w-full mx-auto flex flex-col gap-1 pb-4"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              {/* Заголовок */}
              <div className="text-2xl font-bold mb-4 text-white text-center">
                {t("reservation.step3Title")}
              </div>

              {/* Всего и стоимость */}
              <div className="flex justify-between items-center border-b border-yellow-400 pb-2 mb-2">
                <div>
                  <div className="text-lg font-bold text-yellow-400">
                    {t("reservation.total")}
                  </div>
                  <div className="text-sm text-gray-300">
                    {t("reservation.totalCost")}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">
                  {totalPrice + 20} €
                </div>
              </div>

              {/* Имя */}
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-yellow-400 font-bold"
                >
                  {t("reservation.firstName")}
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder={t("reservation.firstName")}
                  className="bg-zinc-800 text-white border-none mt-1"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Фамилия */}
              <div>
                <Label htmlFor="lastName" className="text-yellow-400 font-bold">
                  {t("reservation.lastName")}
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder={t("reservation.lastName")}
                  className="bg-zinc-800 text-white border-none mt-1"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-yellow-400 font-bold">
                  {t("reservation.email")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("reservation.email")}
                  className="bg-zinc-800 text-white border-none mt-1"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* IDNP */}
              <div>
                <Label htmlFor="idnp" className="text-yellow-400 font-bold">
                  {t("reservation.idnp")}
                </Label>
                <Input
                  id="idnp"
                  name="idnp"
                  placeholder={t("reservation.idnp")}
                  className="bg-zinc-800 text-white border-none mt-1"
                  value={formData.idnp || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Фото удостоверения */}
              <div>
                <Label className="text-yellow-400 font-bold">
                  {t("reservation.idPhotos")}
                </Label>
                <div className="flex gap-4 mt-2">
                  {/* Фронт */}
                  <div className="flex flex-col items-center gap-1">
                    <label
                      className={`relative flex flex-col items-center justify-center w-28 h-28 bg-zinc-900 border-2 border-dashed rounded-lg cursor-pointer hover:bg-zinc-800 transition group ${
                        uploadedPhotos.front
                          ? "border-green-400"
                          : "border-yellow-400"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        name="idPhotoFront"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        required
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadedPhotos((prev) => ({
                              ...prev,
                              front: true,
                            }));
                          }
                        }}
                      />
                      {/* Иконка */}
                      {uploadedPhotos.front ? (
                        <span className="flex flex-col items-center justify-center z-0">
                          <svg
                            width="36"
                            height="36"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="text-green-400 mb-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-xs text-green-400">
                            {t("reservation.uploaded")}
                          </span>
                        </span>
                      ) : (
                        <span className="flex flex-col items-center justify-center z-0">
                          <svg
                            width="36"
                            height="36"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="text-yellow-400 mb-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <span className="text-xs text-gray-400">
                            {t("reservation.upload")}
                          </span>
                        </span>
                      )}
                      {/* Пример */}
                      <img
                        src={PasportFront}
                        alt={t("reservation.frontExample")}
                        className="absolute bottom-1 left-1 w-16 h-12 object-cover rounded shadow border border-gray-700 bg-black"
                      />
                    </label>
                    <span className="text-xs text-gray-400 mt-1">
                      {t("reservation.frontExample")}
                    </span>
                  </div>
                  {/* Бэк */}
                  <div className="flex flex-col items-center gap-1">
                    <label
                      className={`relative flex flex-col items-center justify-center w-28 h-28 bg-zinc-900 border-2 border-dashed rounded-lg cursor-pointer hover:bg-zinc-800 transition group ${
                        uploadedPhotos.back
                          ? "border-green-400"
                          : "border-yellow-400"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        name="idPhotoBack"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        required
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadedPhotos((prev) => ({
                              ...prev,
                              back: true,
                            }));
                          }
                        }}
                      />
                      {/* Иконка */}
                      {uploadedPhotos.back ? (
                        <span className="flex flex-col items-center justify-center z-0">
                          <svg
                            width="36"
                            height="36"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="text-green-400 mb-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-xs text-green-400">
                            {t("reservation.uploaded")}
                          </span>
                        </span>
                      ) : (
                        <span className="flex flex-col items-center justify-center z-0">
                          <svg
                            width="36"
                            height="36"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="text-yellow-400 mb-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <span className="text-xs text-gray-400">
                            {t("reservation.upload")}
                          </span>
                        </span>
                      )}
                      {/* Пример */}
                      <img
                        src={PasportBack}
                        alt={t("reservation.backExample")}
                        className="absolute bottom-1 left-1 w-16 h-12 object-cover rounded shadow border border-gray-700 bg-black"
                      />
                    </label>
                    <span className="text-xs text-gray-400 mt-1">
                      {t("reservation.backExample")}
                    </span>
                  </div>
                </div>
              </div>
              {/* Телефон с регионом */}
              <div>
                <Label htmlFor="phone" className="text-yellow-400 font-bold">
                  {t("reservation.phone")}
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Select
                    value={selectedCountryCode}
                    onValueChange={setSelectedCountryCode}
                  >
                    <SelectTrigger className="w-40 bg-zinc-800 text-white border-none hover:bg-zinc-700">
                      <SelectValue>
                        <span className="flex items-center gap-2">
                          <span>
                            {
                              countries.find(
                                (c) => c.code === selectedCountryCode
                              )?.flag
                            }
                          </span>
                          <span>{selectedCountryCode}</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 z-[3001] max-h-60">
                      {countries.map((country) => (
                        <SelectItem
                          key={country.code}
                          value={country.code}
                          className="text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
                            <span className="text-gray-400 text-sm">
                              {country.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="___ ___ ___"
                    className="bg-zinc-800 text-white border-none flex-1"
                    value={formData.phone.replace(
                      new RegExp(`^\\${selectedCountryCode}`),
                      ""
                    )}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone:
                          selectedCountryCode +
                          e.target.value.replace(/\D/g, ""),
                      })
                    }
                    pattern="[0-9]{7,12}"
                    required
                  />
                </div>
              </div>
              {/* Чекбокс согласия */}
              <div className="flex items-start gap-2 mt-2">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={(checked) => setPrivacyAccepted(!!checked)}
                  required
                  className="mt-1 border-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                />
                <label
                  htmlFor="privacy"
                  className="text-white text-sm select-none"
                >
                  {t("reservation.privacyPolicy")}{" "}
                  <a
                    href="/privacy-policy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 underline ml-1"
                  >
                    {t("reservation.privacyPolicyLink")}
                  </a>
                  .
                </label>
              </div>

              {/* Индикатор шага перед кнопкой */}
              <div className="w-full flex justify-center mb-2 mt-2">
                <span className="text-sm font-semibold text-yellow-400 bg-black/30 rounded px-3 py-1">
                  {t("reservation.step")} {stepIndicator}
                </span>
              </div>

              {/* Кнопка */}
              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-black text-lg font-bold py-3 rounded-xl"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>{t("reservation.submitting")}</span>
                  </div>
                ) : (
                  t("reservation.book")
                )}
              </Button>
              <Button
                className="w-full mt-2 bg-black text-yellow-400 border-yellow-400 border-2 text-lg font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                variant="outline"
                onClick={goBack}
                disabled={isSubmitting}
              >
                {t("reservation.back")}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarReservationModal;

// Стили для календаря
const calendarStyles = `
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
`;

// Добавляем стили в head
if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("calendar-styles");
  if (!existingStyle) {
    const styleElement = document.createElement("style");
    styleElement.id = "calendar-styles";
    styleElement.textContent = calendarStyles;
    document.head.appendChild(styleElement);
  }
}

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

  const [offset, setOffset] = useState(0); // Смещение в пикселях
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState<
    "horizontal" | "vertical" | null
  >(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const itemWidth = 120; // Ширина одного элемента
  const totalWidth = items.length * itemWidth;
  const swipeThreshold = 30; // Минимальное расстояние для срабатывания свайпа
  const directionThreshold = 15; // Порог для определения направления

  // Нормализация offset для бесконечной прокрутки
  const normalizeOffset = useCallback(
    (off: number) => {
      const mod = off % totalWidth;
      return mod < 0 ? mod + totalWidth : mod;
    },
    [totalWidth]
  );

  // Получение активного индекса на основе offset
  const getActiveIndex = useCallback(() => {
    const normalizedOffset = normalizeOffset(offset);
    return Math.round(normalizedOffset / itemWidth) % items.length;
  }, [offset, normalizeOffset, itemWidth, items.length]);

  // Touch handlers с полной блокировкой вертикального скролла
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setDragCurrent({ x: touch.clientX, y: touch.clientY });
    setSwipeDirection(null);
    setIsAnimating(false);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;

      // Определяем направление свайпа только один раз
      if (
        swipeDirection === null &&
        (Math.abs(deltaX) > directionThreshold ||
          Math.abs(deltaY) > directionThreshold)
      ) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          setSwipeDirection("horizontal");
        } else {
          setSwipeDirection("vertical");
        }
      }

      // Если определили горизонтальный свайп - блокируем вертикальный скролл
      if (swipeDirection === "horizontal") {
        e.preventDefault();
        e.stopPropagation();
        setDragCurrent({ x: touch.clientX, y: touch.clientY });

        // Ограниченная визуальная обратная связь (максимум 30% от ширины элемента)
        const maxVisualOffset = itemWidth * 0.3;
        const limitedDelta = Math.max(
          -maxVisualOffset,
          Math.min(maxVisualOffset, deltaX)
        );

        const normalizedOffset = normalizeOffset(offset);
        const baseIndex = Math.round(normalizedOffset / itemWidth);
        const baseOffset = baseIndex * itemWidth;
        setOffset(baseOffset - limitedDelta);
      }

      // Если вертикальный свайп - НЕ блокируем, позволяем странице скроллиться
    },
    [
      isDragging,
      dragStart,
      swipeDirection,
      directionThreshold,
      itemWidth,
      normalizeOffset,
      offset,
    ]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      // Обрабатываем только горизонтальные свайпы
      if (swipeDirection === "horizontal") {
        const deltaX = dragCurrent.x - dragStart.x;
        const normalizedOffset = normalizeOffset(offset);
        const currentIndex = Math.round(normalizedOffset / itemWidth);
        let targetIndex = currentIndex;

        // Определяем направление и переходим на 1 шаг
        if (Math.abs(deltaX) > swipeThreshold) {
          if (deltaX > 0) {
            // Свайп вправо - предыдущий элемент
            targetIndex = currentIndex - 1;
          } else {
            // Свайп влево - следующий элемент
            targetIndex = currentIndex + 1;
          }
        }

        // Нормализуем индекс
        targetIndex =
          ((targetIndex % items.length) + items.length) % items.length;
        const targetOffset = targetIndex * itemWidth;

        setIsAnimating(true);
        setOffset(targetOffset);
        setTimeout(() => setIsAnimating(false), 250);
      } else {
        // Если не горизонтальный свайп - возвращаем к исходной позиции
        const normalizedOffset = normalizeOffset(offset);
        const currentIndex = Math.round(normalizedOffset / itemWidth);
        const targetOffset = currentIndex * itemWidth;
        setOffset(targetOffset);
      }

      setSwipeDirection(null);
    },
    [
      isDragging,
      swipeDirection,
      dragCurrent,
      dragStart,
      swipeThreshold,
      normalizeOffset,
      offset,
      itemWidth,
      items.length,
    ]
  );

  // Mouse handlers (аналогично touch, но без учета вертикального скролла)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragCurrent({ x: e.clientX, y: e.clientY });
    setSwipeDirection("horizontal"); // Для мыши всегда горизонтально
    setIsAnimating(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || swipeDirection !== "horizontal") return;

      const deltaX = e.clientX - dragStart.x;
      setDragCurrent({ x: e.clientX, y: e.clientY });

      // Ограниченная визуальная обратная связь
      const maxVisualOffset = itemWidth * 0.3;
      const limitedDelta = Math.max(
        -maxVisualOffset,
        Math.min(maxVisualOffset, deltaX)
      );

      const normalizedOffset = normalizeOffset(offset);
      const baseIndex = Math.round(normalizedOffset / itemWidth);
      const baseOffset = baseIndex * itemWidth;
      setOffset(baseOffset - limitedDelta);
    },
    [isDragging, swipeDirection, dragStart, itemWidth, normalizeOffset, offset]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (swipeDirection === "horizontal") {
      const deltaX = dragCurrent.x - dragStart.x;
      const normalizedOffset = normalizeOffset(offset);
      const currentIndex = Math.round(normalizedOffset / itemWidth);
      let targetIndex = currentIndex;

      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          targetIndex = currentIndex - 1;
        } else {
          targetIndex = currentIndex + 1;
        }
      }

      targetIndex =
        ((targetIndex % items.length) + items.length) % items.length;
      const targetOffset = targetIndex * itemWidth;

      setIsAnimating(true);
      setOffset(targetOffset);
      setTimeout(() => setIsAnimating(false), 250);
    }

    setSwipeDirection(null);
  }, [
    isDragging,
    swipeDirection,
    dragCurrent,
    dragStart,
    swipeThreshold,
    normalizeOffset,
    offset,
    itemWidth,
    items.length,
  ]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleMouseUp();
    }
  }, [isDragging, handleMouseUp]);

  // Кнопки навигации с плавной анимацией
  const prev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOffset((prev) => prev - itemWidth); // Исправлено: двигаем влево
    setTimeout(() => setIsAnimating(false), 250);
  }, [itemWidth, isAnimating]);

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOffset((prev) => prev + itemWidth); // Исправлено: двигаем вправо
    setTimeout(() => setIsAnimating(false), 250);
  }, [itemWidth, isAnimating]);

  // Оптимизированный рендер элементов
  const renderItems = useMemo(() => {
    const normalizedOffset = normalizeOffset(offset);
    const elements = [];

    // Рендерим только видимые элементы + буфер
    const visibleRange = visibleCount + 2;
    for (let i = -visibleRange; i <= visibleRange; i++) {
      const itemIndex = (i + items.length * 10) % items.length;
      const item = items[itemIndex];
      const itemPosition = i * itemWidth - normalizedOffset;

      // Пропускаем элементы, которые слишком далеко
      if (Math.abs(itemPosition) > itemWidth * 3) continue;

      // Оптимизированные вычисления близости
      const distanceFromCenter = Math.abs(itemPosition) / (itemWidth * 1.2);
      const proximity = Math.max(0, Math.min(1, 1 - distanceFromCenter));

      // Более простые интерполяции
      const scale = 0.85 + proximity * 0.3;
      const opacity = 0.5 + proximity * 0.5;
      const fontSize = 15 + proximity * 6;

      // Упрощенная логика цвета
      const isCenter = proximity > 0.6;
      const bgOpacity = isCenter ? proximity * 0.9 : 0.7;
      const bgColor = isCenter
        ? `rgba(250, 204, 21, ${bgOpacity})`
        : `rgba(63, 63, 70, ${bgOpacity})`;

      const textColor = isCenter ? "#000" : "#fff";

      elements.push(
        <div
          key={`${itemIndex}-${i}`}
          className={`absolute flex flex-col items-center justify-center rounded-lg px-2 py-2 cursor-pointer select-none will-change-transform ${
            isDragging
              ? ""
              : isAnimating
              ? "transition-all duration-400 ease-out"
              : "transition-all duration-300 ease-out"
          }`}
          style={{
            left: `calc(50% + ${itemPosition}px)`,
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "center center",
            opacity,
            backgroundColor: bgColor,
            color: textColor,
            width: `${itemWidth - 10}px`,
            height: "80px",
            zIndex: Math.round(proximity * 10),
            boxShadow: isCenter
              ? "0 4px 12px rgba(250, 204, 21, 0.25)"
              : "none",
            position: "absolute",
            top: "50%",
            marginTop: "-40px", // Половина высоты элемента для центрирования
            pointerEvents: isDragging ? "none" : "auto",
            backfaceVisibility: "hidden",
            perspective: "1000px",
          }}
          onClick={() => {
            if (isAnimating || isDragging) return;
            setIsAnimating(true);
            setOffset(i * itemWidth);
            setTimeout(() => setIsAnimating(false), 250);
          }}
        >
          <div className="text-xs mb-1 opacity-70">{item.label}</div>
          <div
            className="font-bold text-center"
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: isCenter ? 700 : 500,
            }}
          >
            {item.value}
            {valueSuffix ? ` ${valueSuffix}` : ""}
          </div>
        </div>
      );
    }

    return elements;
  }, [
    offset,
    normalizeOffset,
    itemWidth,
    items,
    visibleCount,
    isDragging,
    isAnimating,
    valueSuffix,
  ]);

  return (
    <div className="w-full max-w-full md:max-w-lg mx-auto relative">
      <h3 className="text-xl font-bold text-center mb-4 text-white">{title}</h3>

      {/* Кнопки навигации */}
      <button
        onClick={prev}
        disabled={isAnimating}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 rounded-full text-yellow-400 hover:bg-yellow-500 transition-all duration-200 disabled:opacity-50"
      >
        &#8592;
      </button>
      <button
        onClick={next}
        disabled={isAnimating}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 rounded-full text-yellow-400 hover:bg-yellow-500 transition-all duration-200 disabled:opacity-50"
      >
        &#8594;
      </button>

      {/* Невидимая лупа - только для понимания центра */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-16 pointer-events-none z-5"
        style={{
          background:
            "radial-gradient(ellipse, rgba(250, 204, 21, 0.02) 40%, transparent 70%)",
        }}
      />

      {/* Контейнер элементов */}
      <div
        ref={containerRef}
        className="relative h-24 overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={
          {
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "pan-x",
            WebkitTouchCallout: "none",
            overscrollBehavior: "contain",
            overscrollBehaviorX: "none",
            overscrollBehaviorY: "auto",
          } as React.CSSProperties
        }
      >
        {renderItems}
      </div>

      {/* Точки навигации */}
      <div className="flex justify-center gap-1 mt-3">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setOffset(idx * itemWidth);
              setTimeout(() => setIsAnimating(false), 250);
            }}
            disabled={isAnimating}
            className={`h-2 w-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 disabled:cursor-default ${
              getActiveIndex() === idx
                ? "bg-yellow-400 scale-125 shadow-md shadow-yellow-400/50"
                : "bg-gray-600 scale-100 opacity-70 hover:opacity-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
