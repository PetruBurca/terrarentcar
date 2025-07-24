# Система кэширования пользовательских данных

## Обзор

Система кэширования сохраняет пользовательские данные в `localStorage` для предотвращения потери информации при перезагрузке страницы или навигации.

## Что кэшируется

### 1. Форма бронирования (`reservation-form`)

- **firstName** - имя
- **lastName** - фамилия
- **email** - email
- **phone** - телефон
- **pickupDate** - дата выдачи
- **returnDate** - дата возврата
- **pickupTime** - время выдачи (по умолчанию "10:00")
- **returnTime** - время возврата
- **message** - сообщение
- **pickupType** - тип получения ("office", "airport", "address")
- **idnp** - IDNP
- **pickupAddress** - адрес доставки
- **unlimitedMileage** - безлимитный пробег
- **goldCard** - золотая карта
- **clubCard** - клубная карта

### 2. Даты поиска (`search-dates`)

- **from** - дата начала поиска
- **to** - дата окончания поиска

### 3. Шаг формы (`reservation-step`)

- Текущий шаг в процессе бронирования (0, 1, 2)

### 4. Загруженные фото (`uploaded-photos`)

- **front** - фото лицевой стороны паспорта
- **back** - фото оборотной стороны паспорта

### 5. Принятие политики (`privacy-accepted`)

- Согласие с политикой конфиденциальности

### 6. Выбранная машина (`selected-car-id`)

- ID выбранной машины для бронирования

### 7. Язык интерфейса (`app-language`)

- Выбранный язык интерфейса (ru, en, ro)

## Хуки

### `useLocalStorage<T>(key, initialValue)`

Базовый хук для работы с localStorage с поддержкой TypeScript.

```typescript
const [value, setValue] = useLocalStorage("my-key", "default");
```

### `useReservationForm()`

Специализированный хук для формы бронирования.

```typescript
const {
  formData,
  setFormData,
  searchDates,
  setSearchDates,
  currentStep,
  setCurrentStep,
  uploadedPhotos,
  setUploadedPhotos,
  privacyAccepted,
  setPrivacyAccepted,
  clearCache,
} = useReservationForm();
```

### `useSelectedCar()`

Хук для работы с выбранной машиной.

```typescript
const { selectedCarId, setSelectedCarId, clearSelectedCar } = useSelectedCar();
```

## Очистка кэша

### Автоматическая очистка

Кэш автоматически очищается после успешной отправки формы бронирования.

### Ручная очистка

В режиме разработки доступна кнопка "Очистить кэш" в правом нижнем углу.

### Программная очистка

```typescript
// Очистка всех данных бронирования
clearCache();

// Очистка выбранной машины
clearSelectedCar();

// Очистка конкретного ключа
localStorage.removeItem("reservation-form");
```

## Безопасность

- Данные хранятся только в браузере пользователя
- При закрытии браузера данные сохраняются
- В режиме инкогнито данные удаляются при закрытии вкладки
- Чувствительные данные (пароли, токены) не кэшируются

## Производительность

- Данные загружаются синхронно при инициализации компонента
- Изменения сохраняются автоматически при каждом обновлении
- Слушатель событий storage синхронизирует данные между вкладками

## Отладка

Для отладки кэширования используйте:

```javascript
// Просмотр всех кэшированных данных
console.log("Все кэшированные данные:", {
  form: localStorage.getItem("reservation-form"),
  dates: localStorage.getItem("search-dates"),
  step: localStorage.getItem("reservation-step"),
  photos: localStorage.getItem("uploaded-photos"),
  privacy: localStorage.getItem("privacy-accepted"),
  car: localStorage.getItem("selected-car-id"),
  language: localStorage.getItem("app-language"),
});

// Очистка всех данных
localStorage.clear();
```

## Совместимость

- Поддерживает все современные браузеры
- Graceful fallback при недоступности localStorage
- TypeScript поддержка
- SSR безопасность (проверка `typeof window`)
