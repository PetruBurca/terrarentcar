import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

// Re-export Timestamp for use in other files
export { Timestamp };
import { db, functions } from "./firebase";
import { sendNewRequestNotification } from "./notifications";
import { httpsCallable } from "firebase/functions";

// Интерфейсы для Firestore
export interface FirestoreCar {
  id?: string;
  name: string;
  carNumber: string; // Номер машины
  year: number;
  price: number;
  price2to10: number;
  price11to20: number;
  price21to29: number;
  price30plus: number;
  category: string;
  transmission: string;
  fuelType: string;
  drive: string; // Привод
  engine: string; // Двигатель
  seats: number;
  doors: number; // Количество дверей
  images: string[];
  rentFrom?: Date;
  rentTo?: Date;
  status: string;
  description?: string;
  features: string[];
  rating: number;
  blockFromDate?: string | null;
  blockToDate?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreOrder {
  id?: string;
  carId: string;
  carName: string;
  carNumber: string; // Номер автомобиля
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerPassport: string;
  rentFrom: Timestamp;
  rentTo: Timestamp;
  totalDays: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  documents: {
    front: string;
    back: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Новые поля для расширенной функциональности
  pickupTime?: string;
  paymentMethod?: "cash" | "card" | "bank_transfer" | "other";
  paymentMessage?: string; // Сообщение об оплате (например, "крипта")
  pickupType?: "office" | "airport" | "address"; // Тип получения на фронтенде
  deliveryType?: "pickup" | "delivery";
  deliveryAddress?: string;
  unlimitedMileage?: boolean;
  clubCard?: boolean;
  goldCard?: boolean;
  doubleKmAmount?: number;
  discountAmount?: number;
  deliveryAmount?: number;
  servedBy?: string;
}

export interface FirestoreContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
  createdAt: Timestamp;
  status?: "pending" | "read" | "replied";
  priority?: "low" | "medium" | "high";
}

// Функции для работы с автомобилями
export async function fetchCars(): Promise<FirestoreCar[]> {
  try {
    const carsRef = collection(db, "cars");
    const q = query(carsRef, orderBy("name"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreCar[];
  } catch (error) {
    console.error("Ошибка загрузки автомобилей из Firestore:", error);
    throw error;
  }
}

export async function fetchAvailableCars(): Promise<FirestoreCar[]> {
  try {
    // console.log("=== DEBUG: fetchAvailableCars ===");
    const carsRef = collection(db, "cars");
    const q = query(carsRef, where("status", "==", "available"));
    const querySnapshot = await getDocs(q);

    const cars = querySnapshot.docs.map((doc) => {
      const carData = {
        id: doc.id,
        ...doc.data(),
      } as FirestoreCar;

      // console.log(
      //   `Фронтенд - Машина: ${carData.name}, ID: ${carData.id}, Категория: ${carData.category}, Статус: ${carData.status}`
      // );
      return carData;
    });

    // console.log(`Фронтенд - Загружено ${cars.length} доступных машин`);
    return cars;
  } catch (error) {
    console.error("Ошибка загрузки доступных автомобилей:", error);
    throw error;
  }
}

// Функции для работы с заказами
export async function createOrder(
  orderData: Omit<FirestoreOrder, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const ordersRef = collection(db, "orders");
    const orderWithTimestamps = {
      ...orderData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(ordersRef, orderWithTimestamps);

    // Trimitem notificarea administratorilor despre cererea nouă
    try {
      await sendNewRequestNotification({
        ...orderData,
        id: docRef.id,
        orderNumber: docRef.id, // Folosim ID-ul ca număr de comandă
        carNumber: orderData.carNumber, // Numărul mașinii
        status: orderData.status || "pending",
        startDate:
          orderData.rentFrom?.toDate().toLocaleDateString("ro-RO") || "N/A",
        endDate:
          orderData.rentTo?.toDate().toLocaleDateString("ro-RO") || "N/A",
        totalPrice: `${orderData.totalPrice} €`,
        pickupType: orderData.pickupType || "office",
        deliveryAddress: orderData.deliveryAddress || "N/A",
        doubleKmPrice: orderData.doubleKmAmount || "0",
        deliveryPrice: orderData.deliveryAmount || "0",
        discountAmount: orderData.discountAmount || "0",
      });
      // console.log(
      //   "✅ Notificarea despre cererea nouă a fost trimisă administratorilor"
      // );
    } catch (notificationError) {
      console.error("❌ Eroare la trimiterea notificării:", notificationError);
      // Nu întrerupem crearea comenzii din cauza erorii de notificare
    }

    return docRef.id;
  } catch (error) {
    console.error("Eroare la crearea comenzii în Firestore:", error);
    throw error;
  }
}

export async function fetchOrders(): Promise<FirestoreOrder[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreOrder[];
  } catch (error) {
    console.error("Ошибка загрузки заказов из Firestore:", error);
    throw error;
  }
}

export async function fetchOrdersByCar(
  carId: string
): Promise<FirestoreOrder[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("carId", "==", carId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreOrder[];
  } catch (error) {
    console.error("Ошибка загрузки заказов по автомобилю:", error);
    throw error;
  }
}

// Функции для работы с контактами
export async function createContactRequest(
  contactData: Omit<
    FirestoreContact,
    "id" | "createdAt" | "status" | "priority"
  >
): Promise<string> {
  try {
    const contactsRef = collection(db, "contacts");
    const contactWithTimestamp = {
      ...contactData,
      createdAt: Timestamp.now(),
      status: "pending" as const,
      priority: "medium" as const,
    };

    const docRef = await addDoc(contactsRef, contactWithTimestamp);

    // Trimitem notificarea către administratori
    try {
      const sendNewMessageNotification = httpsCallable(
        functions,
        "sendNewMessageNotification"
      );

      await sendNewMessageNotification({
        messageData: {
          ...contactData,
          id: docRef.id,
          createdAt: contactWithTimestamp.createdAt,
        },
      });

      // console.log(
      //   "✅ Notificarea despre mesajul nou a fost trimisă către administratori"
      // );
    } catch (notificationError) {
      console.error(
        "❌ Eroare la trimiterea notificării către administratori:",
        notificationError
      );
      // Nu întrerupem execuția din cauza erorii de notificare
    }

    return docRef.id;
  } catch (error) {
    console.error("Eroare la crearea cererii de contact în Firestore:", error);
    throw error;
  }
}

// Функция для проверки доступности автомобиля
export async function checkCarAvailability(
  carId: string,
  rentFrom: Date,
  rentTo: Date
): Promise<boolean> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("carId", "==", carId),
      where("status", "in", ["pending", "confirmed"])
    );

    const querySnapshot = await getDocs(q);

    // Проверяем пересечения дат
    for (const doc of querySnapshot.docs) {
      const order = doc.data() as FirestoreOrder;
      const orderFrom = order.rentFrom.toDate();
      const orderTo = order.rentTo.toDate();

      // Если есть пересечение дат, автомобиль недоступен
      if (
        (rentFrom >= orderFrom && rentFrom <= orderTo) ||
        (rentTo >= orderFrom && rentTo <= orderTo) ||
        (rentFrom <= orderFrom && rentTo >= orderTo)
      ) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Ошибка проверки доступности автомобиля:", error);
    throw error;
  }
}
