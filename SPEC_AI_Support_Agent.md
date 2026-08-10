# SPEC: Веб-приложение «ИИ-агент поддержки»

> Техническая спецификация на основе [PRD_AI_Support_Agent.md](./PRD_AI_Support_Agent.md)

## 1. Стек технологий

| Слой | Технология | Комментарий |
|---|---|---|
| Frontend | React 18 + TypeScript | SPA, функциональные компоненты + hooks |
| Стилизация | Tailwind CSS | Утилитарный CSS, быстрая адаптивность |
| State management | React Context / Zustand | Локальное состояние чата, без Redux — избыточно для объёма задачи |
| Связь с бэкендом | Fetch API + SSE (Server-Sent Events) | Потоковая передача ответа агента |
| Backend | Node.js + Express (или Fastify) | API-шлюз к LLM |
| LLM-провайдер | Anthropic API (Claude) | Модель — `claude-sonnet-4-6` или актуальная на момент разработки |
| Хранение истории (MVP) | In-memory / sessionStorage на клиенте | Без БД на MVP-этапе |
| Хостинг frontend | Vercel / Netlify | Статический билд SPA |
| Хостинг backend | VPS / Render / Railway | Node-процесс с доступом к LLM API |

---

## 2. Архитектура системы

```
┌─────────────┐      HTTPS/SSE      ┌──────────────┐      HTTPS      ┌───────────────┐
│   Browser    │  ───────────────►  │  API Gateway  │  ────────────►  │  Anthropic API │
│  (React SPA) │  ◄───────────────  │  (Node.js)    │  ◄────────────  │   (Claude)     │
└─────────────┘   поток токенов     └──────────────┘   поток токенов  └───────────────┘
```

- Frontend не обращается к LLM напрямую — все запросы идут через backend-прокси (сокрытие API-ключа, rate limiting, логирование).
- Backend транслирует потоковый ответ модели через SSE во frontend, что даёт эффект «печатает...» и последующего постепенного вывода текста.

---

## 3. Структура компонентов (Frontend)

```
src/
├── components/
│   ├── ChatWindow/
│   │   ├── ChatWindow.tsx        # корневой контейнер чата
│   │   ├── MessageList.tsx       # лента сообщений + автоскролл
│   │   ├── MessageBubble.tsx     # одно сообщение (user | agent)
│   │   ├── TypingIndicator.tsx   # анимация "печатает..."
│   │   └── EmptyState.tsx        # приветствие + quick replies
│   ├── ChatInput/
│   │   ├── ChatInput.tsx         # обёртка: textarea + кнопка
│   │   ├── TextArea.tsx          # авто-расширяемое поле ввода
│   │   └── SendButton.tsx        # кнопка отправки
│   └── Header/
│       └── ChatHeader.tsx        # логотип, имя агента, статус
├── hooks/
│   ├── useChat.ts                # логика отправки/получения сообщений
│   ├── useAutoScroll.ts          # автопрокрутка ленты
│   └── useTypingStatus.ts        # управление индикатором набора текста
├── services/
│   └── chatApi.ts                # обёртка над fetch/SSE к backend
├── types/
│   └── chat.types.ts             # Message, ChatState, MessageRole и т.д.
├── styles/
│   └── theme.ts                  # цветовые токены, брейкпоинты
└── App.tsx
```

---

## 4. Модель данных

### 4.1 Типы (TypeScript)

```typescript
type MessageRole = 'user' | 'agent';

type MessageStatus = 'sending' | 'sent' | 'error';

interface Message {
  id: string;              // uuid
  role: MessageRole;
  content: string;          // markdown-текст
  timestamp: number;        // unix ms
  status?: MessageStatus;   // актуально для сообщений пользователя
}

interface ChatState {
  messages: Message[];
  isAgentTyping: boolean;
  isConnected: boolean;
  sessionId: string;
}
```

### 4.2 API-контракт

**POST /api/chat/message**

Запрос:
```json
{
  "sessionId": "string",
  "message": "string"
}
```

Ответ (SSE-поток, `Content-Type: text/event-stream`):
```
event: typing
data: {}

event: token
data: {"text": "Привет"}

event: token
data: {"text": ", чем"}

event: done
data: {"messageId": "uuid"}
```

Событие ошибки:
```
event: error
data: {"message": "Не удалось получить ответ, попробуйте снова"}
```

**POST /api/chat/session** (опционально)
Создание новой сессии, возвращает `sessionId`.

---

## 5. Детализация ключевых компонентов

### 5.1 `ChatInput`
- Управляемый компонент, состояние текста — локальный `useState`.
- `<textarea>` с `rows=1` и `field-sizing`/JS-логикой auto-grow до `max-height: 120px`, далее `overflow-y: auto`.
- Обработчики:
  - `onKeyDown`: `Enter` (без Shift) → `handleSend()`, `preventDefault()`.
  - `Shift+Enter` → перенос строки (поведение по умолчанию).
- Валидация перед отправкой: `trim().length > 0 && length <= 2000`.
- Счётчик символов показывается при `length > 1800`.
- Disabled-состояние поля и кнопки на время ожидания ответа (конфигурируемо — можно разрешить постановку в очередь на v2).

### 5.2 `SendButton`
- `disabled = inputValue.trim().length === 0 || isSending`.
- Состояния: default → hover → active → disabled → loading (спиннер вместо иконки).
- `aria-label="Отправить сообщение"`.

### 5.3 `TypingIndicator`
- Показывается при получении SSE-события `typing` или сразу после отправки сообщения (оптимистично), скрывается по событию `token`/`done`/`error`.
- Таймаут: если за 15 сек нет `token`/`done` — показать сообщение об ошибке, скрыть индикатор.
- Анимация: 3 точки, CSS `@keyframes` с задержкой `animation-delay` для эффекта пульсации.
- `aria-live="polite"` для скринридеров с текстом «Агент печатает».

### 5.4 `MessageList`
- Автоскролл вниз при добавлении нового сообщения (`scrollIntoView` / `scrollTop = scrollHeight`), но с проверкой: если пользователь вручную проскроллил вверх — не скроллить принудительно, показать кнопку «↓ Новые сообщения».
- Виртуализация (`react-window`) — опционально, если история > 100 сообщений.
- Markdown-рендеринг через `react-markdown` + санитизация (`rehype-sanitize`).

### 5.5 `ChatHeader`
- Статус: `online` (зелёная точка) / `typing` (текст «печатает...») / `offline`/`error` (серая/красная точка).
- Кнопка «Новый диалог» — очищает `messages`, генерирует новый `sessionId`.

---

## 6. Дизайн-система

### 6.1 Цветовые токены (пример)

```css
--color-primary: #4F46E5;        /* акцент, кнопка отправки */
--color-primary-hover: #4338CA;
--color-bg: #FFFFFF;
--color-bg-secondary: #F9FAFB;
--color-bubble-user: #4F46E5;
--color-bubble-user-text: #FFFFFF;
--color-bubble-agent: #F3F4F6;
--color-bubble-agent-text: #111827;
--color-border: #E5E7EB;
--color-error: #DC2626;
--color-text-muted: #6B7280;

/* Тёмная тема (v2) */
--color-bg-dark: #111827;
--color-bubble-agent-dark: #1F2937;
```

### 6.2 Типографика
- Шрифт: `Inter, system-ui, sans-serif`.
- Размер основного текста: `14px` (mobile) / `15px` (desktop).
- Line-height: `1.5`.

### 6.3 Брейкпоинты

```css
/* mobile-first */
--bp-tablet: 481px;
--bp-desktop: 1025px;
```

| Диапазон | Поведение |
|---|---|
| ≤480px | Full-screen чат, поле ввода fixed внизу, шапка компактная |
| 481–1024px | Чат как модальное окно/виджет, ширина ~420px |
| >1024px | Виджет в углу экрана или центрированная колонка (в зависимости от способа встраивания) |

### 6.4 Анимации
- Появление сообщения: `fade-in + translateY(8px → 0)`, `duration: 200ms`.
- Индикатор набора текста: пульсация точек, `duration: 1.2s`, `infinite`.
- Hover/active кнопок: `transition: 150ms ease`.

---

## 7. Обработка ошибок и edge cases

| Сценарий | Поведение |
|---|---|
| Нет соединения с сетью | Баннер «Нет подключения к интернету», кнопка отправки заблокирована |
| Ошибка на backend/LLM | Сообщение агента заменяется на «Не удалось получить ответ» + кнопка «Повторить» |
| Таймаут ответа (>15 сек) | Скрыть индикатор набора текста, показать ошибку |
| Превышен лимит символов | Кнопка отправки disabled, подсветка счётчика красным |
| Пустой ввод | Кнопка отправки disabled |
| Двойная отправка (спам по Enter) | Debounce/lock на время `isSending` |

---

## 8. Доступность (Accessibility) — реализация

- Лента сообщений: `role="log"`, `aria-live="polite"`, `aria-relevant="additions"`.
- `TypingIndicator`: `aria-live="polite"`, скрытый текст «Агент печатает сообщение».
- Все интерактивные элементы доступны по `Tab`, видимый `focus-visible` outline.
- Контраст текста/фона — не ниже 4.5:1 (WCAG AA).

---

## 9. Тестирование

| Тип | Инструмент | Покрытие |
|---|---|---|
| Unit-тесты компонентов | Vitest + React Testing Library | ChatInput, SendButton, TypingIndicator |
| Интеграционные тесты | React Testing Library | Полный флоу отправки сообщения → получения ответа |
| E2E | Playwright | Сценарии на мобильном и десктоп вьюпорте |
| Визуальная регрессия | Chromatic / Percy (опционально) | Основные состояния UI |

---

## 10. План разработки (этапы)

1. **Этап 1 — Каркас (1 неделя)**
   Верстка ChatWindow, ChatInput, ChatHeader без реальной логики (моковые данные).
2. **Этап 2 — Интеграция с backend (1 неделя)**
   API-шлюз, SSE-стриминг, реальные ответы от Claude.
3. **Этап 3 — Индикатор набора текста и полировка UX (3–4 дня)**
   Анимации, обработка ошибок, таймауты.
4. **Этап 4 — Адаптив и доступность (3–4 дня)**
   Тестирование на реальных мобильных устройствах, доработка a11y.
5. **Этап 5 — QA и релиз (3 дня)**
   E2E-тесты, багфиксинг, деплой.

---

## 11. Открытые технические вопросы

- Способ встраивания виджета на сторонние сайты — `<script>`-сниппет с iframe или прямая интеграция React-компонента?
- Нужна ли поддержка streaming на уровне Anthropic API сразу в MVP или можно начать с обычного (non-streaming) запроса и индикатора-заглушки на фиксированное время?
- Формат хранения `sessionId` — cookie, localStorage или query-param (влияет на возможность шаринга ссылки на диалог)?
