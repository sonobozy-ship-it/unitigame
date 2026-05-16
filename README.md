# Sonobozy Apps

Monorepo с несколькими мобильными играми.

## Проекты

| Папка | Название | Платформа | Статус |
|-------|----------|-----------|--------|
| `apps/koru` | **KORU** — 3D pipe puzzle | Android | ✅ Active |

## Запуск

```bash
# KORU
cd apps/koru && npm install && expo start

# Сборка APK
cd apps/koru && eas build --platform android --profile preview
```

## Добавить новый проект

```bash
cd apps
npx create-expo-app my-new-game
```
