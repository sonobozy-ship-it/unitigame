# Как собрать APK

## Способ 1 — EAS Build (рекомендуется, бесплатно)

### Шаг 1 — Зарегистрируйся на expo.dev
Перейди на https://expo.dev/signup и создай бесплатный аккаунт.

### Шаг 2 — Установи EAS CLI
```bash
npm install -g eas-cli
```

### Шаг 3 — Войди в аккаунт
```bash
eas login
```

### Шаг 4 — Инициализируй проект
```bash
eas init
```
Это создаст `projectId` в app.json автоматически.

### Шаг 5 — Собери APK
```bash
eas build --platform android --profile preview
```
- Сборка займёт ~5-10 минут на серверах Expo
- Ссылку на скачивание APK пришлёт в терминал и на email
- Бесплатный план: 30 сборок в месяц

### Шаг 6 — Скачай и установи на телефон
Скачай APK по ссылке → перенеси на Android → Настройки → Установка из неизвестных источников → Установить.

---

## Способ 2 — Локальная сборка (нужен Android Studio)

```bash
# Генерируем нативный Android-проект
npx expo prebuild --platform android

# Собираем APK
cd android && ./gradlew assembleRelease

# APK будет в:
# android/app/build/outputs/apk/release/app-release.apk
```

Нужно установить: Android Studio, Java 17, Android SDK.

---

## Для публикации в Google Play
1. `eas build --platform android --profile production` (создаёт AAB)
2. Скачать AAB файл
3. Загрузить в Google Play Console
4. Заполнить описание, скриншоты, контент-рейтинг

Стоимость Google Play: единоразово $25.
