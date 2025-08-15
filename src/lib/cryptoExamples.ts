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

  // console.log("Оригинальный текст:", originalText);
  // console.log("SHA-256 хеш:", hashedText);

  return { originalText, hashedText };
}

// Пример 2: Проверка хеша
export function exampleHashVerification() {
  const originalKey = "terrarentcar-secure-2024";
  const correctHash = generateSHA256Hash(originalKey);
  const wrongHash = "wrong-hash-value";

  const isCorrectHash = verifyHash(correctHash, originalKey);
  const isWrongHash = verifyHash(wrongHash, originalKey);

  // console.log("Правильный хеш:", isCorrectHash); // true
  // console.log("Неправильный хеш:", isWrongHash); // false

  return { isCorrectHash, isWrongHash };
}

// Пример 3: Создание безопасного payload для API
export function exampleSecurePayload() {
  const fileId =
    "passport-front/1754928149216_Снимок экрана 2025-08-11 в 17.49.45.png";
  const originalKey = "terrarentcar-secure-2024";

  const securePayload = createSecurePayload(fileId, originalKey);

  // console.log("Безопасный payload:", securePayload);
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

  // console.log("Оригинальный ключ:", originalKey);
  // console.log("Зашифрованный ключ:", encryptedKey);
  // console.log("Длина зашифрованного ключа:", encryptedKey.length);

  // Проверяем, что зашифрованный ключ действительно соответствует оригинальному
  const isValid = verifyHash(encryptedKey, originalKey);
  // console.log("Ключ валиден:", isValid); // true

  return { originalKey, encryptedKey, isValid };
}

// Функция для запуска всех примеров
export function runAllExamples() {
  // console.log("=== Примеры криптографических функций ===\n");

  // console.log("1. Генерация SHA-256 хеша:");
  exampleSHA256Hash();
  // console.log();

  // console.log("2. Проверка хеша:");
  exampleHashVerification();
  // console.log();

  // console.log("3. Создание безопасного payload:");
  exampleSecurePayload();
  // console.log();

  // console.log("4. Сравнение ключей:");
  exampleKeyComparison();
  // console.log();

  // console.log("=== Все примеры выполнены ===");
}
