import { initializeApp } from "firebase/app";
import { httpsCallable, getFunctions } from "firebase/functions";
import { getStorage, ref, uploadBytes } from "firebase/storage";
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
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const functions = getFunctions(app);
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

    // Получаем URL для скачивания
    const downloadURL = await getFileURL(fileName);

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
    const secureKey = import.meta.env.VITE_SECURE_KEY || import.meta.env.VITE_FIREBASE_SECRET_TOKEN;
    console.log('🔍 Отладка SECURE_KEY:', {
      secureKey,
      secureKeyLength: secureKey?.length,
      secureKeyType: typeof secureKey,
      isUndefined: secureKey === undefined,
      isEmpty: secureKey === '',
      envVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
    });

    if (!secureKey) {
      throw new Error('VITE_SECURE_KEY не установлен в переменных окружения');
    }

    // Используем callable function вместо hardcoded ссылки
    const getPassport = httpsCallable(functions, "getPassport");
    
    // Создаем безопасный payload с зашифрованным ключом
    const securePayload = createSecurePayload(
      filePath,
      secureKey
    );
    
    console.log('📤 Отправляемый payload:', securePayload);
    
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
