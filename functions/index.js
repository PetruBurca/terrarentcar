import { HttpsError, onCall } from "firebase-functions/v2/https";
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import CryptoJS from "crypto-js";
import NodeRSA from "node-rsa";

initializeApp();

// Функция для генерации SHA-256 хеша
function generateSHA256Hash(data) {
  return CryptoJS.SHA256(data).toString();
}

// Функция для RSA шифрования
function encryptWithRSA(data, publicKey) {
  try {
    const key = new NodeRSA(publicKey);
    key.setOptions({ encryptionScheme: "pkcs1" });
    return key.encrypt(data, "base64");
  } catch (error) {
    console.error("RSA encryption error:", error);
    throw new HttpsError("internal", "Encryption failed");
  }
}

// Функция для проверки зашифрованного ключа
function verifyEncryptedKey(encryptedKey, originalKey) {
  try {
    // Генерируем SHA-256 хеш от оригинального ключа
    const hashedKey = generateSHA256Hash(originalKey);

    // Сравниваем с зашифрованным ключом
    return encryptedKey === hashedKey;
  } catch (error) {
    console.error("Key verification error:", error);
    return false;
  }
}

export const getPassport = onCall(async (request) => {
  const { id, key } = request.data;

  if (!id || !key) {
    throw new HttpsError("aborted", "Parameters not defined");
  }

  // Проверка секретного ключа с использованием шифрования
  const secretKey = process.env.SECURE_KEY;
  if (!secretKey) {
    throw new HttpsError("internal", "Secure key not configured");
  }

  // Проверяем ключ с использованием SHA-256 хеширования
  const isKeyValid = verifyEncryptedKey(key, secretKey);
  if (!isKeyValid) {
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

// Новая функция для генерации зашифрованного ключа (для клиентской стороны)
export const generateSecureKey = onCall(async (request) => {
  const { originalKey } = request.data;

  if (!originalKey) {
    throw new HttpsError("aborted", "Original key not provided");
  }

  try {
    // Генерируем SHA-256 хеш от оригинального ключа
    const hashedKey = generateSHA256Hash(originalKey);

    return {
      success: true,
      encryptedKey: hashedKey,
      algorithm: "SHA-256",
    };
  } catch (error) {
    console.error("Key generation error:", error);
    throw new HttpsError("internal", "Failed to generate secure key");
  }
});
