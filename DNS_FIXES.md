# 🔧 ИСПРАВЛЕНИЯ DNS НАСТРОЕК

## Проблемы найдены:

### 1. cPanel (terrarentcar.md) - НЕПРАВИЛЬНЫЕ A записи

**Сейчас:**

```
terrarentcar.md. → 185.199.109.153
terrarentcar.md. → 185.199.110.153
terrarentcar.md. → 185.199.111.153
```

**Должно быть:**

```
terrarentcar.md. → 185.199.108.153
terrarentcar.md. → 185.199.109.153
terrarentcar.md. → 185.199.110.153
terrarentcar.md. → 185.199.111.153
```

### 2. Отсутствует CNAME для GitHub Pages

**Добавить в cPanel:**

```
Type: CNAME
Name: @ (или оставить пустым)
Value: petruburca.github.io
TTL: 3600
```

### 3. GoDaddy (terrarentcar.com) - нет редиректа

**Добавить в GoDaddy:**

```
Type: CNAME
Name: @
Value: terrarentcar.md
TTL: 3600
```

## Пошаговые исправления:

### Шаг 1: Исправить cPanel DNS

1. Зайти в cPanel → Zone Editor
2. Удалить все A записи для terrarentcar.md
3. Добавить правильные A записи GitHub Pages
4. Добавить CNAME: @ → petruburca.github.io

### Шаг 2: Настроить редирект в GoDaddy

1. Зайти в GoDaddy DNS
2. Добавить CNAME: @ → terrarentcar.md
3. Или настроить редирект на уровне домена

### Шаг 3: Проверить SSL

1. Убедиться что SSL сертификат действителен
2. Проверить что нет HTTP редиректов
