import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ru, ro, enUS } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocale(lng: string) {
  return lng === "ro" ? ro : lng === "en" ? enUS : ru;
}

// Экспорт криптографических функций
export * from "./cryptoUtils";
export * from "./cryptoExamples";
