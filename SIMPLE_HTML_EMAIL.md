# 📧 Простой HTML email для Airtable

## ❌ **Проблема:**

Airtable не принимает полный HTML с CSS стилями, только базовые HTML теги.

## ✅ **Решение: Используйте только HTML теги**

### Шаг 1: Замените код в поле "Message"

**Удалите весь текущий код** и вставьте **только HTML теги**:

```html
<h2 style="color: #B90003; text-align: center;">Резервация одобрена</h2>

<p>Ваша резервация автомобиля <strong>{Название/модель}</strong> одобрена.</p>

<div
  style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 15px 0; border-radius: 5px;"
>
  <p style="margin: 0; color: #856404;">
    <strong>Важно:</strong> Пожалуйста, проверьте детали резервации. Если что-то
    не так, Вы можете исправить резервацию по номеру телефона:
    <strong>+37379013014</strong> в течение 24 часов с момента ее создания.
  </p>
</div>

<h3
  style="color: #B90003; border-bottom: 2px solid #B90003; padding-bottom: 5px;"
>
  ДЕТАЛИ ПРОКАТА
</h3>

<table
  border="1"
  cellpadding="10"
  cellspacing="0"
  style="width: 100%; border-collapse: collapse; margin: 10px 0;"
>
  <tr>
    <td
      style="background-color: #f8f9fa; font-weight: bold; color: #666; width: 40%;"
    >
      <strong>Дата резервации:</strong>
    </td>
    <td style="background-color: white;">
      {Дата начала аренды} - {Дата окончания аренды}
    </td>
  </tr>
  <tr>
    <td style="background-color: #f8f9fa; font-weight: bold; color: #666;">
      <strong>Локация получения:</strong>
    </td>
    <td style="background-color: white;">{Как забрать машину}</td>
  </tr>
</table>

<h3
  style="color: #B90003; border-bottom: 2px solid #B90003; padding-bottom: 5px;"
>
  ДЕТАЛИ ОПЛАТЫ
</h3>

<table
  border="1"
  cellpadding="10"
  cellspacing="0"
  style="width: 100%; border-collapse: collapse; margin: 10px 0;"
>
  <tr>
    <td
      style="background-color: #f8f9fa; font-weight: bold; color: #666; width: 60%;"
    >
      <strong>Стоимость аренды:</strong>
    </td>
    <td style="background-color: white;">{Общая стоимость} €</td>
  </tr>
  <tr>
    <td style="background-color: #f8f9fa; font-weight: bold; color: #666;">
      <strong>Стоимость доставки:</strong>
    </td>
    <td style="background-color: white;">0 €</td>
  </tr>
  <tr>
    <td style="background-color: #f8f9fa; font-weight: bold; color: #666;">
      <strong>Стоимость мойки:</strong>
    </td>
    <td style="background-color: white;">20 €</td>
  </tr>
  <tr>
    <td style="background-color: #f8f9fa; font-weight: bold; color: #666;">
      <strong>Скидка:</strong>
    </td>
    <td style="background-color: white;">-0 €</td>
  </tr>
  <tr
    style="background-color: #B90003; color: white; font-weight: bold; font-size: 16px;"
  >
    <td style="background-color: #B90003; color: white; font-weight: bold;">
      <strong>Итого к оплате:</strong>
    </td>
    <td style="background-color: #B90003; color: white; font-weight: bold;">
      {Общая стоимость + 20} €
    </td>
  </tr>
</table>

<h3
  style="color: #B90003; border-bottom: 2px solid #B90003; padding-bottom: 5px;"
>
  КОНТАКТЫ
</h3>

<table border="0" cellpadding="10" cellspacing="0" style="width: 100%;">
  <tr>
    <td style="text-align: center; width: 50%;">
      <strong style="color: #B90003; display: block; margin-bottom: 5px;"
        >Администратор</strong
      >
      <p style="margin: 0;">+37379013014</p>
    </td>
    <td style="text-align: center; width: 50%;">
      <strong style="color: #B90003; display: block; margin-bottom: 5px;"
        >Социальные сети</strong
      >
      <p style="margin: 0;">Facebook | Instagram</p>
    </td>
  </tr>
</table>

<div
  style="text-align: center; margin: 20px 0; font-size: 16px; color: #B90003; font-weight: bold;"
>
  <p>Спасибо, что выбрали TerraRentCar!</p>
</div>

<div
  style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;"
>
  <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
    TERRARENTCAR PRIM
  </div>
  <div style="opacity: 0.8; font-size: 11px;">
    2024 TarrarentCarPrim All rights are reserved.
  </div>
</div>
```

### Шаг 2: Альтернативный вариант (еще проще)

Если первый вариант не работает, используйте **минимальный HTML**:

```html
<h2>Резервация одобрена</h2>

<p>Ваша резервация автомобиля <strong>{Название/модель}</strong> одобрена.</p>

<p>
  <strong>Важно:</strong> Пожалуйста, проверьте детали резервации. Если что-то
  не так, Вы можете исправить резервацию по номеру телефона:
  <strong>+37379013014</strong> в течение 24 часов с момента ее создания.
</p>

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
    <td><strong>Скидка:</strong></td>
    <td>-0 €</td>
  </tr>
  <tr>
    <td><strong>Итого к оплате:</strong></td>
    <td><strong>{Общая стоимость + 20} €</strong></td>
  </tr>
</table>

<h3>КОНТАКТЫ</h3>

<p><strong>Администратор:</strong> +37379013014</p>
<p><strong>Социальные сети:</strong> Facebook | Instagram</p>

<p><strong>Спасибо, что выбрали TerraRentCar!</strong></p>

<p>
  <strong>TERRARENTCAR PRIM</strong><br />
  2024 TarrarentCarPrim All rights are reserved.
</p>
```

### Шаг 3: Проверьте настройки

1. **Убедитесь, что выбрано "HTML"** в настройках формата
2. **Сохраните изменения** кнопкой "Update"
3. **Протестируйте** автоматизацию

## 🎯 **Результат:**

После замены кода:

- ✅ **Работающие таблицы** с данными
- ✅ **Базовое форматирование** (жирный текст, заголовки)
- ✅ **Автоматическая подстановка** данных из Airtable
- ✅ **Компактный вид** без сложных стилей

**Попробуйте первый вариант, если не работает - второй!** 🚀
