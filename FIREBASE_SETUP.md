# 🔥 Настройка Firebase для загрузки фото

## Шаг 1: Создание проекта Firebase

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите **Firebase Storage** в разделе "Storage"

## Шаг 2: Настройка Storage

1. В Firebase Console перейдите в **Storage**
2. Нажмите **"Get started"**
3. Выберите правила безопасности:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true; // Для разработки
       }
     }
   }
   ```
4. Выберите регион (например, `us-central1`)

## Шаг 3: Получение конфигурации

1. В Firebase Console перейдите в **Project Settings** (⚙️)
2. Прокрутите до раздела **"Your apps"**
3. Нажмите **"Add app"** → **Web app**
4. Скопируйте конфигурацию:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};
```

## Шаг 4: Обновление конфигурации

Замените конфигурацию в `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "ВАША_API_KEY",
  authDomain: "ВАШ_ПРОЕКТ.firebaseapp.com",
  projectId: "ВАШ_PROJECT_ID",
  storageBucket: "ВАШ_ПРОЕКТ.appspot.com",
  messagingSenderId: "ВАШ_SENDER_ID",
  appId: "ВАШ_APP_ID",
};
```

## Шаг 5: Настройка CORS (опционально)

Если возникнут проблемы с CORS, добавьте в Firebase Storage:

```bash
gsutil cors set cors.json gs://YOUR_BUCKET_NAME
```

Создайте файл `cors.json`:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

## Шаг 6: Тестирование

1. Запустите приложение: `npm run dev`
2. Откройте форму бронирования
3. Загрузите фото в шаге 3
4. Проверьте консоль браузера:
   ```
   Загружаем фото лицевой стороны в Firebase...
   Файл загружен в Firebase: documents/1234567890_front.jpg
   URL файла: https://firebasestorage.googleapis.com/...
   Фото лицевой стороны загружено: https://firebasestorage.googleapis.com/...
   ```

## Шаг 7: Проверка в Airtable

1. Откройте таблицу "Заявки на аренду"
2. Найдите новую заявку
3. В полях "Фото документа (фронт)" и "Фото документа (оборот)" должны быть URL Firebase

## Преимущества Firebase Storage:

✅ **Нет проблем с CORS** - Firebase разрешает запросы с любого домена  
✅ **Надежное хранение** - файлы хранятся в Google Cloud  
✅ **Быстрая загрузка** - CDN по всему миру  
✅ **Бесплатный тариф** - 5GB хранилища бесплатно  
✅ **Простая интеграция** - готовые SDK для JavaScript

## Безопасность:

Для продакшена измените правила Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Мониторинг:

В Firebase Console → Storage вы увидите:

- Загруженные файлы
- Использованное место
- Статистику загрузок
