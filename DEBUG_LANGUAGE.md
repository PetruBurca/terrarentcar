# 🔍 Отладка проблемы с сохранением языка

## 🔧 Добавлена отладочная информация

### **Что добавлено:**

1. **Консольные логи в i18n.ts:**

   - `Initial saved language:` - показывает какой язык загружается при инициализации
   - `Loading locale for:` - показывает какой язык загружается
   - `Locale loaded for:` - подтверждает загрузку
   - `Language saved to localStorage:` - подтверждает сохранение

2. **Консольные логи в Header.tsx:**

   - `Header: setting current language to:` - показывает какой язык устанавливается в Header
   - `Changing language to:` - показывает переключение языка

3. **Консольные логи в App.tsx:**
   - `App: loading language:` - показывает загрузку языка в App

### **Как тестировать:**

1. **Откройте DevTools** (F12)
2. **Перейдите на вкладку Console**
3. **Перезагрузите страницу** (F5)
4. **Посмотрите логи** - они покажут что происходит с языком

### **Ожидаемые логи при загрузке:**

```
Initial saved language: ro (или ru/en)
App: loading language: ro (или ru/en)
Loading locale for: ro (или ru/en)
Locale loaded for: ro (или ru/en)
Language saved to localStorage: ro (или ru/en)
Header: setting current language to: ro (или ru/en)
```

### **Ожидаемые логи при переключении языка:**

```
Changing language to: ru
Loading locale for: ru
Locale loaded for: ru
Language saved to localStorage: ru
```

### **Если проблема остается:**

1. **Проверьте localStorage:**

   ```javascript
   localStorage.getItem("app-language");
   ```

2. **Очистите localStorage:**

   ```javascript
   localStorage.clear();
   ```

3. **Установите язык вручную:**
   ```javascript
   localStorage.setItem("app-language", "ru");
   ```

### **Файлы с отладкой:**

- ✅ `src/lib/i18n.ts` - логи инициализации и загрузки
- ✅ `src/components/layout/Header.tsx` - логи переключения языка
- ✅ `src/App.tsx` - логи загрузки в App

**Откройте консоль и посмотрите что происходит с языком!** 🔍
