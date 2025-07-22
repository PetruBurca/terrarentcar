const AIRTABLE_BASE_ID = "app2zFP3OOvuIAxHq";
const AIRTABLE_TABLE_NAME = "Автомобили (Cars)"; // Имя таблицы в Airtable (точно как в базе)
const AIRTABLE_TOKEN =
  "patKvCVhLU4cB94Gz.bfe322360c9044bfa0994f438f4cd451106309491786577e01eb3c4fe9b3ec26";

interface AirtableImage {
  url: string;
}

interface AirtableCarFields {
  "Название/модель"?: string;
  Категория?: string;
  Рейтинг?: number;
  "Количество мест"?: number;
  "Тип коробки передач"?: string;
  "Тип топлива"?: string;
  "Список опций"?: string[];
  "Цена за день"?: number;
  Описание?: string;
  Статус?: string;
  Фото?: AirtableImage[];
  "Описание рус"?: string;
  "Описание рум"?: string;
  "Описание англ"?: string;
  "Год выпуска"?: string;
  Двигатель?: string;
  Привод?: string;
}

interface AirtableRecord {
  id: string;
  fields: AirtableCarFields;
}

export async function fetchCars() {
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?sort[0][field]=Название/модель&sort[0][direction]=asc`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Ошибка загрузки данных из Airtable");
  const data = await res.json();
  return data.records.map((rec: AirtableRecord) => {
    const fields = rec.fields;
    return {
      id: rec.id,
      name: fields["Название/модель"] || "",
      category: fields["Категория"] || "",
      rating: fields["Рейтинг"] || 0,
      passengers: fields["Количество мест"] || 0,
      transmission: fields["Тип коробки передач"] || "",
      fuel: fields["Тип топлива"] || "",
      features: Array.isArray(fields["Список опций"])
        ? fields["Список опций"]
        : [],
      price: fields["Цена за день"] || 0,
      description: fields["Описание"] || "",
      description_ru: fields["Описание рус"] || "",
      description_ro: fields["Описание рум"] || "",
      description_en: fields["Описание англ"] || "",
      year: fields["Год выпуска"] || "",
      engine: fields["Двигатель"] || "",
      drive: fields["Привод"] || "",
      status: fields["Статус"] || "",
      images: Array.isArray(fields["Фото"])
        ? fields["Фото"].map((img) => img.url)
        : [],
      pricePerDay: fields["Цена за день"] || 0,
      price2to10: fields["Цена за 2-10 дней"] ?? fields["Цена за день"] ?? 0,
      price11to20: fields["Цена за 11-20 дней"] ?? fields["Цена за день"] ?? 0,
      price21to29: fields["Цена за 21-29 дней"] ?? fields["Цена за день"] ?? 0,
      price30plus: fields["Цена от 30 дней"] ?? fields["Цена за день"] ?? 0,
    };
  });
}

export async function createOrder(order: {
  name: string;
  phone: string;
  email: string;
  car?: string | string[];
  startDate?: string;
  endDate?: string;
  comment?: string;
  subject?: string;
  message?: string;
  pickupTime?: string;
  idnp?: string;
  pickupType?: string;
  pickupAddress?: string;
  unlimitedMileage?: boolean;
  goldCard?: boolean;
  clubCard?: boolean;
  idPhotoFront?: File;
  idPhotoBack?: File;
  totalCost?: number;
}) {
  const AIRTABLE_ORDERS_TABLE = "Заявки на аренду";

  // Пока что просто логируем информацию о загруженных фото
  if (order.idPhotoFront) {
    console.log(
      "Фото лицевой стороны получено:",
      order.idPhotoFront.name,
      `(${Math.round(order.idPhotoFront.size / 1024)}KB)`
    );
  }

  if (order.idPhotoBack) {
    console.log(
      "Фото оборотной стороны получено:",
      order.idPhotoBack.name,
      `(${Math.round(order.idPhotoBack.size / 1024)}KB)`
    );
  }

  // Используем точные названия полей как в Airtable
  const fields: Record<string, string | string[] | number | boolean> = {
    "Имя клиента": order.name,
    Телефон: order.phone,
    Email: order.email,
    "Статус заявки": "новая",
  };

  // Отправляем фото документов в правильные поля вложений
  // TODO: Реализовать загрузку фото в будущем

  if (order.car) {
    fields["Выбранный автомобиль"] = Array.isArray(order.car)
      ? order.car
      : [order.car];
  }

  if (order.startDate) {
    fields["Дата начала аренды"] = order.startDate;
  }

  if (order.endDate) {
    fields["Дата окончания аренды"] = order.endDate;
  }

  // Добавляем новые поля с правильными типами
  if (order.pickupTime) {
    fields["Время выдачи"] = order.pickupTime;
  }

  if (order.idnp) {
    fields["IDNP"] = order.idnp;
  }

  // Как забрать машину - используем правильное название поля
  if (order.pickupType) {
    if (order.pickupType === "office") {
      fields["Как забрать машину"] = "Заберу из офиса";
      fields["Тип получения"] = "Офис";
    } else if (order.pickupType === "airport") {
      fields["Как забрать машину"] = "Заберу из аэропорта";
      fields["Тип получения"] = "Аэропорт";
    } else if (order.pickupType === "address") {
      // Для доставки не заполняем "Как забрать машину", но заполняем "Тип получения"
      fields["Тип получения"] = "Доставка";
    }
  }

  if (order.pickupAddress) {
    fields["Доставить по адресу"] = order.pickupAddress;
  }

  // Безлимитный километраж - "Выбор одного варианта": "да" или "не указано"
  if (order.unlimitedMileage === true) {
    fields["Безлимитный километраж"] = "да";
  }

  // Gold карта - Флажок (чекбокс)
  if (order.goldCard === true) {
    fields["Gold карта"] = true;
  }

  // Club карта - Флажок (чекбокс)
  if (order.clubCard === true) {
    fields["Club карта"] = true;
  }

  if (order.totalCost !== undefined) {
    fields["Общая стоимость"] = order.totalCost;
  }

  console.log("=== ДИАГНОСТИКА ОТПРАВКИ ===");
  console.log("Order data:", order);
  console.log("Fields to send:", fields);
  console.log("Fields count:", Object.keys(fields).length);
  console.log("Фото info:", { frontPhotoUrl: "", backPhotoUrl: "" });

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_ORDERS_TABLE}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    }
  );

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Unknown error" }));
    console.error("Airtable API Error:", errorData);
    throw new Error(
      `Ошибка отправки заявки: ${res.status} - ${
        errorData.error?.message || errorData.error || "Неизвестная ошибка"
      }`
    );
  }

  return res.json();
}

interface AirtableOrderFields {
  "Выбранный автомобиль"?: string[]; // Record ID массив
  "Дата начала аренды"?: string;
  "Дата окончания аренды"?: string;
  "Статус заявки"?: string;
}

interface AirtableOrderRecord {
  id: string;
  fields: AirtableOrderFields;
}

// Получение всех заявок на аренду
export async function fetchOrders() {
  const AIRTABLE_ORDERS_TABLE = "Заявки на аренду";

  // Получаем заявки с развернутыми данными автомобилей
  const params = new URLSearchParams();
  params.append("fields[]", "Выбранный автомобиль");
  params.append("fields[]", "Дата начала аренды");
  params.append("fields[]", "Дата окончания аренды");
  params.append("fields[]", "Статус заявки");
  params.append("returnFieldsByFieldId", "false");

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_ORDERS_TABLE}?${params}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Ошибка загрузки заявок из Airtable");
  const data = await res.json();

  console.log("=== DEBUG: fetchOrders data ===");
  console.log("Raw orders from Airtable:", data.records);

  return data.records.map((rec: AirtableOrderRecord) => {
    const fields = rec.fields || {};
    const carIds = fields["Выбранный автомобиль"] || [];

    console.log("Order record:", {
      id: rec.id,
      carIds,
      startDate: fields["Дата начала аренды"],
      endDate: fields["Дата окончания аренды"],
      status: fields["Статус заявки"],
    });

    return {
      id: rec.id,
      carIds: carIds, // Record IDs массив
      startDate: fields["Дата начала аренды"] || "",
      endDate: fields["Дата окончания аренды"] || "",
      status: (fields["Статус заявки"] || "").toLowerCase(),
    };
  });
}
