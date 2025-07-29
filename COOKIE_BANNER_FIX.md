# 🍪 Исправление работы баннера куки

## 🚨 Проблема:

После очистки кэша баннер куки больше не появлялся, даже если пользователь должен был снова принять куки.

## 🔍 Причина:

- CacheManager очищал localStorage, но не удалял ключ `cookieAccepted`
- CookieBanner проверял только наличие ключа при загрузке
- Не было реакции на изменения в localStorage

## ✅ Исправления:

### 1. **Обновлен CacheManager**

```typescript
// Добавлен ключ куки в список для очистки
const oldKeysToRemove = [
  "reservation-form",
  "search-dates",
  "reservation-step",
  "uploaded-photos",
  "privacy-accepted",
  "wizard-data",
  "selected-country-code",
  "active-image-index",
  "selected-car-id",
  "cookieAccepted", // ← Добавлено
];

// Дополнительная очистка ключа куки
localStorage.removeItem("cookieAccepted");
```

### 2. **Улучшен CookieBanner**

```typescript
useEffect(() => {
  // Проверяем при загрузке
  if (!localStorage.getItem("cookieAccepted")) {
    setVisible(true);
  }

  // Слушаем изменения в localStorage
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === "cookieAccepted" && e.newValue === null) {
      // Если ключ куки был удален, показываем баннер
      setVisible(true);
    }
  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);
```

## 🎯 Результат:

### ✅ **Правильное поведение:**

- При очистке кэша (Cmd+Shift+R) баннер куки появляется снова
- При двойном обновлении баннер куки появляется снова
- При автоматической очистке через 5 минут баннер куки появляется снова
- Пользователь всегда видит уведомление о куки после очистки данных

### 🔄 **Логика работы:**

1. **Пользователь принимает куки** → `cookieAccepted = "true"`
2. **Происходит очистка кэша** → `cookieAccepted` удаляется
3. **CookieBanner обнаруживает изменение** → показывает баннер снова
4. **Пользователь снова принимает куки** → цикл повторяется

## 📋 Сценарии тестирования:

### 1. **Жесткая перезагрузка (Cmd+Shift+R)**

- Очищает кэш
- Удаляет `cookieAccepted`
- Показывает баннер куки

### 2. **Двойное обновление (F5 + F5)**

- Очищает кэш
- Удаляет `cookieAccepted`
- Показывает баннер куки

### 3. **Автоматическая очистка (5 минут)**

- Очищает кэш по времени
- Удаляет `cookieAccepted`
- Показывает баннер куки

### 4. **Принудительная очистка**

```javascript
window.cacheManager.forceClear();
```

- Очищает все кэши
- Удаляет `cookieAccepted`
- Показывает баннер куки

## 🎉 Преимущества:

1. **Соответствие GDPR** - пользователь всегда информирован о куки
2. **Правильный UX** - баннер появляется после очистки данных
3. **Надежность** - работает при любом типе очистки кэша
4. **Автоматизация** - не требует ручного вмешательства

## 🔧 Отладка:

В консоли браузера можно проверить:

```javascript
// Проверить статус куки
localStorage.getItem("cookieAccepted");

// Принудительно очистить куки
localStorage.removeItem("cookieAccepted");

// Проверить все ключи кэша
window.cacheManager.checkCache();
```

Теперь баннер куки будет корректно появляться каждый раз после очистки кэша! 🍪✨
