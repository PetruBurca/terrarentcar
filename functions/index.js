import { HttpsError, onCall } from "firebase-functions/v2/https";
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

initializeApp()

export const getPassport = onCall(async (request) => {
  const { id, key } = request.data;

  if (!id || !key) {
    throw new HttpsError("aborted", "Parameters not defined");
  }

  // Проверка секретного ключа
  const secretKey = process.env.SECURE_KEY;
  if (key !== secretKey) {
    throw new HttpsError("aborted", "Invalid access key");
  }

  // Проверка, что путь файла безопасный (только папки passport)
  if (!id.startsWith("passport-front/") && !id.startsWith("passport-back/")) {
    throw new HttpsError("aborted", "Access denied to this folder");
  }

  const bucket = admin.storage().bucket();
  const file = bucket.file(id);

  // Проверка существования файла
  const [exists] = await file.exists();
  if (!exists) {
    return res.status(404).json({
      error: "File not found",
    });
  }

  // Генерация подписанной ссылки с истечением через 5 дней
  const fiveDaysFromNow = new Date();
  fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

  const [signedUrl] = await file.getSignedUrl({
    action: "read",
    expires: fiveDaysFromNow,
    version: "v4",
  });

  return {
    success: true,
    downloadUrl: signedUrl,
    expiresAt: fiveDaysFromNow.toISOString(),
    fileName: id,
  };
});
