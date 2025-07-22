import { TFunction } from "react-i18next";

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
  Electric: "electric",
  Hibrid: "hybrid",
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

// Функция для перевода коробки передач
export function translateTransmission(value: string, t: TFunction): string {
  const key = transmissionMap[value];
  return key ? t(`cars.transmission.${key}`) : value;
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

// Универсальная функция для перевода любой характеристики автомобиля
export function translateCarSpec(
  type: "transmission" | "fuel" | "drive" | "feature",
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
    default:
      return value;
  }
}
