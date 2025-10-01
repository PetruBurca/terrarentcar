import type { TFunction } from "i18next";

// Маппинг значений из БД к ключам локализации
const transmissionMap: Record<string, string> = {
  Автомат: "automatic",
  Механика: "manual",
  Робот: "robot",
  Вариатор: "variator",
  Automatic: "automatic",
  Manual: "manual",
  Robot: "robot",
  CVT: "variator",
  Automată: "automatic",
  Manuală: "manual",
  Robotizată: "robot",
  Variator: "variator",
  // Добавляем маппинг для английских ключей из базы данных
  automatic: "automatic",
  manual: "manual",
  robot: "robot",
  variator: "variator",
  cvt: "variator",
};

const fuelMap: Record<string, string> = {
  Бензин: "petrol",
  Дизель: "diesel",
  Электро: "electric",
  Гибрид: "hybrid",
  Petrol: "petrol",
  Diesel: "diesel",
  Electric: "electric",
  Hybrid: "hybrid",
  Benzină: "petrol",
  Motorină: "diesel",
  Hibrid: "hybrid",
  // Добавляем маппинг для английских ключей из базы данных
  petrol: "petrol",
  diesel: "diesel",
  electric: "electric",
  hybrid: "hybrid",
};

const driveMap: Record<string, string> = {
  Передний: "front",
  Задний: "rear",
  Полный: "awd",
  AWD: "awd",
  "4WD": "4wd",
  Front: "front",
  Rear: "rear",
  Față: "front",
  Spate: "rear",
  Integrală: "awd",
  // Добавляем маппинг для английских ключей из базы данных
  front: "front",
  rear: "rear",
  awd: "awd",
  "4wd": "4wd",
};

const featureMap: Record<string, string> = {
  "GPS навигация": "gps",
  "GPS navigation": "gps",
  "Navigație GPS": "gps",
  Bluetooth: "bluetooth",
  Кондиционер: "ac",
  "Air conditioning": "ac",
  "Aer condiționat": "ac",
  "Камера заднего вида": "rearCamera",
  "Rear camera": "rearCamera",
  "Cameră spate": "rearCamera",
  "Круиз-контроль": "cruise",
  "Cruise control": "cruise",
  "Подогрев сидений": "seatHeating",
  "Seat heating": "seatHeating",
  "Încălzire scaune": "seatHeating",
  "Подогрев руля": "steeringWheelHeating",
  "Steering wheel heating": "steeringWheelHeating",
  "Încălzire volan": "steeringWheelHeating",
  Парктроник: "parktronic",
  Парктроники: "parktronic",
  Практроники: "parktronic",
  Parktronic: "parktronic",
  "Климат-контроль": "climateControl",
  "Climate control": "climateControl",
  Climatizare: "climateControl",
  "LED фары": "led",
  "LED headlights": "led",
  "Faruri LED": "led",
  "Кожаные сиденья": "leatherSeats",
  "Leather seats": "leatherSeats",
  "Scaune din piele": "leatherSeats",
};

const categoryMap: Record<string, string> = {
  Седан: "sedan",
  Sedan: "sedan",
  Внедорожник: "suv",
  SUV: "suv",
  Хэтчбэк: "hatchback",
  Hatchback: "hatchback",
  Универсал: "wagon",
  Wagon: "wagon",
  Break: "wagon",
  Кроссовер: "crossover",
  Crossover: "crossover",
  Купе: "coupe",
  Coupe: "coupe",
  Кабриолет: "convertible",
  Convertible: "convertible",
  Convertibil: "convertible",
  Пикап: "pickup",
  Pickup: "pickup",
};

// Функция для перевода коробки передач
export function translateTransmission(value: string, t: TFunction): string {
  // console.log(`=== DEBUG: translateTransmission ===`);
  // console.log(`Входящее значение: "${value}"`);
  // console.log(
  //   `Доступные ключи в transmissionMap:`,
  //   Object.keys(transmissionMap)
  // );

  const key = transmissionMap[value];
  // console.log(`Найденный ключ: "${key}"`);

  if (key) {
    const translated = t(`cars.transmission.${key}`);
    // console.log(`Переведенное значение: "${translated}"`);
    return translated;
  } else {
    // console.log(`Ключ не найден, возвращаем исходное значение: "${value}"`);
    return value;
  }
}

// Функция для перевода типа топлива
export function translateFuel(value: string, t: TFunction): string {
  const key = fuelMap[value];
  return key ? t(`cars.fuel.${key}`) : value;
}

// Функция для перевода привода
export function translateDrive(value: string, t: TFunction): string {
  const key = driveMap[value];
  return key ? t(`cars.drive.${key}`) : value;
}

// Функция для перевода опций/особенностей
export function translateFeature(value: string, t: TFunction): string {
  const key = featureMap[value];
  return key ? t(`cars.features.${key}`) : value;
}

// Функция для перевода категорий
export function translateCategory(value: string, t: TFunction): string {
  const key = categoryMap[value];
  return key ? t(`cars.category.${key}`) : value;
}

// Универсальная функция для перевода любой характеристики автомобиля
export function translateCarSpec(
  type: "transmission" | "fuel" | "drive" | "feature" | "category",
  value: string,
  t: TFunction
): string {
  switch (type) {
    case "transmission":
      return translateTransmission(value, t);
    case "fuel":
      return translateFuel(value, t);
    case "drive":
      return translateDrive(value, t);
    case "feature":
      return translateFeature(value, t);
    case "category":
      return translateCategory(value, t);
    default:
      return value;
  }
}
