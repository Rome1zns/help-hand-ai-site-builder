

# Память ИИ + Мульти-агентный UX

## Что будет сделано

### 1. Память ИИ (сохранение истории чата)
Сейчас при перезагрузке страницы вся история чата теряется. Добавим сохранение в базу данных.

- Создание таблицы `conversations` (id, session_id, created_at) и `chat_messages` (id, conversation_id, role, content, created_at)
- При первом сообщении создаётся новая сессия, `conversation_id` сохраняется в `localStorage`
- Каждое сообщение (user и assistant) записывается в базу
- При загрузке редактора — подгружается история из базы и восстанавливается последний сгенерированный код
- Вся история отправляется в AI при каждом запросе (как сейчас, но теперь она персистентна)

### 2. "Бурная деятельность" агентов вместо одного сообщения
Вместо одного сообщения "код сгенерирован", пользователь увидит поток статусных сообщений от разных агентов:

Пока AI стримит код, в чате последовательно появляются сообщения:
1. **Архитектор** (синяя иконка): "Анализирую запрос и планирую структуру сайта..."
2. **Разработчик** (зелёная иконка): "Пишу HTML-разметку и структуру страницы..."
3. **Дизайнер** (розовая иконка): "Применяю стили и настраиваю адаптивность..."
4. **Тестировщик** (оранжевая иконка): "Проверяю код на ошибки и совместимость..."
5. **Все агенты** (фиолетовая иконка): "Сайт полностью готов!"

Эти сообщения появляются с задержками по ходу стриминга (по прогрессу получения данных), создавая впечатление работы команды.

### 3. Мульти-агентный UI в чате
- Новый тип сообщения `system` с полем `agent` (имя агента) и `agentColor`
- Каждый агент имеет свою иконку и цвет аватара:
  - Архитектор — Layout icon, синий
  - Разработчик — Code icon, зелёный
  - Дизайнер — Palette icon, розовый
  - Тестировщик — Shield icon, оранжевый
- Заголовок чата меняется на "Команда ИИ-агентов"
- Пустое состояние показывает аватары всех 4 агентов с подписью "Команда из 4 ИИ-агентов готова к работе"

## Технический план

### База данных (миграция)
```sql
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  agent_name text,
  created_at timestamptz DEFAULT now()
);

-- No RLS needed - public access via session_id (no auth yet)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access conversations" ON conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access chat_messages" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
```

### Файлы для изменения

**`src/lib/streamChat.ts`**
- Расширить тип `Msg` — добавить опциональные поля `agent?: string`, `agentColor?: string`
- Без других изменений в логике стриминга

**`src/pages/Editor.tsx`**
- Добавить `conversationId` state, сохранять в `localStorage`
- При монтировании — загружать историю из базы
- После каждого сообщения — сохранять в базу
- Добавить логику генерации статусных сообщений от агентов по ходу стриминга:
  - При старте стрима — сообщение от Архитектора
  - После ~15% данных — от Разработчика
  - После ~50% — от Дизайнера
  - После ~85% — от Тестировщика
  - В конце — финальное "Сайт готов!"

**`src/components/editor/ChatPanel.tsx`**
- Заголовок "Команда ИИ-агентов" с аватарами агентов
- Новый рендер для `system`-сообщений с иконкой и цветом агента
- Пустое состояние — 4 аватара агентов в ряд
- Анимация появления сообщений агентов (Framer Motion fade-in)

