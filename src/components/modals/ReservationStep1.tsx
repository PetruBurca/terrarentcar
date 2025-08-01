import React from "react";
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
  const images = Array.isArray(car.images) ? car.images : [];

  const handlePrev = () =>
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  const handleNext = () =>
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));

  const lang = i18n.language;
  const description =
    lang === "en"
      ? car.description_en || car.description_ru || car.description_ro || ""
      : lang === "ro"
      ? car.description_ro || car.description_ru || car.description_en || ""
      : car.description_ru || car.description_ro || car.description_en || "";

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
            className="w-full h-80 object-cover rounded-lg border border-gray-800"
            style={{ objectPosition: "center 60%" }}
          />
          {/* Стрелки */}
          {car.images && car.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white rounded-full p-3 hover:bg-[#B90003] hover:text-white transition-all duration-300 hover:scale-110 shadow-lg border border-white/20"
                aria-label="Prev"
              >
                <svg
                  className="w-5 h-5"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white rounded-full p-3 hover:bg-[#B90003] hover:text-white transition-all duration-300 hover:scale-110 shadow-lg border border-white/20"
                aria-label="Next"
              >
                <svg
                  className="w-5 h-5"
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
        {/* Миниатюры */}
        {car.images && car.images.length > 1 && (
          <div className="flex justify-center gap-2 mt-2">
            {car.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`w-14 h-14 object-cover rounded cursor-pointer border-2 ${
                  activeIndex === idx ? "border-[#B90003]" : "border-gray-700"
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
        colorCenter="bg-[#B90003] text-white"
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
            value: translateCarSpec("transmission", car.transmission, t),
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
        colorCenter="bg-[#B90003] text-white"
        colorSide="bg-gray-800 text-white opacity-60"
      />

      {/* Календарь и время */}
      <div className="w-full max-w-md mx-auto">
        <h3 className="text-xl font-bold text-center mb-2">
          {t("reservation.calendarTitle")}
        </h3>
        <div className="flex flex-col items-center gap-2">
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
            className="rounded-xl bg-zinc-900/80 border border-zinc-700 shadow-lg p-2 text-white"
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
      <div className="w-full max-w-md sm:max-w-full mx-auto mb-2">
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
      <div className="w-full max-w-md sm:max-w-full mx-auto mb-2">
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
        className="w-full bg-[#B90003] hover:bg-[#A00002] text-white text-lg font-bold py-3 rounded-xl"
        onClick={goNext}
        disabled={!formData.pickupDate || !formData.returnDate}
      >
        {t("reservation.next")}
      </Button>
      <Button
        className="w-full mt-2 bg-black text-[#B90003] border-[#B90003] border-2 text-lg font-bold py-3 rounded-xl"
        variant="outline"
        onClick={goBack}
      >
        {t("reservation.back")}
      </Button>
    </div>
  );
};
