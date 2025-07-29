import { useState, useEffect } from "react";
import { FormData, WizardData, UploadedPhotos } from "@/types/reservation";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Получаем значение из localStorage или используем initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      const parsed = item ? JSON.parse(item) : initialValue;
      return parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Функция для установки значения
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Позволяем value быть функцией, чтобы у нас была та же API, что и useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // Сохраняем в localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Слушаем изменения в других вкладках
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

// Хук для кэширования формы бронирования
export function useReservationForm() {
  const [formData, setFormData] = useLocalStorage<FormData>(
    "reservation-form",
    {
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
    }
  );

  const [searchDates, setSearchDates] = useLocalStorage("search-dates", {
    from: null,
    to: null,
  });

  const [currentStep, setCurrentStep] = useLocalStorage("reservation-step", 0);

  const [uploadedPhotos, setUploadedPhotos] = useLocalStorage<UploadedPhotos>(
    "uploaded-photos",
    {
      front: false,
      back: false,
    }
  );

  const [privacyAccepted, setPrivacyAccepted] = useLocalStorage(
    "privacy-accepted",
    false
  );

  const [wizardData, setWizardData] = useLocalStorage<WizardData>(
    "wizard-data",
    {
      pickupDate: "",
      returnDate: "",
      pickupTime: "10:00",
      pickupType: "office" as "office" | "airport" | "address",
      pickupAddress: "",
      unlimitedMileage: false,
      goldCard: false,
      clubCard: false,
    }
  );

  const [selectedCountryCode, setSelectedCountryCode] = useLocalStorage(
    "selected-country-code",
    "+373"
  );

  const [activeImageIndex, setActiveImageIndex] = useLocalStorage(
    "active-image-index",
    0
  );

  // Очистка кэша при успешной отправке
  const clearCache = () => {
    localStorage.removeItem("reservation-form");
    localStorage.removeItem("search-dates");
    localStorage.removeItem("reservation-step");
    localStorage.removeItem("uploaded-photos");
    localStorage.removeItem("privacy-accepted");
    localStorage.removeItem("wizard-data");
    localStorage.removeItem("selected-country-code");
    localStorage.removeItem("active-image-index");
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

// Хук для кэширования выбранной машины
export function useSelectedCar() {
  const [selectedCarId, setSelectedCarId] = useLocalStorage<string | null>(
    "selected-car-id",
    null
  );

  const clearSelectedCar = () => {
    localStorage.removeItem("selected-car-id");
  };

  return {
    selectedCarId,
    setSelectedCarId,
    clearSelectedCar,
  };
}
