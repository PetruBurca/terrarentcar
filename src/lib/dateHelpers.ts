// Helper функции для работы с датами и локализацией

/**
 * Получает соответствующую локаль для toLocaleDateString на основе языка i18n
 */
export function getDateLocale(language: string): string {
  switch (language) {
    case "en":
      return "en-US";
    case "ro":
      return "ro-RO";
    case "ru":
    default:
      return "ru-RU";
  }
}

/**
 * Форматирует дату с учетом текущего языка интерфейса
 */
export function formatLocalizedDate(
  date: Date | string,
  language: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const locale = getDateLocale(language);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
  };

  return dateObj.toLocaleDateString(locale, { ...defaultOptions, ...options });
}

/**
 * Форматирует период дат (от - до) с учетом языка
 */
export function formatDateRange(
  startDate: string,
  endDate: string,
  language: string,
  options?: Intl.DateTimeFormatOptions
): { start: string; end: string } {
  return {
    start: formatLocalizedDate(startDate, language, options),
    end: formatLocalizedDate(endDate, language, options),
  };
}

/**
 * Упрощенная функция для форматирования одной даты
 */
export function formatDate(date: Date | string, language: string): string {
  return formatLocalizedDate(date, language);
}
 