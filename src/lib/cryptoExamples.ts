import {
  generateSHA256Hash,
  verifyHash,
  generateSecureKey,
  createSecurePayload,
} from "./cryptoUtils";

/**
 * Примеры использования криптографических функций
 */

// Пример 1: Генерация SHA-256 хеша
export function exampleSHA256Hash() {
  const originalText = "terrarentcar-secure-2024";
  const hashedText = generateSHA256Hash(originalText);


  return { originalText, hashedText };
}

// Пример 2: Проверка хеша
export function exampleHashVerification() {
  const originalKey = "terrarentcar-secure-2024";
  const correctHash = generateSHA256Hash(originalKey);
  const wrongHash = "wrong-hash-value";

  const isCorrectHash = verifyHash(correctHash, originalKey);
  const isWrongHash = verifyHash(wrongHash, originalKey);


  return { isCorrectHash, isWrongHash };
}

// Пример 3: Создание безопасного payload для API
export function exampleSecurePayload() {
  const fileId =
    "passport-front/1754928149216_Снимок экрана 2025-08-11 в 17.49.45.png";
  const originalKey = "terrarentcar-secure-2024";

  const securePayload = createSecurePayload(fileId, originalKey);

  // Результат:
  // {
  //   id: "passport-front/1754928149216_Снимок экрана 2025-08-11 в 17.49.45.png",
  //   key: "зашифрованный_хеш_ключа"
  // }

  return securePayload;
}

// Пример 4: Сравнение оригинального и зашифрованного ключа
export function exampleKeyComparison() {
  const originalKey = "terrarentcar-secure-2024";
  const encryptedKey = generateSecureKey(originalKey);


  // Проверяем, что зашифрованный ключ действительно соответствует оригинальному
  const isValid = verifyHash(encryptedKey, originalKey);

  return { originalKey, encryptedKey, isValid };
}

// Функция для запуска всех примеров
export function runAllExamples() {

  exampleSHA256Hash();

  exampleHashVerification();

  exampleSecurePayload();

  exampleKeyComparison();

}
