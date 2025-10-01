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
  apiKey: "AIzaSyCnH5K4RB7i5RNgDthSK0wPAiM0wTkYnAE",
  authDomain: "terrarentcar-f1fda.firebaseapp.com",
  projectId: "terrarentcar-f1fda",
  storageBucket: "terrarentcar-f1fda.firebasestorage.app",
  messagingSenderId: "114261195759",
  appId: "1:114261195759:web:33356a53fcd35612d2541a",
  // measurementId: "G-9D32Y58JV2", // Убрано - у клиента нет Google Analytics
};

// Проверяем наличие обязательных переменных окружения
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId
) {
  throw new Error(
    "Не все обязательные переменные Firebase не установлены в переменных окружения"
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

    // Отладочная информация
    const secureKey = import.meta.env.VITE_FIREBASE_SECRET_TOKEN;
    // console.log({
    //   secureKey,
    //   secureKeyLength: secureKey?.length,
    //   secureKeyType: typeof secureKey,
    //   isUndefined: secureKey === undefined,
    //   isEmpty: secureKey === "",
    //   envVars: Object.keys(import.meta.env).filter((key) =>
    //     key.startsWith("VITE_")
    //   ),
    // });

    if (!secureKey) {
      throw new Error(
        "VITE_FIREBASE_SECRET_TOKEN не установлен в переменных окружения"
      );
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
