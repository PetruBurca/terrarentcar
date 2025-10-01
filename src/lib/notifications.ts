import { httpsCallable, getFunctions } from "firebase/functions";
import { getFunctions as getFirebaseFunctions } from "firebase/functions";

// Получаем функции Firebase
const functions = getFirebaseFunctions();

// Функция для отправки уведомления о новой заявке
export async function sendNewRequestNotification(requestData: any) {
  try {
    const sendNotification = httpsCallable(
      functions,
      "sendNewRequestNotification"
    );

    // Получаем список email адресов администраторов из Firebase Functions
    // Функция сама получит актуальный список из базы данных
    const adminEmails = ["kichmg22@gmail.com", "maxdevmessage@gmail.com"]; // Fallback список

    const result = await sendNotification({
      requestData,
      adminEmails,
    });

    return result.data;
  } catch (error) {
    console.error("Ошибка отправки уведомления:", error);
    throw error;
  }
}

// Функция для отправки ответа клиенту
export async function sendRequestResponse(
  requestData: any,
  status: string,
  adminName: string
) {
  try {
    const sendResponse = httpsCallable(functions, "sendRequestResponse");

    const result = await sendResponse({
      requestData,
      status,
      adminName,
    });

    return result.data;
  } catch (error) {
    console.error("Ошибка отправки ответа клиенту:", error);
    throw error;
  }
}
