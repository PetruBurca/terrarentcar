# 🚗 TerraRentCar Prim

![TerraRentCar Banner](https://i.pinimg.com/originals/7e/2e/2e7e2e2e2e2e2e2e2e2e2e2e2e2e2e2e.jpg)

> **Современный сайт аренды авто с интеграцией Airtable, плавным UX и адаптацией под бизнес!**

---

## ✨ Фичи

- ⚡ **Мгновенная фильтрация** по категориям (Седан, Внедорожник и др.)
- 📱 **Адаптивный дизайн** — удобно на любом устройстве
- 🏎️ **Карусель и карточки** с фото, рейтингом, опциями и ценой
- 🗂️ **CMS на Airtable** — все авто и заявки хранятся в облаке
- 📨 **Формы бронирования и обратной связи** с отправкой прямо в Airtable
- 🛡️ **Безопасность**: защита от пустых данных, computed fields, ошибок API
- 🧭 **Плавная навигация** и sticky фильтры на мобильных
- 🖼️ **Placeholder** для авто без фото
- 🚀 **Кэширование** данных для скорости и стабильности
- 🌍 **Мультиязычность** (RU, RO, EN) с автоопределением языка

---

## 📸 Скриншоты

|               Главная                |                Фильтрация                |            Модалка бронирования            |            Мобильная версия             |
| :----------------------------------: | :--------------------------------------: | :----------------------------------------: | :-------------------------------------: |
| ![main](src/assets/gallery/bmw.jpeg) | ![filter](src/assets/gallery/skoda.jpeg) | ![modal](src/assets/gallery/mercedes.jpeg) | ![mobile](src/assets/gallery/bmw2.jpeg) |

---

## 🚀 Быстрый старт

```bash
git clone https://github.com/KichZero/terra-wheels-request-app.git
cd terra-wheels-request-app/temp-repo
npm install
npm run dev
```

---

## ⚙️ Настройки

- **Airtable:**  
  Создайте базу с таблицами “Автомобили (Cars)” и “Заявки на аренду”.  
  Пропишите свой токен и ID базы в `src/lib/airtable.ts`.

- **.env:**  
  Для продакшена используйте переменные окружения для токена Airtable!

---

## 🛠️ Технологии

- React + TypeScript
- Tailwind CSS
- React Query (TanStack)
- Airtable API
- i18next
- Vite

---

## 🧑‍💻 Авторы

- [Max G](https://github.com/KichZero) — разработка, интеграция, дизайн

---

## 🏁 TODO / Идеи

- [ ] Добавить оплату онлайн 💳
- [ ] Интеграция с Google Analytics 📊
- [ ] Улучшить SEO и микроразметку 🔍
- [ ] Добавить отзывы клиентов ⭐

---

## 📱 Контакты

- [Instagram](https://instagram.com/terrarentcar)
- [Сайт](https://terrarentcar.md)
- [Телефон](tel:+37379013014)

---

> **TerraRentCar Prim — больше, чем аренда авто!**
