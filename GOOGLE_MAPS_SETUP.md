# Настройка Google Maps для Netlify

## Проблема

Google Maps iframe не работает на Netlify из-за Content Security Policy (CSP) и ограничений домена.

## Решения

### 1. CSP Заголовки (Уже настроено)

В `netlify.toml` добавлены CSP заголовки для разрешения Google Maps:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src 'self' https://www.google.com https://maps.googleapis.com; connect-src 'self' https://maps.googleapis.com;"
```

### 2. Google Maps API Ключ (Рекомендуется)

#### Шаг 1: Получите API ключ

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google Maps JavaScript API
4. Создайте API ключ в разделе "Credentials"

#### Шаг 2: Настройте ограничения домена

В настройках API ключа добавьте:

- **HTTP referrers (web sites)**: `*.netlify.app/*`
- **HTTP referrers (web sites)**: `localhost:8080/*` (для разработки)

#### Шаг 3: Добавьте переменную окружения

Создайте файл `.env` в корне проекта:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

#### Шаг 4: Настройте Netlify

В настройках Netlify добавьте переменную окружения:

- **Key**: `VITE_GOOGLE_MAPS_API_KEY`
- **Value**: ваш API ключ

### 3. Альтернативные решения

#### Fallback компонент

Если Google Maps не загружается, пользователь увидит:

1. Сообщение об ошибке
2. Кнопку для открытия в Google Maps
3. Альтернативную карту с контактной информацией

#### Google Maps JavaScript API

Компонент автоматически попробует загрузить Google Maps через JavaScript API, если iframe не работает.

## Тестирование

1. **Локально**: `npm run dev` - карта должна работать
2. **Netlify**: После деплоя проверьте карту на сайте
3. **Fallback**: Если карта не загружается, проверьте альтернативные варианты

## Troubleshooting

### Карта не загружается на Netlify

1. Проверьте CSP заголовки в `netlify.toml`
2. Убедитесь, что API ключ настроен правильно
3. Проверьте ограничения домена в Google Cloud Console

### Ошибка "This content is blocked"

1. Добавьте домен в разрешенные в Google Cloud Console
2. Проверьте CSP заголовки
3. Попробуйте использовать Google Maps JavaScript API

### API ключ не работает

1. Убедитесь, что Google Maps JavaScript API включен
2. Проверьте ограничения домена
3. Проверьте квоты API

## Безопасность

- Никогда не коммитьте API ключи в репозиторий
- Используйте переменные окружения
- Настройте ограничения домена в Google Cloud Console
- Регулярно ротируйте API ключи
