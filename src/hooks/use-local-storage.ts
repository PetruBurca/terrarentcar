import { useState } from "react";
import { FormData, WizardData, UploadedPhotos } from "@/types/reservation";

// Простой хук без localStorage для стабильности на мобильных
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
  };

  return [storedValue, setValue];
}

// Хук для формы бронирования без кэширования
export function useReservationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "10:00",
    returnTime: "",
    message: "",
    pickupType: "office" as "office" | "airport" | "address",
    idnp: "",
    pickupAddress: "",
    unlimitedMileage: false,
    goldCard: false,
    clubCard: false,
    paymentMethod: "cash" as "cash" | "card" | "other",
    paymentOther: "",
  });

  const [searchDates, setSearchDates] = useState({
    from: null,
    to: null,
  });

  const [currentStep, setCurrentStep] = useState(0);

  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhotos>({
    front: false,
    back: false,
  });

  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [wizardData, setWizardData] = useState<WizardData>({
    pickupDate: "",
    returnDate: "",
    pickupTime: "10:00",
    pickupType: "office" as "office" | "airport" | "address",
    pickupAddress: "",
    unlimitedMileage: false,
    goldCard: false,
    clubCard: false,
  });

  const [selectedCountryCode, setSelectedCountryCode] = useState("+373");

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Очистка данных (теперь просто сброс в начальные значения)
  const clearCache = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      pickupDate: "",
      returnDate: "",
      pickupTime: "10:00",
      returnTime: "",
      message: "",
      pickupType: "office" as "office" | "airport" | "address",
      idnp: "",
      pickupAddress: "",
      unlimitedMileage: false,
      goldCard: false,
      clubCard: false,
      paymentMethod: "cash" as "cash" | "card" | "other",
      paymentOther: "",
    });
    setSearchDates({ from: null, to: null });
    setCurrentStep(0);
    setUploadedPhotos({ front: false, back: false });
    setPrivacyAccepted(false);
    setWizardData({
      pickupDate: "",
      returnDate: "",
      pickupTime: "10:00",
      pickupType: "office" as "office" | "airport" | "address",
      pickupAddress: "",
      unlimitedMileage: false,
      goldCard: false,
      clubCard: false,
    });
    setSelectedCountryCode("+373");
    setActiveImageIndex(0);
  };

  return {
    formData,
    setFormData,
    searchDates,
    setSearchDates,
    currentStep,
    setCurrentStep,
    uploadedPhotos,
    setUploadedPhotos,
    privacyAccepted,
    setPrivacyAccepted,
    wizardData,
    setWizardData,
    selectedCountryCode,
    setSelectedCountryCode,
    activeImageIndex,
    setActiveImageIndex,
    clearCache,
  };
}

// Хук для выбранной машины без кэширования
export function useSelectedCar() {
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  const clearSelectedCar = () => {
    setSelectedCarId(null);
  };

  return {
    selectedCarId,
    setSelectedCarId,
    clearSelectedCar,
  };
}
