# 📧 Настройка отправки email от рабочего аккаунта

## 🎯 Цель

Настроить отправку автоматических email от имени компании TerraRentCar

## 🔧 Вариант 1: Использование корпоративного домена

### Настройка в Airtable:

1. **Перейдите в Settings → Account → Email**
2. **Добавьте домен**: `terrarentcar.md`
3. **Подтвердите владение доменом** (DNS записи)
4. **Настройте автоматизацию**:

```
From: info@terrarentcar.md
Reply-to: info@terrarentcar.md
To: {Email}
Subject: Резервация автомобиля
```

### Альтернативные адреса:

- `booking@terrarentcar.md`
- `noreply@terrarentcar.md`
- `support@terrarentcar.md`
- `reservations@terrarentcar.md`

## 🔧 Вариант 2: Использование Gmail (если нет домена)

### Настройка в Airtable:

```
From: terrarentcar.prim@gmail.com
Reply-to: terrarentcar.prim@gmail.com
To: {Email}
Subject: Резервация автомобиля
```

### Настройка Gmail для отправки:

1. Включите 2FA в Gmail
2. Создайте пароль приложения
3. Добавьте Gmail в Airtable

## 🔧 Вариант 3: Использование Google Workspace

Если у вас есть Google Workspace:

```
From: info@terrarentcar.md (через Google Workspace)
Reply-to: info@terrarentcar.md
To: {Email}
Subject: Резервация автомобиля
```

## 📋 Пошаговая настройка в Airtable

### 1. Настройка домена:

1. **Airtable → Settings → Account → Email**
2. **Add Domain** → `terrarentcar.md`
3. **Verify Domain** (добавьте DNS записи)
4. **Wait for verification** (24-48 часов)

### 2. Настройка автоматизации:

В действии "Send an email":

```
Action type: Send an email
From: info@terrarentcar.md
Reply-to: info@terrarentcar.md
To: {Email}
Subject: Резервация автомобиля
Message: [результат AI или готовый шаблон]
```

### 3. Дополнительные настройки:

```
Show more options:
- Include company signature: Yes
- Track opens: Yes
- Track clicks: Yes
```

## 🚨 Важные моменты:

### 1. **DNS записи для домена:**

```
Type: TXT
Name: @
Value: airtable-verification=your-verification-code
```

### 2. **SPF запись:**

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.airtable.com ~all
```

### 3. **DKIM запись:**

```
Type: TXT
Name: airtable._domainkey
Value: [DKIM key from Airtable]
```

## 📧 Альтернативные решения

### 1. **Использование SendGrid:**

- Подключите SendGrid к Airtable
- Настройте отправку от `noreply@terrarentcar.md`

### 2. **Использование Mailgun:**

- Подключите Mailgun
- Настройте домен для отправки

### 3. **Использование AWS SES:**

- Подключите AWS SES
- Настройте верифицированный домен

## 🧪 Тестирование

### 1. **Тестовая отправка:**

1. Создайте тестовую заявку
2. Измените статус на "подтверждена"
3. Проверьте email в папке "Входящие"
4. Проверьте папку "Спам"

### 2. **Проверка доставки:**

- Откройте логи автоматизации
- Проверьте статус отправки
- Убедитесь, что email не попадает в спам

## 🔍 Проверка настроек

### В Airtable:

- [ ] Домен добавлен и верифицирован
- [ ] From адрес настроен
- [ ] Reply-to адрес настроен
- [ ] Автоматизация включена
- [ ] Тестовая отправка прошла успешно

### В DNS:

- [ ] TXT запись для верификации добавлена
- [ ] SPF запись настроена
- [ ] DKIM запись настроена (если требуется)

## 📞 Поддержка

Если возникают проблемы:

1. **Проверьте DNS записи** через онлайн инструменты
2. **Обратитесь в поддержку Airtable** для настройки домена
3. **Проверьте логи** автоматизации
4. **Убедитесь в правах доступа** к отправке email

## 🎉 Результат

После настройки все email будут отправляться от:

```
From: info@terrarentcar.md
Reply-to: info@terrarentcar.md
Subject: Резервация автомобиля
```

Это создаст профессиональный образ компании и улучшит доставляемость писем!
