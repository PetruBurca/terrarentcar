import { useState } from "react";
import { FormData, WizardData, UploadedPhotos } from "@/types/reservation";

// Простое состояние без кэширования
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



  return {
    formData,
    setFormData,
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
  };
}
