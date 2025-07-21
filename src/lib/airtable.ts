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
  car?: string;
  startDate?: string;
  endDate?: string;
  comment?: string;
  subject?: string;
  message?: string;
}) {
  const AIRTABLE_ORDERS_TABLE = "Заявки на аренду";
  const fields: Record<string, string | undefined> = {
    "Имя клиента": order.name,
    Телефон: order.phone,
    Email: order.email,
    "Комментарий клиента": order.comment || order.message || "",
    "Статус заявки": "новая",
  };
  if (order.car) fields["Выбранный автомобиль"] = order.car;
  if (order.startDate) fields["Дата начала аренды"] = order.startDate;
  if (order.endDate) fields["Дата окончания аренды"] = order.endDate;

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
  if (!res.ok) throw new Error("Ошибка отправки заявки");
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
