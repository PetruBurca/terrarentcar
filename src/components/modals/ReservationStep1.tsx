import React, { useRef } from "react";
import { Button } from "@/components/ui/utils/button";
import { Input } from "@/components/ui/inputs/input";
import { Switch } from "@/components/ui/forms/switch";
import { RadioGroup } from "@/components/ui/forms/radio-group";
import { Calendar as ShadcnCalendar } from "@/components/ui/data-display/calendar";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/utils/use-toast";
import { translateCarSpec } from "@/lib/carTranslations";
import { formatDateRange } from "@/lib/dateHelpers";
import logo from "@/assets/logo.webp";
import TimePicker from "@/components/ui/inputs/time-picker-wheel";
import { CarouselWithCenter } from "@/components/modals/CarouselWithCenter";
import { Car, FormData, WizardData } from "@/types/reservation";

interface ReservationStep1Props {
  car: Car;
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  wizardData: WizardData;
  setWizardData: (
    data: WizardData | ((prev: WizardData) => WizardData)
  ) => void;
  currentStep: number;
  stepIndicator: string;
  disabledDays: Date[];
  goNext: () => void;
  goBack: () => void;
  i18n: {
    language: string;
  };
}

export const ReservationStep1: React.FC<ReservationStep1Props> = ({
  car,
  formData,
  setFormData,
  wizardData,
  setWizardData,
  currentStep,
  stepIndicator,
  disabledDays,
  goNext,
  goBack,
  i18n,
}) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [showDescription, setShowDescription] = React.useState(false);
  const thumbnailCarouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [startIndex, setStartIndex] = React.useState(0);
  const images = React.useMemo(
    () => (Array.isArray(car.images) ? car.images : []),
    [car.images]
  );

  const getOptimizedImageUrl = React.useCallback((url: string) => {
    if (!url || url.includes("placeholder") || !url.startsWith("http")) {
      return url;
    }

    if (url.includes("firebasestorage.googleapis.com")) {
      const params = new URLSearchParams();
      params.set("w", "900");
      params.set("h", "auto");
      params.set("q", "90");
      params.set("f", "webp");
      params.set("alt", "media");

      const [base] = url.split("?");
      return `${base}?${params.toString()}`;
    }

    return url;
  }, []);

  const optimizedImages = React.useMemo(
    () => images.map((img) => getOptimizedImageUrl(img)),
    [images, getOptimizedImageUrl]
  );

  React.useEffect(() => {
    optimizedImages.forEach((img) => {
      if (!img) return;
      const image = new Image();
      image.src = img;
      if (image.decode) {
        image.decode().catch(() => {
          /* ignore */
        });
      }
    });
  }, [optimizedImages]);

  const [loadedImages, setLoadedImages] = React.useState<
    Record<number, boolean>
  >({});

  React.useEffect(() => {
    setLoadedImages({});
  }, [optimizedImages]);

  const markLoaded = React.useCallback((index: number) => {
    setLoadedImages((prev) => {
      if (prev[index]) {
        return prev;
      }
      return { ...prev, [index]: true };
    });
  }, []);

  const handlePrev = () =>
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  const handleNext = () =>
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));

  // Обработчики свайпов для карусели миниатюр
  const handleThumbnailTouchStart = (
    e: React.TouchEvent | React.MouseEvent
  ) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchStart(clientX);
    setTouchEnd(clientX);
    setDragOffset(0);
    setStartIndex(activeIndex);
    setIsDragging(true);
  };

  const handleThumbnailTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchEnd(clientX);

    // Вычисляем смещение для плавного перетаскивания
    const offset = clientX - touchStart;
    setDragOffset(offset);
  };

  const handleThumbnailTouchEnd = () => {
    if (!isDragging) return;

    const distance = touchStart - touchEnd;
    const threshold = 30; // Уменьшили порог для более чувствительного свайпа
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }

    // Сбрасываем значения
    setTouchStart(0);
    setTouchEnd(0);
    setDragOffset(0);
    setIsDragging(false);
  };

  const description = car.description || "";

  // Преобразование даты в локальный формат YYYY-MM-DD
  const toLocalDateString = (date: Date | undefined) =>
    date
      ? `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
      : "";

  // Используем wizardData для отображения выбранных дат
  const pickupDate = wizardData.pickupDate || formData.pickupDate;
  const returnDate = wizardData.returnDate || formData.returnDate;

  const selected = (() => {
    // Проверяем, есть ли выбранные даты
    const hasPickupDate = pickupDate && pickupDate.trim() !== "";
    const hasReturnDate = returnDate && returnDate.trim() !== "";

    if (!hasPickupDate && !hasReturnDate) {
      return undefined;
    }

    // Проверяем, не являются ли выбранные даты disabled
    const isPickupDisabled =
      hasPickupDate &&
      disabledDays.some(
        (dd) =>
          dd.getFullYear() === new Date(pickupDate).getFullYear() &&
          dd.getMonth() === new Date(pickupDate).getMonth() &&
          dd.getDate() === new Date(pickupDate).getDate()
      );

    const isReturnDisabled =
      hasReturnDate &&
      disabledDays.some(
        (dd) =>
          dd.getFullYear() === new Date(returnDate).getFullYear() &&
          dd.getMonth() === new Date(returnDate).getMonth() &&
          dd.getDate() === new Date(returnDate).getDate()
      );

    if (isPickupDisabled || isReturnDisabled) {
      return undefined;
    }

    return {
      from: hasPickupDate ? new Date(pickupDate) : undefined,
      to: hasReturnDate ? new Date(returnDate) : undefined,
    };
  })();

  // Определяем месяц по умолчанию для календаря
  const defaultMonth = pickupDate
    ? new Date(pickupDate)
    : returnDate
    ? new Date(returnDate)
    : new Date();

  return (
    <div className="flex flex-col items-center gap-1 pb-4 overflow-x-hidden">
      {/* Фото (carousel) */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-2 text-white">
          {car.name}
        </h2>
        {description && (
          <p className="text-sm text-gray-300 text-center mb-4 max-w-md px-4">
            {description}
          </p>
        )}
        <div
          className={`relative w-full max-w-lg mx-auto h-[250px] sm:h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden ${
            !car.images[activeIndex] || car.images[activeIndex] === logo
              ? "bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg"
              : "bg-black rounded-lg"
          }`}
        >
          {!loadedImages[activeIndex] && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/40 animate-pulse rounded-lg" />
          )}
          <img
            src={optimizedImages[activeIndex] || logo}
            alt={car.name}
            className={`transition-all duration-500 ${
              !car.images[activeIndex] || car.images[activeIndex] === logo
                ? "w-auto h-auto max-w-[250px] max-h-[200px] sm:max-w-[300px] sm:max-h-[250px] md:max-w-[400px] md:max-h-[320px] object-contain p-4 sm:p-6 md:p-8 rounded-lg"
                : "w-full h-full object-contain"
            }`}
            loading="eager" // Критическое изображение загружаем сразу
            decoding="async"
            fetchPriority="high"
            onLoad={() => markLoaded(activeIndex)}
            onError={() => markLoaded(activeIndex)}
            style={{
              objectPosition: "center center",
              minWidth: "100%",
              minHeight: "100%",
              opacity: loadedImages[activeIndex] ? 1 : 0,
              transition: "opacity 200ms ease-in-out",
            }}
          />
          {/* Стрелки */}
          {car.images && car.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white rounded-full p-2 sm:p-4 hover:bg-[#B90003] hover:text-white transition-all duration-300 hover:scale-110 shadow-lg border border-white/20"
                aria-label="Prev"
              >
                <svg
                  className="w-4 h-4 sm:w-6 sm:h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white rounded-full p-2 sm:p-4 hover:bg-[#B90003] hover:text-white transition-all duration-300 hover:scale-110 shadow-lg border border-white/20"
                aria-label="Next"
              >
                <svg
                  className="w-4 h-4 sm:w-6 sm:h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
        {/* Миниатюры - Карусель */}
        {car.images && car.images.length > 1 && (
          <div className="mt-4 py-4">
            {/* Контейнер с дополнительным пространством для стрелок */}
            <div className="relative w-full max-w-[360px] sm:max-w-[380px] mx-auto px-2 sm:px-4 md:px-8">
              {/* Видимая область карусели */}
              <div
                ref={thumbnailCarouselRef}
                className="relative overflow-hidden w-[260px] sm:w-[280px] mx-auto cursor-grab active:cursor-grabbing select-none"
                onTouchStart={handleThumbnailTouchStart}
                onTouchMove={handleThumbnailTouchMove}
                onTouchEnd={handleThumbnailTouchEnd}
                onMouseDown={handleThumbnailTouchStart}
                onMouseMove={handleThumbnailTouchMove}
                onMouseUp={handleThumbnailTouchEnd}
                onMouseLeave={handleThumbnailTouchEnd}
              >
                <div
                  className={`flex gap-2 transition-transform duration-300 ease-in-out ${
                    isDragging ? "transition-none" : ""
                  }`}
                  style={{
                    transform: `translateX(${
                      -Math.max(
                        0,
                        Math.min(activeIndex - 1, car.images.length - 1)
                      ) *
                        56 +
                      (isDragging ? dragOffset * 0.2 : 0)
                    }px)`,
                  }}
                >
                  {optimizedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 bg-black flex-shrink-0 p-0 m-0.5 ${
                        activeIndex === idx
                          ? "ring-2 ring-[#B90003]"
                          : "hover:ring-1 hover:ring-gray-500"
                      } ${isDragging ? "opacity-80" : ""}`}
                      onClick={() => !isDragging && setActiveIndex(idx)}
                    >
                      <img
                        src={img || logo}
                        alt={`thumb-${idx}`}
                        className="w-full h-full object-cover rounded-md transition-opacity duration-150"
                        loading="lazy"
                        decoding="async"
                        style={{
                          opacity: loadedImages[idx] ? 1 : 0,
                        }}
                        onLoad={() => markLoaded(idx)}
                        onError={() => markLoaded(idx)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Индикаторы прокрутки - вне внутреннего контейнера */}
              {car.images.length > 1 && (
                <>
                  {/* Левая стрелка */}
                  {activeIndex > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex(Math.max(0, activeIndex - 1))
                      }
                      className="absolute -left-5 sm:-left-7 top-1/2 -translate-y-1/2 bg-[#B90003] text-white rounded-full p-1.5 sm:p-2.5 hover:bg-[#A00002] transition-all duration-300 shadow-lg border border-white hover:scale-105 z-10 backdrop-blur-sm"
                      aria-label="Previous thumbnail"
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Правая стрелка */}
                  {activeIndex < car.images.length - 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex(
                          Math.min(car.images.length - 1, activeIndex + 1)
                        )
                      }
                      className="absolute -right-5 sm:-right-7 top-1/2 -translate-y-1/2 bg-[#B90003] text-white rounded-full p-1.5 sm:p-2.5 hover:bg-[#A00002] transition-all duration-300 shadow-lg border border-white hover:scale-105 z-10 backdrop-blur-sm"
                      aria-label="Next thumbnail"
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Индикатор позиции */}
            {car.images.length > 5 && (
              <div className="flex justify-center mt-2 gap-1">
                {Array.from({ length: Math.min(5, car.images.length) }).map(
                  (_, idx) => {
                    // Вычисляем активную позицию в видимой области карусели
                    let activePosition = 2; // По умолчанию центр (позиция 2)

                    if (activeIndex < 2) {
                      // Если активна одна из первых двух фотографий
                      activePosition = activeIndex;
                    } else if (activeIndex >= car.images.length - 2) {
                      // Если активна одна из последних двух фотографий
                      activePosition =
                        4 - (car.images.length - 1 - activeIndex);
                    }

                    const isActive = idx === activePosition;
                    return (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          isActive ? "bg-[#B90003]" : "bg-gray-500"
                        }`}
                      />
                    );
                  }
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Стоимость (carousel) */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <CarouselWithCenter
          items={[
            {
              label: t("reservation.pricePerDay"),
              value: car.price,
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
          colorCenter="bg-[#B90003] text-white"
          colorSide="bg-gray-800 text-white opacity-60"
          valueSuffix="€"
        />
      </div>

      {/* Характеристики (carousel) */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <CarouselWithCenter
          items={[
            {
              label: t("reservation.transmission"),
              value: translateCarSpec("transmission", car.transmission, t),
            },
            {
              label: t("reservation.fuel"),
              value: translateCarSpec("fuel", car.fuelType || "", t),
            },
            {
              label: t("reservation.rating"),
              value: car.rating,
            },
            {
              label: t("reservation.passengers"),
              value: car.seats,
            },
            {
              label: t("reservation.year"),
              value: car.year,
            },
          ]}
          title={t("reservation.featuresTitle")}
          colorCenter="bg-[#B90003] text-white"
          colorSide="bg-gray-800 text-white opacity-60"
        />
      </div>

      {/* Календарь и время */}
      <div className="w-full max-w-xl mx-auto">
        <h3 className="text-xl font-bold text-center mb-6">
          {t("reservation.calendarTitle")}
        </h3>
        <div className="flex flex-col items-center gap-4">
          <ShadcnCalendar
            key={`${pickupDate}-${returnDate}`}
            mode="range"
            selected={selected}
            defaultMonth={defaultMonth}
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
                setFormData((prev: FormData) => ({
                  ...prev,
                  pickupDate: "",
                  returnDate: "",
                }));
                setWizardData((prev: WizardData) => ({
                  ...prev,
                  pickupDate: "",
                  returnDate: "",
                }));
                return;
              }

              // Обработка выбора дат
              if (range?.from && range?.to) {
                // Если выбраны обе даты и вторая дата раньше первой
                if (range.to < range.from) {
                  const pickupDate = toLocalDateString(range.to);
                  const returnDate = toLocalDateString(range.from);
                  setFormData((prev: FormData) => ({
                    ...prev,
                    pickupDate,
                    returnDate,
                  }));
                  setWizardData((prev: WizardData) => ({
                    ...prev,
                    pickupDate,
                    returnDate,
                  }));
                } else {
                  // Нормальный диапазон
                  const pickupDate = toLocalDateString(range.from);
                  const returnDate = toLocalDateString(range.to);
                  setFormData((prev: FormData) => ({
                    ...prev,
                    pickupDate,
                    returnDate,
                  }));
                  setWizardData((prev: WizardData) => ({
                    ...prev,
                    pickupDate,
                    returnDate,
                  }));
                }
              } else if (range?.from) {
                // Если выбрана только первая дата
                const pickupDate = toLocalDateString(range.from);
                setFormData((prev: FormData) => ({
                  ...prev,
                  pickupDate,
                  returnDate: "",
                }));
                setWizardData((prev: WizardData) => ({
                  ...prev,
                  pickupDate,
                  returnDate: "",
                }));
              } else {
                // Если ничего не выбрано — сброс
                setFormData((prev: FormData) => ({
                  ...prev,
                  pickupDate: "",
                  returnDate: "",
                }));
                setWizardData((prev: WizardData) => ({
                  ...prev,
                  pickupDate: "",
                  returnDate: "",
                }));
              }
            }}
            disabled={disabledDays}
            fromDate={new Date()}
            className="rounded-xl bg-zinc-900/80 border border-zinc-700 shadow-lg p-4 text-white scale-110"
            classNames={{
              day_selected: "bg-[#B90003] text-white hover:bg-[#A00002]",
              day_range_middle: "bg-[#B90003]/30 text-white",
              day_range_end: "bg-[#A00002] text-white",
              day_today: "border-[#B90003] border-2",
              nav_button: "hover:bg-[#B90003]/20",
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
                setFormData((prev: FormData) => {
                  const newData = { ...prev, pickupTime: val };
                  return newData;
                });
                setWizardData((prev: WizardData) => ({
                  ...prev,
                  pickupTime: val,
                }));
              }}
              onClose={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Доп. услуги */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto mb-2 px-2 sm:px-0">
        <h3 className="text-xl font-bold text-center mb-2">
          {t("reservation.extraServices")}
        </h3>
        <div className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3 mb-2">
          <span>{t("reservation.unlimitedMileage")}</span>
          <Switch
            checked={!!wizardData.unlimitedMileage}
            onCheckedChange={(checked) =>
              setWizardData((d: WizardData) => ({
                ...d,
                unlimitedMileage: !!checked,
              }))
            }
          />
        </div>
        {/* Сообщение о стоимости двойного километража */}
        {wizardData.unlimitedMileage && (
          <div className="bg-[#B90003]/10 border border-[#B90003]/20 rounded-lg px-4 py-2 mb-2">
            <p className="text-[#B90003] text-sm text-center">
              {t("reservation.unlimitedMileageDesc")}
            </p>
          </div>
        )}
      </div>

      {/* Как забрать машину */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto mb-2 px-2 sm:px-0">
        <h3 className="text-xl font-bold text-center mb-2">
          {t("reservation.pickupType")}
        </h3>
        <RadioGroup
          value={wizardData.pickupType || "office"}
          onValueChange={(val) =>
            setWizardData((d: WizardData) => ({
              ...d,
              pickupType: val as "office" | "airport" | "address",
            }))
          }
          className="flex flex-col gap-2 bg-gray-700 rounded-lg px-4 py-3 mb-2"
        >
          <label className="flex items-center justify-between cursor-pointer">
            <span>{t("reservation.pickupOffice")}</span>
            <Switch
              checked={wizardData.pickupType === "office"}
              onCheckedChange={(checked) =>
                setWizardData((d: WizardData) => ({
                  ...d,
                  pickupType: checked ? "office" : "airport",
                }))
              }
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>{t("reservation.pickupAirport")}</span>
            <Switch
              checked={wizardData.pickupType === "airport"}
              onCheckedChange={(checked) =>
                setWizardData((d: WizardData) => ({
                  ...d,
                  pickupType: checked ? "airport" : "office",
                }))
              }
            />
          </label>
          <div className="border-t border-[#B90003] my-2"></div>
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
                setWizardData((d: WizardData) => ({
                  ...d,
                  pickupType: "address",
                }))
              }
              onChange={(e) =>
                setWizardData((d: WizardData) => ({
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
        <span className="text-sm font-semibold text-[#B90003] bg-black/30 rounded px-3 py-1">
          {t("reservation.step")} {stepIndicator}
        </span>
      </div>
      {/* Шаг 1: компактные отступы */}
      <Button
        className="w-full max-w-sm sm:max-w-md mx-auto bg-[#B90003] hover:bg-[#A00002] text-white text-base sm:text-lg font-bold py-2 sm:py-3 rounded-xl"
        onClick={goNext}
        disabled={!formData.pickupDate || !formData.returnDate}
      >
        {t("reservation.next")}
      </Button>
      <Button
        className="w-full max-w-sm sm:max-w-md mx-auto mt-2 bg-black text-[#B90003] border-[#B90003] border-2 text-base sm:text-lg font-bold py-2 sm:py-3 rounded-xl"
        variant="outline"
        onClick={goBack}
      >
        {t("reservation.back")}
      </Button>
    </div>
  );
};
