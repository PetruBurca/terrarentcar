# Проверка GitHub Secrets для Airtable

## 🔍 Как проверить ваши ключи Airtable в GitHub:

### 1. Перейдите в настройки репозитория:

- Откройте: https://github.com/PetruBurca/terrarentcar
- Нажмите на вкладку **Settings**
- В левом меню выберите **Secrets and variables** → **Actions**

### 2. Проверьте наличие секретов:

Убедитесь, что у вас есть эти два секрета:

- ✅ **VITE_AIRTABLE_TOKEN** - ваш Personal Access Token из Airtable
- ✅ **VITE_AIRTABLE_BASE_ID** - ID вашей базы данных Airtable

### 3. Если секретов нет или они неправильные:

#### Для получения VITE_AIRTABLE_TOKEN:

1. Зайдите в Airtable: https://airtable.com/account
2. Перейдите в раздел **Developer hub**
3. Создайте новый **Personal access token**
4. Выберите права: **data.records:read**, **data.records:write**
5. Скопируйте токен и добавьте в GitHub Secrets как `VITE_AIRTABLE_TOKEN`

#### Для получения VITE_AIRTABLE_BASE_ID:

1. Откройте вашу базу данных в Airtable
2. Перейдите в **Help** → **API documentation**
3. Скопируйте **Base ID** (начинается с `app...`)
4. Добавьте в GitHub Secrets как `VITE_AIRTABLE_BASE_ID`

### 4. Проверьте деплой:

- Перейдите в вкладку **Actions** в вашем репозитории
- Найдите последний workflow "Deploy to GitHub Pages"
- Проверьте логи сборки на наличие ошибок

### 5. Если проблема остается:

После обновления секретов сделайте пустой коммит:

```bash
git commit --allow-empty -m "Restart deployment after secrets update"
git push
```

## 🚨 Возможные проблемы:

1. **401 Unauthorized** - неправильный токен
2. **404 Not Found** - неправильный Base ID или название таблицы
3. **429 Too Many Requests** - превышен лимит запросов
4. **500 Server Error** - проблемы на стороне Airtable

## 📞 Если нужна помощь:

Пришлите скриншот ошибки из консоли браузера (F12 → Console)
