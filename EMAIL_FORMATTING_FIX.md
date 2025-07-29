# 🔧 Исправление форматирования email в Airtable

## ❌ **Проблема:**

- Email отправляется в спам
- Выглядит как простой текст без таблиц
- Нет форматирования и стилей

## ✅ **Решение:**

### Шаг 1: Включите HTML форматирование в Airtable

1. **Откройте автоматизацию** в Airtable
2. **Нажмите на действие** "Gmail: Send email"
3. **В правой панели** найдите поле "Message"
4. **Найдите кнопку "Show more options"** (Показать больше опций)
5. **Нажмите на неё** - откроются дополнительные настройки
6. **Найдите опцию "Format"** или "Message format"
7. **Выберите "HTML"** вместо "Plain text"

### Шаг 2: Проверьте HTML код

Убедитесь, что в поле "Message" у вас правильный HTML код:

```html
<!DOCTYPE html>
<html>
  <head>
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
        padding: 30px 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .header h1 {
        margin: 0 0 10px 0;
        font-size: 28px;
      }
      .header p {
        margin: 0;
        font-size: 16px;
        opacity: 0.9;
      }
      .content {
        background-color: #f9f9f9;
        padding: 30px 20px;
        border-radius: 0 0 8px 8px;
      }
      .section {
        margin-bottom: 25px;
      }
      .section h3 {
        color: #b90003;
        margin: 0 0 15px 0;
        font-size: 18px;
        border-bottom: 2px solid #b90003;
        padding-bottom: 5px;
      }
      .details-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
      }
      .details-table th,
      .details-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      .details-table th {
        background-color: #f8f9fa;
        font-weight: bold;
        color: #666;
        width: 40%;
      }
      .details-table td {
        background-color: white;
      }
      .payment-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
      }
      .payment-table th,
      .payment-table td {
        padding: 10px;
        text-align: left;
      }
      .payment-table th {
        background-color: #f8f9fa;
        font-weight: bold;
        color: #666;
        width: 60%;
      }
      .payment-table td {
        background-color: white;
      }
      .total-row {
        background-color: #b90003 !important;
        color: white !important;
        font-weight: bold;
        font-size: 18px;
      }
      .important-info {
        background-color: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 5px;
        padding: 15px;
        margin: 20px 0;
      }
      .important-info p {
        margin: 0;
        color: #856404;
      }
      .footer {
        background-color: #333;
        color: white;
        padding: 30px 20px;
        text-align: center;
        border-radius: 8px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Резервация одобрена</h1>
      <p>TerraRentCar - Ваш надежный партнер в аренде автомобилей</p>
    </div>

    <div class="content">
      <div class="section">
        <p>Ваша резервация автомобиля {Название/модель} одобрена.</p>

        <div class="important-info">
          <p>
            <strong>Важно:</strong> Пожалуйста, проверьте детали резервации.
            Если что-то не так, Вы можете исправить резервацию по номеру
            телефона: +37379013014 в течение 24 часов с момента ее создания.
          </p>
        </div>
      </div>

      <div class="section">
        <h3>ДЕТАЛИ ПРОКАТА</h3>
        <table class="details-table">
          <tr>
            <th>Дата резервации:</th>
            <td>{Дата начала аренды} - {Дата окончания аренды}</td>
          </tr>
          <tr>
            <th>Локация получения:</th>
            <td>{Как забрать машину}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h3>ДЕТАЛИ ОПЛАТЫ</h3>
        <table class="payment-table">
          <tr>
            <th>Стоимость аренды:</th>
            <td>{Общая стоимость} €</td>
          </tr>
          <tr>
            <th>Стоимость доставки:</th>
            <td>0 €</td>
          </tr>
          <tr>
            <th>Стоимость мойки:</th>
            <td>20 €</td>
          </tr>
          <tr>
            <th>Скидка:</th>
            <td>-0 €</td>
          </tr>
          <tr class="total-row">
            <th>Итого к оплате:</th>
            <td>{Общая стоимость + 20} €</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h3>КОНТАКТЫ</h3>
        <div class="contact-info">
          <div class="contact-item">
            <strong>Администратор</strong>
            <p>+37379013014</p>
          </div>
          <div class="contact-item">
            <strong>Социальные сети</strong>
            <p>Facebook | Instagram</p>
          </div>
        </div>
      </div>

      <div class="thank-you">
        <p><strong>Спасибо, что выбрали TerraRentCar!</strong></p>
      </div>
    </div>

    <div class="footer">
      <p><strong>TERRARENTCAR PRIM</strong></p>
      <p>2024 TarrarentCarPrim All rights are reserved.</p>
    </div>
  </body>
</html>
```

### Шаг 3: Решение проблемы со спамом

#### A. Настройте DNS записи для домена:

1. **SPF запись:**

   ```
   TXT @ "v=spf1 include:_spf.google.com ~all"
   ```

2. **DKIM запись** (если используете Gmail):

   - Настройте DKIM в Google Workspace
   - Добавьте DKIM запись в DNS

3. **DMARC запись:**
   ```
   TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
   ```

#### B. Альтернативное решение - используйте Gmail напрямую:

1. **В Airtable** выберите "Gmail: Send email"
2. **Убедитесь, что Gmail аккаунт подключен**
3. **Используйте простой HTML** без сложных стилей

### Шаг 4: Тестирование

1. **Создайте тестовую заявку**
2. **Измените статус на "подтверждена"**
3. **Проверьте email** - должен прийти с таблицами
4. **Проверьте папку "Спам"** - email не должен туда попадать

### Шаг 5: Если проблема остается

#### Вариант A: Упростите HTML

Используйте более простой HTML без сложных CSS:

```html
<h2>Резервация одобрена</h2>
<p>Ваша резервация автомобиля {Название/модель} одобрена.</p>

<h3>ДЕТАЛИ ПРОКАТА</h3>
<table border="1" cellpadding="10" cellspacing="0">
  <tr>
    <td><strong>Дата резервации:</strong></td>
    <td>{Дата начала аренды} - {Дата окончания аренды}</td>
  </tr>
  <tr>
    <td><strong>Локация получения:</strong></td>
    <td>{Как забрать машину}</td>
  </tr>
</table>

<h3>ДЕТАЛИ ОПЛАТЫ</h3>
<table border="1" cellpadding="10" cellspacing="0">
  <tr>
    <td><strong>Стоимость аренды:</strong></td>
    <td>{Общая стоимость} €</td>
  </tr>
  <tr>
    <td><strong>Стоимость доставки:</strong></td>
    <td>0 €</td>
  </tr>
  <tr>
    <td><strong>Стоимость мойки:</strong></td>
    <td>20 €</td>
  </tr>
  <tr>
    <td><strong>Итого к оплате:</strong></td>
    <td><strong>{Общая стоимость + 20} €</strong></td>
  </tr>
</table>

<p><strong>Администратор: +37379013014</strong></p>
<p>Спасибо, что выбрали TerraRentCar!</p>
```

#### Вариант B: Используйте другой сервис

- **SendGrid**
- **Mailgun**
- **Amazon SES**

---

## 🎯 **Главное:**

1. **Включите HTML форматирование** в настройках Gmail действия
2. **Используйте правильный HTML код** с таблицами
3. **Настройте DNS записи** для предотвращения попадания в спам
4. **Протестируйте** автоматизацию

**После этих изменений email должен выглядеть красиво с таблицами и не попадать в спам!** 🚀
