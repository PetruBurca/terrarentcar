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
  // Используем точные названия полей как в Airtable
  const fields: Record<string, string | string[] | number | boolean> = {
    "Имя клиента": order.name,
    Телефон: order.phone,
    Email: order.email,
    "Статус заявки": "новая",
  };

  // Добавляем основные поля
  if (order.comment || order.message) {
    fields["Комментарий клиента"] = order.comment || order.message || "";
  }

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

  // Создаем дополнительный комментарий с новыми данными
  const additionalInfo = [];

  if (order.pickupTime) {
    additionalInfo.push(`Время выдачи: ${order.pickupTime}`);
  }

  if (order.idnp) {
    additionalInfo.push(`IDNP: ${order.idnp}`);
  }

  if (order.pickupType) {
    const typeMap = {
      office: "Офис",
      airport: "Аэропорт",
      address: "Доставка",
    };
    const typeName =
      typeMap[order.pickupType as keyof typeof typeMap] || order.pickupType;
    additionalInfo.push(`Тип получения: ${typeName}`);
  }

  if (order.pickupAddress) {
    additionalInfo.push(`Адрес доставки: ${order.pickupAddress}`);
  }

  if (order.unlimitedMileage) {
    additionalInfo.push(`Безлимитный километраж: Да`);
  }

  if (order.goldCard) {
    additionalInfo.push(`Gold карта: Да`);
  }

  if (order.clubCard) {
    additionalInfo.push(`Club карта: Да`);
  }

  if (order.totalCost !== undefined) {
    additionalInfo.push(`Общая стоимость: ${order.totalCost}€`);
  }

  if (order.idPhotoFront || order.idPhotoBack) {
    const uploadedFiles = [];
    if (order.idPhotoFront) uploadedFiles.push("фронт");
    if (order.idPhotoBack) uploadedFiles.push("оборот");
    additionalInfo.push(
      `Загружены фото документов: ${uploadedFiles.join(", ")}`
    );
  }

  // Добавляем все дополнительные данные к комментарию
  if (additionalInfo.length > 0) {
    const existingComment = (fields["Комментарий клиента"] as string) || "";
    const separator = existingComment
      ? "\n\n--- Дополнительная информация ---\n"
      : "";
    fields["Комментарий клиента"] =
      existingComment + separator + additionalInfo.join("\n");
  }

  console.log("Отправляемые данные в Airtable:", { fields });

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
  "Выбранный автомобиль"?: string;
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
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_ORDERS_TABLE}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Ошибка загрузки заявок из Airtable");
  const data = await res.json();
  return data.records.map((rec: AirtableOrderRecord) => {
    const fields = rec.fields || {};
    return {
      id: rec.id,
      car: fields["Выбранный автомобиль"] || "",
      startDate: fields["Дата начала аренды"] || "",
      endDate: fields["Дата окончания аренды"] || "",
      status: (fields["Статус заявки"] || "").toLowerCase(),
    };
  });
}
