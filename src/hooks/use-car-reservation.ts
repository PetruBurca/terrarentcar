import { useState, useEffect } from "react";
import { FormData, WizardData, UploadedPhotos } from "@/types/reservation";

// Кэширование с изоляцией по машинам
export function useCarReservation(carId: string) {
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

  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhotos>({
    front: false,
    back: false,
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+373");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  // Загрузка данных из localStorage при изменении carId
  useEffect(() => {
    if (!carId) return;

    try {
      // Загружаем данные для конкретной машины
      const carFormData = localStorage.getItem(`reservation-form-${carId}`);
      const carStep = localStorage.getItem(`reservation-step-${carId}`);
      const carPhotos = localStorage.getItem(`uploaded-photos-${carId}`);
      const carPrivacy = localStorage.getItem(`privacy-accepted-${carId}`);
      const carWizard = localStorage.getItem(`wizard-data-${carId}`);
      const carCountryCode = localStorage.getItem(
        `selected-country-code-${carId}`
      );
      const carImageIndex = localStorage.getItem(`active-image-index-${carId}`);

      if (carFormData) {
        setFormData(JSON.parse(carFormData));
      }
      if (carStep) {
        setCurrentStep(JSON.parse(carStep));
      }
      if (carPhotos) {
        setUploadedPhotos(JSON.parse(carPhotos));
      }
      if (carPrivacy) {
        setPrivacyAccepted(JSON.parse(carPrivacy));
      }
      if (carWizard) {
        setWizardData(JSON.parse(carWizard));
      }
      if (carCountryCode) {
        setSelectedCountryCode(JSON.parse(carCountryCode));
      }
      if (carImageIndex) {
        setActiveImageIndex(JSON.parse(carImageIndex));
      }
    } catch (error) {
      console.error("Ошибка загрузки данных для машины:", error);
    }
  }, [carId]);

  // Сохранение данных в localStorage
  const saveToStorage = (key: string, value: any) => {
    if (!carId) return;
    try {
      localStorage.setItem(`reservation-form-${carId}`, JSON.stringify(value));
    } catch (error) {
      console.error("Ошибка сохранения данных:", error);
    }
  };

  const saveStepToStorage = (step: number) => {
    if (!carId) return;
    try {
      localStorage.setItem(`reservation-step-${carId}`, JSON.stringify(step));
    } catch (error) {
      console.error("Ошибка сохранения шага:", error);
    }
  };

  const savePhotosToStorage = (photos: UploadedPhotos) => {
    if (!carId) return;
    try {
      localStorage.setItem(`uploaded-photos-${carId}`, JSON.stringify(photos));
    } catch (error) {
      console.error("Ошибка сохранения фото:", error);
    }
  };

  const savePrivacyToStorage = (privacy: boolean) => {
    if (!carId) return;
    try {
      localStorage.setItem(
        `privacy-accepted-${carId}`,
        JSON.stringify(privacy)
      );
    } catch (error) {
      console.error("Ошибка сохранения privacy:", error);
    }
  };

  const saveWizardToStorage = (wizard: WizardData) => {
    if (!carId) return;
    try {
      localStorage.setItem(`wizard-data-${carId}`, JSON.stringify(wizard));
    } catch (error) {
      console.error("Ошибка сохранения wizard:", error);
    }
  };

  const saveCountryCodeToStorage = (code: string) => {
    if (!carId) return;
    try {
      localStorage.setItem(
        `selected-country-code-${carId}`,
        JSON.stringify(code)
      );
    } catch (error) {
      console.error("Ошибка сохранения кода страны:", error);
    }
  };

  const saveImageIndexToStorage = (index: number) => {
    if (!carId) return;
    try {
      localStorage.setItem(
        `active-image-index-${carId}`,
        JSON.stringify(index)
      );
    } catch (error) {
      console.error("Ошибка сохранения индекса изображения:", error);
    }
  };

  // Обновленные функции с автоматическим сохранением
  const updateFormData = (
    newData: FormData | ((prev: FormData) => FormData)
  ) => {
    const updatedData =
      typeof newData === "function" ? newData(formData) : newData;
    setFormData(updatedData);
    saveToStorage(`reservation-form-${carId}`, updatedData);
  };

  const updateCurrentStep = (step: number | ((prev: number) => number)) => {
    const updatedStep = typeof step === "function" ? step(currentStep) : step;
    setCurrentStep(updatedStep);
    saveStepToStorage(updatedStep);
  };

  const updateUploadedPhotos = (
    photos: UploadedPhotos | ((prev: UploadedPhotos) => UploadedPhotos)
  ) => {
    const updatedPhotos =
      typeof photos === "function" ? photos(uploadedPhotos) : photos;
    setUploadedPhotos(updatedPhotos);
    savePhotosToStorage(updatedPhotos);
  };

  const updatePrivacyAccepted = (
    privacy: boolean | ((prev: boolean) => boolean)
  ) => {
    const updatedPrivacy =
      typeof privacy === "function" ? privacy(privacyAccepted) : privacy;
    setPrivacyAccepted(updatedPrivacy);
    savePrivacyToStorage(updatedPrivacy);
  };

  const updateWizardData = (
    wizard: WizardData | ((prev: WizardData) => WizardData)
  ) => {
    const updatedWizard =
      typeof wizard === "function" ? wizard(wizardData) : wizard;
    setWizardData(updatedWizard);
    saveWizardToStorage(updatedWizard);
  };

  const updateSelectedCountryCode = (
    code: string | ((prev: string) => string)
  ) => {
    const updatedCode =
      typeof code === "function" ? code(selectedCountryCode) : code;
    setSelectedCountryCode(updatedCode);
    saveCountryCodeToStorage(updatedCode);
  };

  const updateActiveImageIndex = (
    index: number | ((prev: number) => number)
  ) => {
    const updatedIndex =
      typeof index === "function" ? index(activeImageIndex) : index;
    setActiveImageIndex(updatedIndex);
    saveImageIndexToStorage(updatedIndex);
  };

  // Очистка кэша для конкретной машины
  const clearCarCache = () => {
    if (!carId) return;

    const keysToRemove = [
      `reservation-form-${carId}`,
      `reservation-step-${carId}`,
      `uploaded-photos-${carId}`,
      `privacy-accepted-${carId}`,
      `wizard-data-${carId}`,
      `selected-country-code-${carId}`,
      `active-image-index-${carId}`,
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Сбрасываем состояние
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
      pickupType: "office",
      idnp: "",
      pickupAddress: "",
      unlimitedMileage: false,
      goldCard: false,
      clubCard: false,
      paymentMethod: "cash",
      paymentOther: "",
    });
    setCurrentStep(0);
    setUploadedPhotos({ front: false, back: false });
    setPrivacyAccepted(false);
    setSelectedCountryCode("+373");
    setActiveImageIndex(0);
    setWizardData({
      pickupDate: "",
      returnDate: "",
      pickupTime: "10:00",
      pickupType: "office",
      pickupAddress: "",
      unlimitedMileage: false,
      goldCard: false,
      clubCard: false,
    });

    console.log(`🧹 Кэш очищен для машины ${carId}`);
  };

  // Очистка всех кэшей машин
  const clearAllCarCaches = () => {
    const keys = Object.keys(localStorage);
    const carKeys = keys.filter(
      (key) =>
        key.includes("reservation-form-") ||
        key.includes("reservation-step-") ||
        key.includes("uploaded-photos-") ||
        key.includes("privacy-accepted-") ||
        key.includes("wizard-data-") ||
        key.includes("selected-country-code-") ||
        key.includes("active-image-index-")
    );

    carKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    console.log("🧹 Все кэши машин очищены");
  };

  return {
    formData,
    setFormData: updateFormData,
    currentStep,
    setCurrentStep: updateCurrentStep,
    uploadedPhotos,
    setUploadedPhotos: updateUploadedPhotos,
    privacyAccepted,
    setPrivacyAccepted: updatePrivacyAccepted,
    wizardData,
    setWizardData: updateWizardData,
    selectedCountryCode,
    setSelectedCountryCode: updateSelectedCountryCode,
    activeImageIndex,
    setActiveImageIndex: updateActiveImageIndex,
    clearCarCache,
    clearAllCarCaches,
  };
}
