import { initializeApp } from "firebase/app";
import { httpsCallable, getFunctions } from "firebase/functions";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { createSecurePayload } from "./cryptoUtils";

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Проверяем наличие обязательных переменных окружения
const requiredEnvVars = {
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Отсутствуют обязательные переменные окружения Firebase: ${missingVars.join(
      ", "
    )}. ` + "Создайте файл .env в корне проекта и добавьте эти переменные."
  );
}

// Инициализация Firebase
export const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export const functions = getFunctions(app);
export const db = getFirestore(app);

// Функция для загрузки файла в Firebase Storage
export async function uploadFileToFirebase(
  file: File,
  folder: string = "documents"
): Promise<string> {
  try {
    // Создаем уникальное имя файла
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}_${file.name}`;

    // Создаем ссылку на файл в Storage
    const storageRef = ref(storage, fileName);

    // Загружаем файл
    const snapshot = await uploadBytes(storageRef, file);

    // Получаем прямой URL из Storage
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Ошибка загрузки файла в Firebase:", error);
    throw error;
  }
}

// Функция для получения URL файла с токеном доступа
export async function getFileURL(filePath: string): Promise<string> {
  try {
    // Проверяем, что путь к паспорту

    // Получаем секретный ключ из переменных окружения
    const secureKey = import.meta.env.VITE_SECURE_KEY;

    if (!secureKey) {
      throw new Error("VITE_SECURE_KEY не установлен в переменных окружения");
    }

    // Используем callable function вместо hardcoded ссылки
    const getPassport = httpsCallable(functions, "getPassport");

    // Создаем безопасный payload с зашифрованным ключом
    const securePayload = createSecurePayload(filePath, secureKey);

    const result = await getPassport(securePayload);

    if (
      result.data &&
      typeof result.data === "object" &&
      "downloadUrl" in result.data
    ) {
      return (result.data as { downloadUrl: string }).downloadUrl;
    } else {
      throw new Error("Invalid response from Cloud Function");
    }

    // Для обычных файлов используем стандартный способ
  } catch (error) {
    console.error("Ошибка получения URL файла:", error);
    throw error;
  }
}
