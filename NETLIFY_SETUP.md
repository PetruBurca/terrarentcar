# Настройка Netlify для TerraRentCar

## Проблемы и решения

### 1. Google Maps не работает

**Проблема**: Google Maps iframe блокируется на Netlify
**Решение**:

- Добавлены CSP заголовки в `netlify.toml`
- Создан fallback компонент с альтернативными вариантами
- Добавлен Google Maps JavaScript API компонент

### 2. Машины не загружаются

**Проблема**: Airtable API переменные окружения не настроены на Netlify
**Решение**: Добавлены переменные окружения в `netlify.toml`

## Текущие настройки

### Переменные окружения в netlify.toml

```toml
[build.environment]
  NODE_VERSION = "18"
  VITE_AIRTABLE_BASE_ID = "app2d5VGYA0UjVj9u"
  VITE_AIRTABLE_TOKEN = "patMiGkMfV2eHj8Bz.93dd90b012b1ce19e00368c03986794b45064f1d7d16bd91a99f38c4889aee8c"
  VITE_FIREBASE_API_KEY = "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg"
  VITE_FIREBASE_AUTH_DOMAIN = "terrarentcar-f1fda.firebaseapp.com"
  VITE_FIREBASE_PROJECT_ID = "terrarentcar-f1fda"
  VITE_FIREBASE_STORAGE_BUCKET = "terrarentcar-f1fda.appspot.com"
  VITE_FIREBASE_MESSAGING_SENDER_ID = "114261195759"
  VITE_FIREBASE_APP_ID = "1:114261195759:web:8b8b8b8b8b8b8b8b8b8b8b8b8"
```

### CSP Заголовки

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src 'self' https://www.google.com https://maps.googleapis.com; connect-src 'self' https://maps.googleapis.com;"
```

## Альтернативная настройка через Netlify Dashboard

Если переменные окружения в `netlify.toml` не работают, настройте их через Netlify Dashboard:

1. Перейдите в [Netlify Dashboard](https://app.netlify.com/)
2. Выберите ваш сайт `terrarentcar`
3. Перейдите в **Site settings** → **Environment variables**
4. Добавьте следующие переменные:

### Airtable

- **Key**: `VITE_AIRTABLE_BASE_ID`
- **Value**: `app2d5VGYA0UjVj9u`

- **Key**: `VITE_AIRTABLE_TOKEN`
- **Value**: `patMiGkMfV2eHj8Bz.93dd90b012b1ce19e00368c03986794b45064f1d7d16bd91a99f38c4889aee8c`

### Firebase

- **Key**: `VITE_FIREBASE_API_KEY`
- **Value**: `AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`

- **Key**: `VITE_FIREBASE_AUTH_DOMAIN`
- **Value**: `terrarentcar-f1fda.firebaseapp.com`

- **Key**: `VITE_FIREBASE_PROJECT_ID`
- **Value**: `terrarentcar-f1fda`

- **Key**: `VITE_FIREBASE_STORAGE_BUCKET`
- **Value**: `terrarentcar-f1fda.appspot.com`

- **Key**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: `114261195759`

- **Key**: `VITE_FIREBASE_APP_ID`
- **Value**: `1:114261195759:web:8b8b8b8b8b8b8b8b8b8b8b8b8`

### Google Maps (опционально)

- **Key**: `VITE_GOOGLE_MAPS_API_KEY`
- **Value**: ваш Google Maps API ключ

## Проверка настроек

### 1. Проверьте деплой

После добавления переменных окружения:

1. Сделайте новый коммит и пуш
2. Проверьте логи деплоя в Netlify Dashboard
3. Убедитесь, что переменные окружения загружаются

### 2. Проверьте работу API

1. Откройте DevTools в браузере
2. Перейдите на вкладку Network
3. Обновите страницу
4. Проверьте запросы к Airtable API

### 3. Проверьте Google Maps

1. Перейдите на страницу контактов
2. Проверьте, загружается ли карта
3. Если нет, попробуйте альтернативные варианты

## Troubleshooting

### Машины все еще не загружаются

1. Проверьте логи в Netlify Dashboard
2. Убедитесь, что переменные окружения установлены
3. Проверьте доступность Airtable API
4. Проверьте CORS настройки

### Google Maps не работает

1. Проверьте CSP заголовки
2. Попробуйте альтернативную карту
3. Настройте Google Maps API ключ

### Ошибки в консоли

1. Проверьте CORS ошибки
2. Проверьте сетевые запросы
3. Убедитесь, что все API доступны

## Безопасность

⚠️ **Важно**: Токены в `netlify.toml` видны в репозитории. Для продакшена рекомендуется:

1. Использовать переменные окружения через Netlify Dashboard
2. Регулярно ротировать API ключи
3. Настроить ограничения доступа в Airtable и Firebase
