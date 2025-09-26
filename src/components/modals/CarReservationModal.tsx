import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/utils/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/overlays/dialog";
import { useTranslation } from "react-i18next";
import { createOrder, fetchOrders, Timestamp } from "@/lib/firestore";
import { uploadFileToFirebase } from "@/lib/firebase";
import { useMediaQuery } from "@/hooks";
import { useCarReservation } from "@/hooks/use-car-reservation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/utils/use-toast";

// Импорт новых компонентов
import { ReservationStep1 } from "./ReservationStep1";
import { ReservationStep2 } from "./ReservationStep2";
import { ReservationStep3 } from "./ReservationStep3";
import { SuccessModal } from "./SuccessModal";
import {
  Car as BaseCar,
  FormData as ReservationFormData,
  WizardData,
  PassportFiles,
  PassportUrls,
} from "@/types/reservation";

// Используем интерфейс Car из types/reservation.ts который уже содержит carNumber
type Car = BaseCar;

interface CarReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
}

// Wizard steps
const STEPS = ["main", "summary", "personal"];

const CarReservationModal = ({
  isOpen,
  onClose,
  car,
}: CarReservationModalProps) => {
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Используем кэшированное состояние с изоляцией по машинам
  const {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    uploadedPhotos,
    setUploadedPhotos,
    passportFiles,
    setPassportFiles,
    passportUrls,
    setPassportUrls,
    privacyAccepted,
    setPrivacyAccepted,
    wizardData,
    setWizardData,
    selectedCountryCode,
    setSelectedCountryCode,
    activeImageIndex,
    setActiveImageIndex,
  } = useCarReservation(car.id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Функция для загрузки фото паспорта
  const uploadPassportPhotos = async (): Promise<{
    front: string;
    back: string;
  }> => {
    console.log("🔄 Начинаем загрузку фото паспорта:", passportFiles);

    const uploadPromises = [];

    if (passportFiles.front) {
      console.log("📤 Загружаем лицевую сторону:", passportFiles.front.name);
      uploadPromises.push(
        uploadFileToFirebase(passportFiles.front, "passport-front")
          .then((url) => {
            console.log("✅ Лицевая сторона загружена:", url);
            return { type: "front", url };
          })
          .catch((error) => {
            console.error("❌ Ошибка загрузки лицевой стороны:", error);
            return { type: "front", url: null };
          })
      );
    } else {
      console.log("⚠️ Лицевая сторона не выбрана");
      uploadPromises.push(Promise.resolve({ type: "front", url: null }));
    }

    if (passportFiles.back) {
      console.log("📤 Загружаем обратную сторону:", passportFiles.back.name);
      uploadPromises.push(
        uploadFileToFirebase(passportFiles.back, "passport-back")
          .then((url) => {
            console.log("✅ Обратная сторона загружена:", url);
            return { type: "back", url };
          })
          .catch((error) => {
            console.error("❌ Ошибка загрузки обратной стороны:", error);
            return { type: "back", url: null };
          })
      );
    } else {
      console.log("⚠️ Обратная сторона не выбрана");
      uploadPromises.push(Promise.resolve({ type: "back", url: null }));
    }

    const results = await Promise.all(uploadPromises);
    console.log("📋 Результаты загрузки:", results);

    const frontUrl =
      results.find((r) => r.type === "front")?.url ||
      "https://example.com/passport-front.jpg";
    const backUrl =
      results.find((r) => r.type === "back")?.url ||
      "https://example.com/passport-back.jpg";

    console.log("🔗 Финальные URL:", { front: frontUrl, back: backUrl });
    return { front: frontUrl, back: backUrl };
  };

  // Индикатор шагов
  const stepIndicator = `${currentStep + 1}/${STEPS.length}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Предотвращаем повторную отправку
    if (isSubmitting) return;

    // Валидация обязательных полей
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    ) {
      toast({
        title: "Неполная форма",
        description: "Пожалуйста, заполните все обязательные поля.",
        variant: "destructive",
      });
      return;
    }

    // Валидация телефона
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 9) {
      toast({
        title: "Неверный номер телефона",
        description: "Пожалуйста, введите корректный номер телефона.",
        variant: "destructive",
      });
      return;
    }

    // Валидация IDNP
    if (!formData.idnp || formData.idnp.length !== 13) {
      toast({
        title: "Неверный IDNP",
        description: "IDNP должен содержать 13 цифр.",
        variant: "destructive",
      });
      return;
    }

    // Валидация согласия с политикой
    if (!privacyAccepted) {
      toast({
        title: "Согласие обязательно",
        description: "Необходимо согласиться с политикой конфиденциальности.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const form = e.target as HTMLFormElement;
    const formDataObj = new globalThis.FormData(form);

    try {
      // Загружаем фото паспорта в Firebase Storage
      const documents = await uploadPassportPhotos();

      await createOrder({
        carId: car.id,
        carName: car.name,
        carNumber: car.carNumber,
        customerName: formData.firstName + " " + formData.lastName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerPassport: formData.idnp,
        rentFrom: Timestamp.fromDate(new Date(formData.pickupDate)),
        rentTo: Timestamp.fromDate(new Date(formData.returnDate)),
        totalDays: calculateDays(),
        totalPrice: finalRentalCost,
        status: "pending",
        documents: {
          front: documents.front,
          back: documents.back,
        },
        // Новые поля для расширенной функциональности
        pickupTime: formData.pickupTime,
        paymentMethod: formData.paymentMethod,
        paymentMessage: formData.paymentMessage || "",
        pickupType: formData.pickupType,
        deliveryType: formData.pickupType === "address" ? "delivery" : "pickup",
        deliveryAddress: formData.pickupAddress,
        unlimitedMileage: formData.unlimitedMileage,
        clubCard: formData.clubCard,
        goldCard: formData.goldCard,
        doubleKmAmount: formData.doubleKmAmount || 0,
        discountAmount: formData.discountAmount || 0,
        deliveryAmount: formData.deliveryAmount || 0,
        servedBy: formData.servedBy || "",
      });

      // Показываем модальное окно успеха
      setShowSuccessModal(true);
      setIsSubmitting(false);
    } catch (e) {
      console.error("Ошибка отправки заявки:", e);

      // Дополнительная обработка ошибок для мобильных
      if (isMobile) {
        // Проверяем тип ошибки
        const errorMessage = e instanceof Error ? e.message : String(e);

        if (
          errorMessage.includes("network") ||
          errorMessage.includes("fetch")
        ) {
          toast({
            title: "Проблема с сетью",
            description:
              "Проверьте подключение к интернету и попробуйте снова.",
            variant: "destructive",
          });
        } else if (
          errorMessage.includes("storage") ||
          errorMessage.includes("cache")
        ) {
          toast({
            title: "Проблема с данными",
            description: "Попробуйте очистить кэш браузера и повторить.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Ошибка отправки",
            description: "Попробуйте еще раз или свяжитесь с нами по телефону.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Ошибка отправки",
          description:
            "Произошла ошибка при отправке заявки. Попробуйте еще раз.",
          variant: "destructive",
        });
      }

      setIsSubmitting(false);
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
    return car.price;
  };
  const pricePerDay = getPricePerDay(days);
  const totalPrice = pricePerDay * days;

  // Функция для расчета скидки по карте
  const calculateDiscount = (basePrice: number) => {
    if (wizardData.goldCard) {
      return basePrice * 0.25; // 25% скидка для Gold карты
    } else if (wizardData.clubCard) {
      return basePrice * 0.1; // 10% скидка для Club карты
    }
    return 0; // Нет скидки
  };

  // Расчет стоимости с учетом скидки
  // Скидка применяется только к базовой стоимости аренды, не к дополнительным услугам
  const discount = calculateDiscount(totalPrice); // Скидка только к стоимости аренды
  const rentalCostWithDiscount = totalPrice - discount; // Стоимость аренды со скидкой
  const unlimitedMileageCost = wizardData.unlimitedMileage
    ? calculateDays() * 20
    : 0; // Стоимость безлимитного километража
  const deliveryCost =
    wizardData.pickupType === "address" || wizardData.pickupType === "airport"
      ? 20
      : 0; // Стоимость доставки
  const additionalServices = unlimitedMileageCost + deliveryCost; // Все дополнительные услуги
  const washingCost = 20; // Стоимость мойки (фиксированная)
  const finalRentalCost =
    rentalCostWithDiscount + additionalServices + washingCost; // Итоговая стоимость

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
        // Проверка длины телефона (ровно 9 цифр после кода страны)
        const phoneDigits = formData.phone
          .replace(/\D/g, "")
          .replace(selectedCountryCode.replace(/\D/g, ""), "");
        if (phoneDigits.length !== 9) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.phoneInvalid",
              "Номер телефона должен содержать ровно 9 цифр (0 + код оператора + номер)"
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
        // Проверка IDNP (должен содержать ровно 13 цифр)
        const idnpDigits = formData.idnp.replace(/\D/g, "");
        if (idnpDigits.length !== 13) {
          toast({
            title: t("validation.error", "Ошибка валидации"),
            description: t(
              "validation.idnpInvalid",
              "IDNP должен содержать ровно 13 цифр"
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
      pickupDate: wizardData.pickupDate || "",
      returnDate: wizardData.returnDate || "",
      pickupTime: wizardData.pickupTime || "10:00",
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

  // Функция для закрытия модального окна успеха
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  // Сброс состояния при закрытии модала
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsSubmitting(false);
      setPrivacyAccepted(false);
      setUploadedPhotos({ front: false, back: false });
      setShowSuccessModal(false);
    }
  }, [isOpen, setCurrentStep, setPrivacyAccepted, setUploadedPhotos]);

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", i18n.language],
    queryFn: fetchOrders,
    staleTime: 0, // Убираем кэширование
  });
  // Получаем только заявки по этой машине и только подтверждённые
  const carOrders = orders.filter((order) => {
    const hasCarId = order.carId === car.id;
    const isConfirmed = order.status === "confirmed";
    const hasDates = order.rentFrom && order.rentTo;

    return hasCarId && isConfirmed && hasDates;
  });
  // Универсальный парсер дат
  function parseDate(str: string) {
    try {
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
    } catch (error) {
      console.error("❌ Ошибка в parseDate:", error, "для строки:", str);
      return null;
    }
  }

  // Генерируем массив занятых дат (только дата, без времени, с универсальным парсером)
  const disabledDays: Date[] = [];

  try {
    // Если автомобиль на обслуживании - блокируем все даты
    if (car.status && car.status.toLowerCase() === "на обслуживании") {
      // Генерируем все даты на ближайшие 1 года (365 дней)
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        disabledDays.push(
          new Date(date.getFullYear(), date.getMonth(), date.getDate())
        );
      }
    } else {
      // Добавляем даты из заказов только если автомобиль не на обслуживании
      carOrders.forEach((order) => {
        try {
          const start = order.rentFrom.toDate();
          const end = order.rentTo.toDate();
          if (!start || !end) return;
          for (
            let d = new Date(
              start.getFullYear(),
              start.getMonth(),
              start.getDate()
            );
            d <= end;
            d.setDate(d.getDate() + 1)
          ) {
            disabledDays.push(
              new Date(d.getFullYear(), d.getMonth(), d.getDate())
            );
          }
        } catch (error) {
          console.error("❌ Ошибка при обработке заказа:", error, order);
        }
      });
    }
  } catch (error) {
    console.error("❌ Ошибка при генерации disabledDays:", error);
  }

  // Добавляем даты блокировки администратора (только если автомобиль не на обслуживании)
  try {
    if (!car.status || car.status.toLowerCase() !== "на обслуживании") {
      if (car.blockFromDate && car.blockToDate) {
        const blockStart = parseDate(car.blockFromDate);
        const blockEnd = parseDate(car.blockToDate);
        if (blockStart && blockEnd) {
          for (
            let d = new Date(
              blockStart.getFullYear(),
              blockStart.getMonth(),
              blockStart.getDate()
            );
            d <= blockEnd;
            d.setDate(d.getDate() + 1)
          ) {
            const disabledDay = new Date(
              d.getFullYear(),
              d.getMonth(),
              d.getDate()
            );
            // Проверяем, что дата еще не добавлена
            const isAlreadyDisabled = disabledDays.some(
              (existingDate) =>
                existingDate.getFullYear() === disabledDay.getFullYear() &&
                existingDate.getMonth() === disabledDay.getMonth() &&
                existingDate.getDate() === disabledDay.getDate()
            );
            if (!isAlreadyDisabled) {
              disabledDays.push(disabledDay);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Ошибка при обработке блокировки администратора:", error);
  }

  return (
    <>
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
            className={`absolute top-3 right-3 z-[3001] text-3xl text-[#ffffff] hover:text-[#686868] transition md:top-4 md:right-4 bg-black/20 rounded-full p-1 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label={t("reservation.cancel")}
            disabled={isSubmitting}
          >
            <X size={24} />
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
              <ReservationStep1
                car={car}
                formData={formData}
                setFormData={setFormData}
                wizardData={wizardData}
                setWizardData={setWizardData}
                currentStep={currentStep}
                stepIndicator={stepIndicator}
                disabledDays={disabledDays}
                goNext={goNext}
                goBack={goBack}
                i18n={i18n}
              />
            )}
            {currentStep === 1 && (
              <ReservationStep2
                car={car}
                formData={formData}
                wizardData={wizardData}
                setWizardData={setWizardData}
                currentStep={currentStep}
                stepIndicator={stepIndicator}
                calculateDays={calculateDays}
                totalPrice={totalPrice}
                discount={discount}
                finalRentalCost={finalRentalCost}
                goNext={goNext}
                goBack={goBack}
                i18n={i18n}
              />
            )}
            {currentStep === 2 && (
              <ReservationStep3
                car={car}
                formData={formData}
                setFormData={setFormData}
                uploadedPhotos={uploadedPhotos}
                setUploadedPhotos={setUploadedPhotos}
                passportFiles={passportFiles}
                setPassportFiles={setPassportFiles}
                passportUrls={passportUrls}
                setPassportUrls={setPassportUrls}
                privacyAccepted={privacyAccepted}
                setPrivacyAccepted={setPrivacyAccepted}
                selectedCountryCode={selectedCountryCode}
                setSelectedCountryCode={setSelectedCountryCode}
                currentStep={currentStep}
                stepIndicator={stepIndicator}
                finalRentalCost={finalRentalCost}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                goBack={goBack}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно успешного оформления заявки */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        car={car}
      />
    </>
  );
};

export { CarReservationModal };
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
