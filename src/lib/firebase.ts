import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    const fileRef = ref(storage, filePath);
    const url = await getDownloadURL(fileRef);
    // Добавляем секретный токен для доступа к фото паспорта
    const secretToken = import.meta.env.VITE_FIREBASE_SECRET_TOKEN;
    return `${url}?token=${secretToken}`;
  } catch (error) {
    console.error("Ошибка получения URL файла:", error);
    throw error;
  }
}
