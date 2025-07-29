import React from "react";
import { Button } from "@/components/ui/utils/button";
import { Input } from "@/components/ui/inputs/input";
import { Label } from "@/components/ui/utils/label";
import { Switch } from "@/components/ui/forms/switch";
import { RadioGroup } from "@/components/ui/forms/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs/select";
import { FileInput } from "@/components/ui/inputs/file-input";
import { useTranslation } from "react-i18next";
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

interface ReservationStep3Props {
  car: Car;
  formData: any;
  setFormData: (data: any) => void;
  uploadedPhotos: any;
  setUploadedPhotos: (data: any) => void;
  privacyAccepted: boolean;
  setPrivacyAccepted: (accepted: boolean) => void;
  selectedCountryCode: string;
  setSelectedCountryCode: (code: string) => void;
  currentStep: number;
  stepIndicator: string;
  finalRentalCost: number;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  goBack: () => void;
}

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

export const ReservationStep3: React.FC<ReservationStep3Props> = ({
  car,
  formData,
  setFormData,
  uploadedPhotos,
  setUploadedPhotos,
  privacyAccepted,
  setPrivacyAccepted,
  selectedCountryCode,
  setSelectedCountryCode,
  currentStep,
  stepIndicator,
  finalRentalCost,
  isSubmitting,
  handleSubmit,
  goBack,
}) => {
  const { t } = useTranslation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
      <div className="flex justify-between items-center border-b border-[#B90003] pb-2 mb-2">
        <div>
          <div className="text-lg font-bold text-[#B90003]">
            {t("reservation.total")}
          </div>
          <div className="text-sm text-gray-300">
            {t("reservation.totalCost")}
          </div>
        </div>
        <div className="text-2xl font-bold text-white">
          {finalRentalCost + 20} €
        </div>
      </div>

      {/* Способ оплаты */}
      <div className="w-full max-w-md sm:max-w-full mx-auto mb-2">
        <h3 className="text-xl font-bold text-center mb-2">
          {t("reservation.paymentMethod")}
        </h3>
        <RadioGroup
          value={formData.paymentMethod || "cash"}
          onValueChange={(val) =>
            setFormData((d: any) => ({
              ...d,
              paymentMethod: val as "cash" | "card" | "other",
            }))
          }
          className="flex flex-col gap-2 bg-gray-700 rounded-lg px-4 py-3 mb-2"
        >
          <label className="flex items-center justify-between cursor-pointer">
            <span>{t("reservation.cash")}</span>
            <Switch
              checked={formData.paymentMethod === "cash"}
              onCheckedChange={(checked) =>
                setFormData((d: any) => ({
                  ...d,
                  paymentMethod: checked ? "cash" : "card",
                }))
              }
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>{t("reservation.card")}</span>
            <Switch
              checked={formData.paymentMethod === "card"}
              onCheckedChange={(checked) =>
                setFormData((d: any) => ({
                  ...d,
                  paymentMethod: checked ? "card" : "cash",
                }))
              }
            />
          </label>
          <div className="border-t border-[#B90003] my-2"></div>
          <label className="flex flex-col gap-1 cursor-pointer">
            <span className="text-center">{t("reservation.other")}</span>
            <Input
              type="text"
              className="bg-gray-800 rounded px-2 py-1 text-white"
              placeholder={t("reservation.other")}
              value={
                formData.paymentMethod === "other"
                  ? formData.paymentOther || ""
                  : ""
              }
              onFocus={() =>
                setFormData((d: any) => ({
                  ...d,
                  paymentMethod: "other",
                }))
              }
              onChange={(e) =>
                setFormData((d: any) => ({
                  ...d,
                  paymentMethod: "other" as const,
                  paymentOther: e.target.value,
                }))
              }
            />
          </label>
        </RadioGroup>
      </div>

      {/* Имя */}
      <div>
        <Label htmlFor="firstName" className="text-[#B90003] font-bold">
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
        <Label htmlFor="lastName" className="text-[#B90003] font-bold">
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
        <Label htmlFor="email" className="text-[#B90003] font-bold">
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
        <Label htmlFor="idnp" className="text-[#B90003] font-bold">
          {t("reservation.idnp")}
        </Label>
        <Input
          id="idnp"
          name="idnp"
          placeholder="1234567890123"
          className="bg-zinc-800 text-white border-none mt-1"
          value={formData.idnp || ""}
          onChange={(e) => {
            // Разрешаем только цифры и максимум 13 символов
            const value = e.target.value.replace(/\D/g, "").slice(0, 13);
            setFormData({
              ...formData,
              idnp: value,
            });
          }}
          maxLength={13}
          pattern="[0-9]{13}"
          required
        />
      </div>

      {/* Фото удостоверения */}
      <div>
        <Label className="text-[#B90003] font-bold">
          {t("reservation.idPhotos")}
        </Label>
        <div className="flex gap-4 mt-2">
          {/* Фронт */}
          <div className="flex flex-col items-center gap-1">
            <FileInput
              name="idPhotoFront"
              accept="image/*"
              required
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadedPhotos((prev: any) => ({
                    ...prev,
                    front: true,
                  }));
                }
              }}
              className={`flex flex-col items-center justify-center w-28 h-28 bg-zinc-900 border-2 border-dashed rounded-lg cursor-pointer hover:bg-zinc-800 transition group ${
                uploadedPhotos.front ? "border-green-400" : "border-[#ffffff]"
              }`}
            >
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
                    className="text-gray-400 mb-1"
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
            </FileInput>
            <span className="text-xs text-gray-400 mt-1">
              {t("reservation.frontExample")}
            </span>
          </div>

          {/* Бэк */}
          <div className="flex flex-col items-center gap-1">
            <FileInput
              name="idPhotoBack"
              accept="image/*"
              required
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadedPhotos((prev: any) => ({
                    ...prev,
                    back: true,
                  }));
                }
              }}
              className={`flex flex-col items-center justify-center w-28 h-28 bg-zinc-900 border-2 border-dashed rounded-lg cursor-pointer hover:bg-zinc-800 transition group ${
                uploadedPhotos.back ? "border-green-400" : "border-[#ffffff]"
              }`}
            >
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
                    className="text-gray-400 mb-1"
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
            </FileInput>
            <span className="text-xs text-gray-400 mt-1">
              {t("reservation.backExample")}
            </span>
          </div>
        </div>
      </div>

      {/* Телефон с регионом */}
      <div>
        <Label htmlFor="phone" className="text-[#B90003] font-bold">
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
                      countries.find((c) => c.code === selectedCountryCode)
                        ?.flag
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
            placeholder="0(XX)XXXXXX"
            className={`bg-zinc-800 text-white border-none flex-1 ${
              formData.phone.replace(/\D/g, "").length === 9
                ? "border-green-500 border-2"
                : formData.phone.replace(/\D/g, "").length > 0
                ? "border-yellow-500 border-2"
                : ""
            }`}
            value={formatPhoneNumber(
              formData.phone.replace(
                new RegExp(`^\\${selectedCountryCode}`),
                ""
              )
            )}
            onChange={(e) => {
              // Получаем только цифры из ввода (убираем все не-цифры)
              const digitsOnly = e.target.value.replace(/\D/g, "");

              // Ограничиваем до 9 цифр (0 + код оператора + номер)
              const limitedDigits = digitsOnly.slice(0, 9);

              setFormData({
                ...formData,
                phone: selectedCountryCode + limitedDigits,
              });
            }}
            maxLength={13}
            required
          />
          <div className="text-xs mt-1 ml-2">
            {(() => {
              // Получаем только цифры номера (без кода страны)
              const phoneDigits = formData.phone
                .replace(/\D/g, "")
                .replace(selectedCountryCode.replace(/\D/g, ""), "");
              const digitCount = phoneDigits.length;

              if (digitCount === 9) {
                return (
                  <span className="text-green-400">
                    {t("reservation.phoneValid")}
                  </span>
                );
              } else if (digitCount > 0) {
                return (
                  <span className="text-yellow-400">
                    {t("reservation.phoneIncomplete", {
                      count: 9 - digitCount,
                    })}
                  </span>
                );
              } else {
                return (
                  <span className="text-gray-400">
                    {t("reservation.phoneFormat")}
                  </span>
                );
              }
            })()}
          </div>
        </div>
      </div>

      {/* Чекбокс согласия */}
      <div className="flex items-start gap-2 mt-2">
        <Switch
          id="privacy"
          checked={privacyAccepted}
          onCheckedChange={(checked) => setPrivacyAccepted(!!checked)}
          required
          className="mt-1"
        />
        <label htmlFor="privacy" className="text-white text-sm select-none">
          {t("reservation.privacyPolicy")}{" "}
          <a
            href="/privacy-policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B90003] underline ml-1"
          >
            {t("reservation.privacyPolicyLink")}
          </a>
          .
        </label>
      </div>

      {/* Индикатор шага перед кнопкой */}
      <div className="w-full flex justify-center mb-2 mt-2">
        <span className="text-sm font-semibold text-[#B90003] bg-black/30 rounded px-3 py-1">
          {t("reservation.step")} {stepIndicator}
        </span>
      </div>

      {/* Кнопка */}
      <Button
        className="w-full bg-[#B90003] hover:bg-[#A00002] disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-lg font-bold py-3 rounded-xl"
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
        className="w-full mt-2 bg-black text-[#B90003] border-[#B90003] border-2 text-lg font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        variant="outline"
        onClick={goBack}
        disabled={isSubmitting}
      >
        {t("reservation.back")}
      </Button>
    </form>
  );
};
