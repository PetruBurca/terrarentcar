# 🚀 Настройка Firestore Database

Этот документ описывает, как автоматически настроить Firestore Database для проекта TerraRentCar.

## 📋 Что будет создано

### 🗂️ Коллекции

- **`cars`** - автомобили для аренды
- **`orders`** - заявки на аренду
- **`contacts`** - контактные формы

### 🔒 Правила безопасности

- Публичный доступ к чтению автомобилей
- Авторизованный доступ к заказам
- Публичное создание контактов, админское чтение

### 📊 Индексы

- Оптимизированные запросы для фильтрации
- Сортировка по датам и статусам

## 🚀 Быстрая настройка

### 1. Установка Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Авторизация в Firebase

```bash
firebase login
```

### 3. Инициализация проекта

```bash
firebase init firestore
```

### 4. Автоматическая настройка коллекций

```bash
npm run setup:firestore
```

### 5. Развертывание правил и индексов

```bash
npm run firebase:deploy
```

## 🔧 Ручная настройка (если автоматическая не работает)

### 1. Создание коллекции cars

```javascript
// В Firebase Console > Firestore > Start collection
Collection ID: cars

// Добавить документ с ID: car-1
{
  "name": "BMW X5",
  "model": "X5 xDrive40i",
  "year": 2023,
  "price": 120,
  "category": "SUV",
  "transmission": "Автомат",
  "fuelType": "Бензин",
  "seats": 5,
  "doors": 5,
  "airConditioning": true,
  "bluetooth": true,
  "navigation": true,
  "images": ["https://example.com/bmw-x5-1.jpg"],
  "available": true,
  "status": "available",
  "description": "Премиальный внедорожник",
  "features": ["Полный привод", "Кожаный салон"],
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

### 2. Создание коллекции orders

```javascript
// Collection ID: orders
{
  "carId": "car-1",
  "carName": "BMW X5",
  "customerName": "Иван Петров",
  "customerEmail": "ivan@example.com",
  "customerPhone": "+37379013014",
  "customerPassport": "123456789",
  "rentFrom": Timestamp.fromDate(new Date("2024-01-15")),
  "rentTo": Timestamp.fromDate(new Date("2024-01-20")),
  "totalDays": 5,
  "totalPrice": 600,
  "status": "completed",
  "documents": {
    "front": "https://example.com/passport-front.jpg",
    "back": "https://example.com/passport-back.jpg"
  },
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

### 3. Создание коллекции contacts

```javascript
// Collection ID: contacts
{
  "name": "Мария Сидорова",
  "email": "maria@example.com",
  "phone": "+37379013015",
  "message": "Интересует аренда автомобиля на выходные",
  "subject": "Вопрос по аренде",
  "createdAt": Timestamp.now()
}
```

## 🔒 Правила безопасности (Firestore Rules)

Скопируйте в Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Коллекция cars - читать всем, писать только админам
    match /cars/{carId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Коллекция orders - читать и писать авторизованным пользователям
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }

    // Коллекция contacts - читать админам, писать всем
    match /contacts/{contactId} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow create: if true;
      allow update, delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 📊 Индексы для оптимизации

Скопируйте в Firebase Console > Firestore > Indexes:

```json
{
  "indexes": [
    {
      "collectionGroup": "cars",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "available", "order": "ASCENDING" },
        { "fieldPath": "name", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "cars",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "name", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "carId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## 🧪 Тестирование

После настройки проверьте:

1. **Коллекция cars** - должна содержать 3 автомобиля
2. **Коллекция orders** - должна содержать 1 заказ
3. **Коллекция contacts** - должна содержать 1 контакт
4. **Правила безопасности** - должны работать корректно

## 🚨 Устранение проблем

### Ошибка "Permission denied"

- Проверьте правила безопасности в Firestore Rules
- Убедитесь, что пользователь авторизован

### Ошибка "Missing or insufficient permissions"

- Проверьте индексы в Firestore Indexes
- Создайте недостающие индексы

### Ошибка "Collection not found"

- Убедитесь, что коллекции созданы
- Проверьте правильность названий коллекций

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи в Firebase Console
2. Убедитесь, что проект правильно настроен
3. Проверьте права доступа к проекту

---

**🎉 Готово!** Теперь ваш Firestore Database полностью настроен для работы с TerraRentCar!
