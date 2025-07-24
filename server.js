const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Endpoint для загрузки файлов в Airtable
app.post("/api/upload-to-airtable", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;
    const { airtableBaseId, airtableToken } = req.body;

    if (!file) {
      return res.status(400).json({ error: "Файл не найден" });
    }

    // Создаем FormData для отправки в Airtable
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([file.buffer], { type: file.mimetype }),
      file.originalname
    );

    // Загружаем файл в Airtable
    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/attachments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json({ attachmentId: data.id, success: true });
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
