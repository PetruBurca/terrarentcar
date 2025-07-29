# 🚀 Система кэширования Terra Rent Car

## 📊 Обзор

Новая система кэширования обеспечивает оптимальный баланс между производительностью и актуальностью данных.

## ⚡ Основные возможности

### 1. **Автоматическая очистка через 5 минут**

- Все кэши автоматически очищаются через 5 минут после посещения
- Включает React Query, localStorage и Service Worker кэши

### 2. **Сброс при двойном обновлении**

- Двойное нажатие F5 или Ctrl+R очищает все кэши
- Полезно для принудительного обновления данных

### 3. **Умное управление кэшем**

- Отслеживание времени последнего посещения
- Проверка актуальности данных при загрузке
- Селективная очистка разных типов кэша

## 🔧 Компоненты системы

### CacheManager

```typescript
<CacheManager
  autoClearTime={5 * 60 * 1000} // 5 минут
  enableDoubleRefresh={true}
  showDebugInfo={process.env.NODE_ENV === "development"}
/>
```

### useCacheManager Hook

```typescript
const {
  clearAllCache, // Очистить все кэши
  clearQueryCache, // Очистить только React Query
  clearLocalStorage, // Очистить только localStorage
  getTimeSinceLastVisit, // Время с последнего посещения
  shouldClearCacheByTime, // Нужно ли очистить по времени
} = useCacheManager({
  autoClearTime: 5 * 60 * 1000,
  enableDoubleRefresh: true,
});
```

## 📈 Настройки кэширования

### React Query

```typescript
{
  staleTime: 1000 * 60 * 3, // 3 минуты - данные считаются свежими
  gcTime: 1000 * 60 * 5,    // 5 минут - удаление из кэша
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
}
```

### Service Worker

```typescript
const CACHE_LIFETIME = 5 * 60 * 1000; // 5 минут
const CACHE_NAME = "terra-rent-car-v2";
```

### LocalStorage

Очищаемые ключи:

- `reservation-form`
- `search-dates`
- `reservation-step`
- `uploaded-photos`
- `privacy-accepted`
- `wizard-data`
- `selected-country-code`
- `active-image-index`
- `selected-car-id`

## 🛠️ Отладка (только в development)

В режиме разработки доступны глобальные функции:

```javascript
// В консоли браузера
window.cacheManager.clearAll(); // Очистить все кэши
window.cacheManager.clearQuery(); // Очистить React Query
window.cacheManager.clearStorage(); // Очистить localStorage
window.cacheManager.getTimeSinceLastVisit(); // Время с последнего посещения
```

## 📊 Логирование

Система ведет подробные логи:

```
🧹 Очистка всех кэшей...
✅ React Query кэш очищен
✅ LocalStorage очищен
✅ Кэши очищены
🕐 Прошло 7 минут с последнего посещения, очищаем кэш
```

## 🎯 Преимущества новой системы

1. **Автоматическая очистка** - не нужно вручную очищать кэш
2. **Быстрый сброс** - двойное обновление для принудительной очистки
3. **Умное управление** - разные типы кэша очищаются по-разному
4. **Отладка** - удобные инструменты для разработки
5. **Производительность** - оптимальный баланс скорости и актуальности

## 🔄 Жизненный цикл кэша

1. **Посещение сайта** → Установка таймера на 5 минут
2. **5 минут прошло** → Автоматическая очистка всех кэшей
3. **Двойное обновление** → Мгновенная очистка всех кэшей
4. **Новое посещение** → Сброс таймера, начало нового цикла

## 🚨 Важные моменты

- Кэш очищается только если прошло больше 5 минут И меньше 24 часов
- Service Worker кэш обновляется при изменении версии
- В production режиме отладочные функции недоступны
- LocalStorage очищается только для ключей приложения

## 📝 Примеры использования

### Очистка кэша программно

```typescript
import { useCacheManager } from "@/hooks/use-cache-manager";

const MyComponent = () => {
  const { clearAllCache } = useCacheManager();

  const handleRefresh = () => {
    clearAllCache();
    window.location.reload();
  };

  return <button onClick={handleRefresh}>Обновить данные</button>;
};
```

### Проверка времени с последнего посещения

```typescript
const { getTimeSinceLastVisit } = useCacheManager();
const timeSinceLastVisit = getTimeSinceLastVisit();
console.log(`Прошло ${Math.round(timeSinceLastVisit / 1000 / 60)} минут`);
```
