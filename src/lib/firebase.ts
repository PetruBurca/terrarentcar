import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Конфигурация Firebase для проекта terrarentcar-f1fda
const firebaseConfig = {
  apiKey: "AIzaSyCnH5K4RB7i5RNgDthSK0wPAiM0wTkYnAE",
  authDomain: "terrarentcar-f1fda.firebaseapp.com",
  projectId: "terrarentcar-f1fda",
  storageBucket: "terrarentcar-f1fda.firebasestorage.app",
  messagingSenderId: "114261195759",
  appId: "1:114261195759:web:33356a53fcd35612d2541a"
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
 