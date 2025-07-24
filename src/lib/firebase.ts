import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Конфигурация Firebase для проекта rentcar-26887
const firebaseConfig = {
  apiKey: "AIzaSyA1VhdOVc_Y74p5P6oXanhGQJ2iHerbjXw",
  authDomain: "rentcar-26887.firebaseapp.com",
  projectId: "rentcar-26887",
  storageBucket: "rentcar-26887.firebasestorage.app",
  messagingSenderId: "693113667561",
  appId: "1:693113667561:web:bc735d6fa3818fde001578",
  measurementId: "G-9D32Y58JV2",
};

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

// Функция для получения URL файла по ссылке
export async function getFileURL(filePath: string): Promise<string> {
  try {
    const fileRef = ref(storage, filePath);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("Ошибка получения URL файла:", error);
    throw error;
  }
}
