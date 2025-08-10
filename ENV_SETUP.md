# Настройка переменных окружения

## Создание файла .env

Создайте файл `.env` в корне проекта со следующими переменными:

```bash
# Airtable Configuration
VITE_AIRTABLE_BASE_ID=your_airtable_base_id_here
VITE_AIRTABLE_TOKEN=your_airtable_token_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
VITE_FIREBASE_SECRET_TOKEN=your_firebase_secret_token_here
```

## Получение значений

### Airtable

1. Перейдите в [Airtable](https://airtable.com)
2. Откройте вашу базу данных
3. Скопируйте Base ID из URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
4. В настройках аккаунта создайте Personal Access Token

### Firebase

1. Перейдите в [Firebase Console](https://console.firebase.google.com)
2. Выберите ваш проект
3. В настройках проекта найдите конфигурацию
4. Скопируйте все необходимые значения

## Безопасность

⚠️ **ВАЖНО**: Никогда не коммитьте файл `.env` в Git!

- Файл `.env` уже добавлен в `.gitignore`
- Для продакшена используйте GitHub Secrets
- Для локальной разработки используйте `.env.local`

## Проверка

После создания файла `.env` перезапустите сервер разработки:

```bash
npm run dev
```

Приложение должно запуститься без ошибок, если все переменные настроены правильно.
