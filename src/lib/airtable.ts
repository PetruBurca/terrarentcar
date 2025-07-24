const AIRTABLE_BASE_ID = "app2zFP3OOvuIAxHq";
const AIRTABLE_TABLE_NAME = "Автомобили (Cars)"; // Имя таблицы в Airtable (точно как в базе)
const AIRTABLE_CONTACT_TABLE = "Заявки на связь"; // Новая таблица для контактных форм
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

// Функция для загрузки файла в Airtable
async function uploadFileToAirtable(file: File): Promise<string> {
  try {
    // Создаем FormData для загрузки файла
    const formData = new FormData();
    formData.append("file", file);

    // Загружаем файл в Airtable
    const uploadResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/attachments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Airtable upload error response:", errorText);
      throw new Error(
        `Ошибка загрузки файла: ${uploadResponse.status} - ${uploadResponse.statusText}`
      );
    }

    const uploadData = await uploadResponse.json();
    console.log("Файл успешно загружен в Airtable:", uploadData);
    return uploadData.id; // Возвращаем ID загруженного файла
  } catch (error) {
    console.error("Ошибка загрузки файла в Airtable:", error);
    throw error;
  }
}

// Альтернативная функция для загрузки через промежуточный сервер
async function uploadFileViaServer(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("airtableBaseId", AIRTABLE_BASE_ID);
    formData.append("airtableToken", AIRTABLE_TOKEN);

    // Здесь нужно будет настроить ваш сервер для обработки загрузки
    const response = await fetch("/api/upload-to-airtable", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ошибка загрузки через сервер: ${response.statusText}`);
    }

    const data = await response.json();
    return data.attachmentId;
  } catch (error) {
    console.error("Ошибка загрузки через сервер:", error);
    throw error;
  }
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

  // Загружаем фото документов в Airtable через промежуточный сервер
  try {
    if (order.idPhotoFront) {
      console.log("Загружаем фото лицевой стороны...");
      const frontPhotoId = await uploadFileViaServer(order.idPhotoFront);
      fields["Фото документа (фронт)"] = [frontPhotoId];
      console.log("Фото лицевой стороны загружено:", frontPhotoId);
    }

    if (order.idPhotoBack) {
      console.log("Загружаем фото оборотной стороны...");
      const backPhotoId = await uploadFileViaServer(order.idPhotoBack);
      fields["Фото документа (оборот)"] = [backPhotoId];
      console.log("Фото оборотной стороны загружено:", backPhotoId);
    }
  } catch (error) {
    console.error("Ошибка загрузки фото:", error);
    // Продолжаем отправку заявки даже если фото не загрузились
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
  "Фото документа (фронт)"?: string[]; // Attachment IDs
  "Фото документа (оборот)"?: string[]; // Attachment IDs
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

// Функция для создания заявки на связь
export async function createContactRequest({
  fullName,
  email,
  phone,
  message,
}: {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}) {
  console.log("=== DEBUG: Creating contact request ===");
  console.log({ fullName, email, phone, message });

  const body = {
    fields: {
      "Полное имя": fullName,
      Email: email,
      Телефон: phone,
      Сообщение: message,
      "Дата создания": new Date().toISOString().split("T")[0], // YYYY-MM-DD формат
    },
  };

  console.log("Request body:", JSON.stringify(body, null, 2));

  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_CONTACT_TABLE}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Airtable contact error:", errorText);
    throw new Error(`Ошибка отправки заявки: ${response.status}`);
  }

  const result = await response.json();
  console.log("Contact request created:", result);
  return result;
}
