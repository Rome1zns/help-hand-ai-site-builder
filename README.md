# Help Hand AI Site Builder

Help Hand — интерфейс AI-конструктора сайтов. Пользователь описывает идею, может использовать голосовой ввод, открывает editor flow и смотрит demo-страницы для разных ниш.

## Для кого

Проект рассчитан на предпринимателей и малый бизнес, которым нужен быстрый прототип сайта без дизайнера и разработчика. Для портфолио это demo AI SaaS-продукта с маркетинговой страницей и генеративным editor experience.

## Ключевые функции

- landing page AI-site-builder продукта;
- prompt input и голосовой ввод;
- переход в editor;
- streaming chat integration через Supabase Edge Function;
- демо-сайты для кофейни, стройки, tech store, fitness, travel и design studio;
- галерея, pricing, testimonials и feature-блоки;
- responsive UI и motion-анимации.

## Стек

- Vite;
- React 18;
- TypeScript;
- React Router;
- Supabase;
- Supabase Edge Functions;
- Tailwind CSS;
- shadcn/ui;
- framer-motion;
- JSZip;
- Web Speech API.

## Архитектура

Landing собирается из `src/components/landing`. Editor находится в `src/pages/Editor.tsx`. Демо-страницы лежат в `src/pages/demos`. Streaming-запросы к AI backend вынесены в `src/lib/streamChat.ts`.

## Локальный запуск

```bash
cp .env.example .env
npm install
npm run dev
```

## Переменные окружения

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

Supabase Edge Function `generate-site` должна быть настроена отдельно. Реальные ключи не коммитятся.

## Проверки

```bash
npm run lint
npm run build
npm run test
```

## Статус

MVP/demo AI SaaS-интерфейса. Для production нужны billing, auth, сохранение проектов, лимиты генерации и надежный backend для генерации сайтов.

## Что демонстрирует в портфолио

- AI-product интерфейс;
- landing + editor flow;
- voice input и streaming UX;
- набор demo verticals;
- упаковку генеративного продукта в SaaS-формат.
