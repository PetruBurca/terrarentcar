const AIRTABLE_BASE_ID = "app2zFP3OOvuIAxHq";
const AIRTABLE_TABLE_NAME = "Автомобили (Cars)"; // Имя таблицы в Airtable (точно как в базе)
const AIRTABLE_TOKEN =
  "patKvCVhLU4cB94Gz.bfe322360c9044bfa0994f438f4cd451106309491786577e01eb3c4fe9b3ec26";

export async function fetchCars() {
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Ошибка загрузки данных из Airtable");
  const data = await res.json();
  return data.records.map((rec: any) => {
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
      status: fields["Статус"] || "",
      images: Array.isArray(fields["Фото"])
        ? fields["Фото"].map((img: any) => img.url)
        : [],
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
  const fields: Record<string, any> = {
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
