export interface Car {
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
  blockFromDate?: string | null; // Дата блокировки от администратора
  blockToDate?: string | null; // Дата блокировки до администратора
  status?: string; // Статус автомобиля (доступен, на обслуживании, в аренде)
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idnp: string;
  paymentMethod: "cash" | "card" | "other";
  paymentOther: string;
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
