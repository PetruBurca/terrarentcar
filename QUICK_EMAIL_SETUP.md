# ⚡ Быстрая настройка корпоративного email

## 🎯 Что нужно сделать прямо сейчас:

### 1. **В Airtable автоматизации:**

В действии "Send an email" измените:

```
From: info@terrarentcar.md
Reply-to: info@terrarentcar.md
To: {Email}
Subject: Резервация автомобиля
```

### 2. **Если нет домена terrarentcar.md:**

Используйте Gmail:

```
From: terrarentcar.prim@gmail.com
Reply-to: terrarentcar.prim@gmail.com
To: {Email}
Subject: Резервация автомобиля
```

### 3. **Альтернативные адреса:**

- `booking@terrarentcar.md`
- `noreply@terrarentcar.md`
- `support@terrarentcar.md`
- `reservations@terrarentcar.md`

## 🔧 Настройка домена (если есть):

1. **Airtable → Settings → Account → Email**
2. **Add Domain** → `terrarentcar.md`
3. **Добавьте DNS записи** (TXT, SPF, DKIM)
4. **Подождите верификации** (24-48 часов)

## 🧪 Тест:

1. Измените From адрес в автоматизации
2. Создайте тестовую заявку
3. Измените статус на "подтверждена"
4. Проверьте, что email приходит от правильного адреса

## ✅ Результат:

Все email будут отправляться от имени компании TerraRentCar!
