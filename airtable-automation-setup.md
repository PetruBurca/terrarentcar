# 📧 Настройка автоматизации Airtable для отправки email

## 🎯 Цель

Настроить автоматическую отправку email с подтверждением заявки когда статус меняется на "подтверждена"

## 📋 Шаг 1: Настройка триггера

### В Airtable перейдите в раздел "Automations" и создайте новую автоматизацию:

1. **Название**: "Send Confirmation Email on Order Approval"
2. **Триггер**: "When a record matches conditions"
3. **Таблица**: "Заявки на аренду"
4. **Условие**:
   - Поле: "Статус заявки"
   - Оператор: "is any of"
   - Значение: "подтверждена"

## 📋 Шаг 2: Настройка действия "Generate text with AI"

### Конфигурация:

- **Action type**: "Generate text with AI"
- **Model**: "Default (GPT-4.1)"
- **Randomness**: "Low (default)"

### Промпт для AI:

```
Create an HTML email template in Russian for car rental confirmation with the following details:

Car Model: {Название/модель}
Rental Start Date: {Дата начала аренды}
Rental End Date: {Дата окончания аренды}
Customer Name: {Имя клиента}
Customer Email: {Email}
Total Cost: {Общая стоимость} €
Pickup Location: {Как забрать машину}
Payment Method: {Способ оплаты}

The email should:
1. Be in Russian
2. Have a professional but friendly tone
3. Include all the rental details
4. Have a clear structure with sections
5. Include contact information
6. Use HTML formatting for better presentation

Format the response as complete HTML email body.
```

## 📋 Шаг 3: Настройка действия "Send an email"

### Конфигурация:

- **Action type**: "Send an email"
- **To**: `{Email}` (поле из записи)
- **Subject**: "Резервация автомобиля - Подтверждена"
- **Message**: Используйте результат из предыдущего действия AI

### Дополнительные настройки:

- **From**: terrarentdevelopers@gmail.com
- **Reply-to**: terrarentdevelopers@gmail.com

## 📋 Шаг 4: Альтернативный HTML шаблон (если AI недоступен)

Если у вас нет доступа к AI функции, используйте этот готовый HTML шаблон:

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Подтверждение резервации</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background-color: #b90003;
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 0 0 8px 8px;
      }
      .section {
        margin-bottom: 20px;
        padding: 15px;
        background-color: white;
        border-radius: 5px;
        border-left: 4px solid #b90003;
      }
      .section h3 {
        color: #b90003;
        margin-top: 0;
      }
      .details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .detail-item {
        padding: 8px;
        background-color: #f5f5f5;
        border-radius: 3px;
      }
      .detail-label {
        font-weight: bold;
        color: #666;
      }
      .total {
        background-color: #b90003;
        color: white;
        padding: 15px;
        border-radius: 5px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        padding: 20px;
        background-color: #333;
        color: white;
        border-radius: 5px;
      }
      .contact-info {
        display: flex;
        justify-content: space-around;
        margin: 15px 0;
      }
      .contact-item {
        text-align: center;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        color: #b90003;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Резервация одобрена</h1>
      <p>Ваша резервация автомобиля {Название/модель} одобрена.</p>
    </div>

    <div class="content">
      <div class="section">
        <h3>Детали проката</h3>
        <div class="details">
          <div class="detail-item">
            <div class="detail-label">Автомобиль:</div>
            <div>{Название/модель}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Дата начала:</div>
            <div>{Дата начала аренды}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Дата окончания:</div>
            <div>{Дата окончания аренды}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Место получения:</div>
            <div>{Как забрать машину}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Детали оплаты</h3>
        <div class="details">
          <div class="detail-item">
            <div class="detail-label">Стоимость аренды:</div>
            <div>{Общая стоимость} €</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Способ оплаты:</div>
            <div>{Способ оплаты}</div>
          </div>
        </div>
      </div>

      <div class="total">Итого к оплате: {Общая стоимость} €</div>

      <div class="section">
        <h3>Важная информация</h3>
        <p>
          Пожалуйста, проверьте детали резервации. Если что-то не так, Вы можете
          исправить резервацию по номеру телефона:
          <strong>+37379013014</strong> в течение 24 часов с момента ее
          создания.
        </p>
      </div>
    </div>

    <div class="footer">
      <div class="logo">TERRARENTCAR PRIM</div>
      <div class="contact-info">
        <div class="contact-item">
          <strong>Администратор</strong><br />
          +37379013014
        </div>
        <div class="contact-item">
          <strong>Социальные сети</strong><br />
          Facebook | Instagram
        </div>
      </div>
      <p>Спасибо, что выбрали TerraRentCar!</p>
      <small>2024 TarrarentCarPrim All rights are reserved.</small>
    </div>
  </body>
</html>
```

## 📋 Шаг 5: Активация автоматизации

1. **Включите автоматизацию** - переключите тумблер в положение "ON"
2. **Протестируйте** - измените статус любой заявки на "подтверждена"
3. **Проверьте email** - убедитесь, что письмо отправляется корректно

## 🔧 Дополнительные настройки

### Поля для использования в шаблоне:

- `{Имя клиента}` - имя клиента
- `{Email}` - email клиента
- `{Телефон}` - телефон клиента
- `{Название/модель}` - модель автомобиля
- `{Дата начала аренды}` - дата начала
- `{Дата окончания аренды}` - дата окончания
- `{Общая стоимость}` - общая стоимость
- `{Как забрать машину}` - способ получения
- `{Способ оплаты}` - способ оплаты
- `{Время выдачи}` - время выдачи
- `{IDNP}` - IDNP клиента

### Настройка уведомлений:

- Добавьте уведомление в Slack/Discord при отправке email
- Настройте логирование всех отправленных писем
- Добавьте проверку доставки email

## 🚨 Важные моменты:

1. **Проверьте права доступа** - убедитесь, что у вас есть права на отправку email
2. **Тестируйте на тестовых данных** - сначала протестируйте на тестовой записи
3. **Мониторьте логи** - следите за успешностью отправки
4. **Резервное копирование** - сохраните настройки автоматизации

## 📞 Поддержка

Если возникнут проблемы:

1. Проверьте логи автоматизации в Airtable
2. Убедитесь, что все поля заполнены корректно
3. Проверьте настройки email в Airtable
4. Обратитесь в поддержку Airtable при необходимости
