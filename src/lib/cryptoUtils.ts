import CryptoJS from "crypto-js";

/**
 * Генерирует SHA-256 хеш от переданной строки
 * @param data - строка для хеширования
 * @returns SHA-256 хеш в виде строки
 */
export function generateSHA256Hash(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

/**
 * Проверяет, соответствует ли хеш оригинальной строке
 * @param hash - хеш для проверки
 * @param originalData - оригинальная строка
 * @returns true если хеш соответствует, false в противном случае
 */
export function verifyHash(hash: string, originalData: string): boolean {
  const generatedHash = generateSHA256Hash(originalData);
  return hash === generatedHash;
}

/**
 * Генерирует зашифрованный ключ для отправки на сервер
 * @param originalKey - оригинальный ключ
 * @returns зашифрованный ключ
 */
export function generateSecureKey(originalKey: string): string {
  return generateSHA256Hash(originalKey);
}

/**
 * Создает объект payload с зашифрованным ключом
 * @param id - идентификатор файла
 * @param originalKey - оригинальный ключ
 * @returns объект payload с зашифрованным ключом
 */
export function createSecurePayload(id: string, originalKey: string) {
  return {
    id,
    key: generateSecureKey(originalKey),
  };
}
