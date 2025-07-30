import React from "react";
import { Button } from "@/components/ui/utils/button";
import { useTranslation } from "react-i18next";
import { formatDateRange } from "@/lib/dateHelpers";

import { Switch } from "@/components/ui/forms/switch";
// Импорт SVG-иконок для правил
import NoSmokeIcon from "@/assets/logorule/no-smoking-sign-svgrepo-com.svg";
import NoPetsIcon from "@/assets/logorule/no-pets-svgrepo-com.svg";
import FuelIcon from "@/assets/logorule/fuel-counter-svgrepo-com.svg";
import NoDepositIcon from "@/assets/logorule/no-money-poverty-budget-poor-cash-svgrepo-com.svg";
import SpeedIcon from "@/assets/logorule/website-performance-internet-svgrepo-com.svg";
import AggressiveIcon from "@/assets/logorule/fast-acceleration-svgrepo-com.svg";
import { Car, FormData, WizardData } from "@/types/reservation";

interface ReservationStep2Props {
  car: Car;
  formData: FormData;
  wizardData: WizardData;
  setWizardData: (
    data: WizardData | ((prev: WizardData) => WizardData)
  ) => void;
  currentStep: number;
  stepIndicator: string;
  calculateDays: () => number;
  totalPrice: number;
  discount: number;
  finalRentalCost: number;
  goNext: () => void;
  goBack: () => void;
  i18n: {
    language: string;
  };
}

export const ReservationStep2: React.FC<ReservationStep2Props> = ({
  car,
  formData,
  wizardData,
  setWizardData,
  currentStep,
  stepIndicator,
  calculateDays,
  totalPrice,
  discount,
  finalRentalCost,
  goNext,
  goBack,
  i18n,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md sm:max-w-full mx-auto pb-4">
      {/* Заголовок */}
      <div className="text-2xl font-bold mb-4 text-white text-center">
        {t("reservation.confirmTitle")}
      </div>

      {/* Период аренды */}
      <div className="mb-3">
        <div className="text-lg font-bold text-[#B90003] mb-1">
          {t("reservation.periodTitle")}
        </div>
        <div className="bg-zinc-900 rounded-xl px-4 py-3 flex flex-col gap-1 border border-[#B90003]">
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
                    <span className="mx-2 text-[#B90003] font-bold">—</span>
                    {dates.end}
                    <span className="ml-2 text-[#fffffff2] font-bold">
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
        <div className="text-lg font-bold text-[#B90003] mb-1">
          {t("reservation.geoTitle")}
        </div>
        <div className="bg-zinc-900 rounded-xl px-4 py-3 text-base text-white border border-[#B90003]">
          {wizardData.pickupType === "office" || !wizardData.pickupType
            ? t("reservation.officeAddress")
            : wizardData.pickupType === "airport"
            ? t("reservation.airportAddress")
            : wizardData.pickupAddress || t("reservation.enterAddress")}
        </div>
      </div>

      {/* Правила пользования автомобилем */}
      <div className="mb-3">
        <div className="text-lg font-bold mb-2 text-[#B90003]">
          {t("reservation.rulesTitle")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-zinc-900 rounded-xl p-4 border border-[#B90003]">
          <div className="flex items-center gap-3 text-white">
            <img src={NoSmokeIcon} alt="Не курить" className="w-7 h-7" />
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
            <img src={NoDepositIcon} alt="No deposit" className="w-7 h-7" />
            <span>{t("reservation.ruleNoDeposit")}</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <img src={SpeedIcon} alt="Speed limit" className="w-7 h-7" />
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
        <div className="text-xl font-bold text-center mb-2 text-[#B90003]">
          {t("reservation.clientCardTitle")}
        </div>
        <div className="flex flex-col gap-2 bg-zinc-900 rounded-xl p-4 border border-[#B90003]">
          <label className="flex items-center justify-between cursor-pointer">
            <span>{t("reservation.goldCard")}</span>
            <Switch
              checked={wizardData.goldCard}
              onCheckedChange={(checked) =>
                setWizardData((d: WizardData) => ({
                  ...d,
                  goldCard: checked,
                  clubCard: checked ? false : d.clubCard, // Отключаем другую карту при включении этой
                }))
              }
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>{t("reservation.clubCard")}</span>
            <Switch
              checked={wizardData.clubCard}
              onCheckedChange={(checked) =>
                setWizardData((d: WizardData) => ({
                  ...d,
                  clubCard: checked,
                  goldCard: checked ? false : d.goldCard, // Отключаем другую карту при включении этой
                }))
              }
            />
          </label>
        </div>
      </div>

      {/* Стоимость */}
      <div className="mb-0">
        <div className="text-lg font-bold text-[#B90003] mb-2">
          {t("reservation.costTitle")}
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 flex flex-col gap-2 text-white border border-[#B90003]">
          <div className="flex justify-between">
            <span>{t("reservation.duration")}</span>{" "}
            <span>
              {calculateDays()} {t("reservation.days")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("reservation.wash")}</span> <span>20 €</span>
          </div>
          {wizardData.unlimitedMileage && (
            <div className="flex justify-between">
              <span>{t("reservation.unlimitedMileageCost")}</span>{" "}
              <span>{calculateDays() * 20} €</span>
            </div>
          )}
          {(wizardData.pickupType === "address" || wizardData.pickupType === "airport") && (
            <div className="flex justify-between">
              <span>{t("reservation.delivery")}</span> <span>20 €</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>{t("reservation.rentCost")}</span> <span>{totalPrice - discount} €</span>
          </div>
          <div className="border-t border-[#B90003]/30 my-2"></div>
          <div className="flex justify-between font-bold text-xl text-[#B90003]">
            <span>{t("reservation.totalAmount")}</span>{" "}
            <span>{finalRentalCost} €</span>
          </div>
        </div>
      </div>

      {/* Индикатор шага перед кнопкой */}
      <div className="w-full flex justify-center mb-2 mt-2">
        <span className="text-sm font-semibold text-[#B90003] bg-black/30 rounded px-3 py-1">
          {t("reservation.step")} {stepIndicator}
        </span>
      </div>
      <Button
        className="w-full bg-[#B90003] hover:bg-[#A00002] text-white text-lg font-bold py-3 rounded-xl"
        onClick={goNext}
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
