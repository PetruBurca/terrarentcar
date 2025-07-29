# Исправление загрузки шрифтов на Netlify

## Проблема

На продакшене Netlify шрифт "Special Gothic Expanded One" не загружался корректно.

## Решения

### 1. Добавление шрифта в index.html

- Добавлен `preconnect` для Google Fonts
- Добавлен `preload` для ускорения загрузки
- Шрифт загружается через `<link>` в `<head>`

### 2. Улучшенный CSS

- Убран `@import` из CSS файла
- Добавлен `@font-face` с `font-display: swap`
- Добавлены fallback шрифты: "Arial Black", "Helvetica Bold", "Impact"

### 3. React компонент

- Добавлена проверка загрузки шрифта через `document.fonts.ready`
- Добавлены CSS классы для состояний загрузки
- Fallback для старых браузеров

### 4. Стратегия загрузки

```css
@font-face {
  font-family: "Special Gothic Expanded One";
  font-display: swap; /* Показывает fallback пока загружается основной шрифт */
  src: url("https://fonts.gstatic.com/...") format("woff2");
}
```

## Проверка

После деплоя проверьте:

1. Открыть DevTools → Network → Fonts
2. Убедиться что шрифт загружается
3. Проверить что логотип отображается корректно

## Fallback шрифты

Если основной шрифт не загрузится, будут использоваться:

1. Arial Black
2. Helvetica Bold
3. Impact
4. Sans-serif (системный)
