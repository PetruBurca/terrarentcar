export interface Car {
  id: string;
  name: string;
  carNumber: string; // Номер автомобиля
  images: string[];
  price: number;
  price2to10: number;
  price11to20: number;
  price21to29: number;
  price30plus: number;
  rating: number;
  seats: number;
  transmission: string;
  fuelType: string;
  year: string;
  engine: string; // Добавлено поле engine
  drive: string; // Добавлено поле drive
  doors: number; // Добавлено поле doors
  category: string;
  features: string[];
  description?: string;
  description_ru?: string;
  description_ro?: string;
  description_en?: string;
  blockFromDate?: string | null;
  blockToDate?: string | null;
  status?: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idnp: string;
  paymentMethod: "cash" | "card" | "bank_transfer" | "other";
  paymentOther: string;
  paymentMessage?: string; // Сообщение об оплате (например, "крипта")
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  pickupType: "office" | "airport" | "address";
  pickupAddress: string;
  unlimitedMileage: boolean;
  goldCard: boolean;
  clubCard: boolean;
  message: string;
  returnTime: string;
  // Новые поля для расширенной функциональности
  doubleKmAmount?: number;
  discountAmount?: number;
  deliveryAmount?: number;
  servedBy?: string;
}

export interface WizardData {
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  pickupType: "office" | "airport" | "address";
  pickupAddress: string;
  unlimitedMileage: boolean;
  goldCard: boolean;
  clubCard: boolean;
}

export interface UploadedPhotos {
  front: boolean;
  back: boolean;
}

export interface PassportFiles {
  front: File | null;
  back: File | null;
}

export interface PassportUrls {
  front: string | null;
  back: string | null;
}
