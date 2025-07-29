// Тест для проверки структуры Airtable
const AIRTABLE_BASE_ID = "app2d5VGYA0UjVj9u";
const AIRTABLE_TOKEN =
  "patMiGkMfV2eHj8Bz.93dd90b012b1ce19e00368c03986794b45064f1d7d16bd91a99f38c4889aee8c";

// Функция для получения метаданных базы
async function getBaseMetadata() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Структура базы данных:");
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("Ошибка получения метаданных:", error);
  }
}

// Функция для получения данных из таблицы
async function getTableData(tableName) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}?maxRecords=3`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`\nДанные из таблицы "${tableName}":`);
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error(`Ошибка получения данных из ${tableName}:`, error);
  }
}

// Запуск проверки
async function checkAirtableStructure() {
  console.log("🔍 Проверка структуры Airtable...\n");

  // Получаем метаданные
  await getBaseMetadata();

  // Проверяем основные таблицы
  await getTableData("Автомобили (Cars)");
  await getTableData("Заявки на аренду");
  await getTableData("Заявки на связь");
}

// Запускаем проверку
checkAirtableStructure();
