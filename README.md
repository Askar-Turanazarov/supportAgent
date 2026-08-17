# 🤖 AI Support Agent

**EN:** A polished MVP support-chat web app — a React SPA talking to a Node.js gateway over real SSE streaming, with a bank of 44 realistic support scenarios in Russian and Uzbek, a pluggable LLM brain (Google Gemini or Anthropic Claude) with a locally-configurable persona/topic-restriction prompt, an animated 3D robot avatar that tracks your cursor, an Apple-inspired UI with true light/dark themes and a live glass header, an in-chat FAQ, per-answer ratings, and follow-up question suggestions. Runs out of the box with **zero API keys** — flip on a real Gemini or Claude key any time to go live.

**RU:** Готовый MVP веб-чата поддержки — SPA на React, общающийся с Node.js-шлюзом через настоящий потоковый SSE, банк из 44 реалистичных сценариев поддержки на русском и узбекском, подключаемый ИИ-«мозг» (Google Gemini или Anthropic Claude) с настраиваемым локально промптом персоны/тематических ограничений, анимированная 3D-аватарка робота, следящая за курсором, дизайн в духе Apple со светлой/тёмной темой и живым glass-эффектом в шапке, встроенный FAQ, оценка ответов и подсказки для продолжения диалога. Работает **без единого API-ключа** «из коробки» — реальный ключ Gemini или Claude можно подключить в любой момент.

<p align="center">
  <a href="#english">English</a> ·
  <a href="#русский">Русский</a>
</p>

---

<a id="english"></a>
## 🇬🇧 English

### ✨ Features

- **Streamed chat UX** — backend transmits every reply over Server-Sent Events (`typing` → `token`* → `done`/`error`), giving a real "agent is typing…" effect.
- **44 realistic support scenarios**, bilingual (RU/UZ) — password resets, billing, subscriptions, technical issues, team access, and more. Keyword-matched, no LLM call required.
- **Mock mode by default** — no API key needed to try the whole product. Drop in a real `GEMINI_API_KEY` (or `ANTHROPIC_API_KEY`) to switch to live LLM responses.
- **Pluggable, locally-tunable system prompt** — the agent's persona and topic restrictions live in `backend/prompt.local.txt`, a git-ignored plain-text file (copy `backend/prompt.example.txt` to get started). Edit it and the very next message uses the new behavior — no restart needed. This is how you'd turn the generic support bot into, say, a medical-only clinic assistant that redirects off-topic questions to a phone number, without touching any code.
- **In-chat FAQ** — a glass modal listing all scenarios grouped by category; tap a question to send it straight into the chat.
- **Follow-up suggestions** — after every scenario-matched reply, 2–3 related questions appear as tappable chips, so the mock conversation keeps flowing naturally.
- **1–5 star ratings** on every agent reply (client-side, cosmetic).
- **Animated 3D avatar** — a robot head rendered in layered SVG with real CSS 3D transforms; it tilts to follow the cursor via `perspective` + `rotateX/rotateY`, with a pulsing antenna and a scanning visor.
- **Apple-style design** — system font stack, iOS color palette, spring animations, iMessage-like bubbles with a subtle sage tint, a genuine glass/vibrancy header and input bar (content visibly scrolls *underneath* the blur, not just behind flat transparency).
- **Light & dark themes**, deep "midnight navy" dark background instead of flat black, off-white (not stark white) light surface — toggle in the header, persisted, defaults to system preference.
- **Russian / Uzbek language switcher** — flips the entire UI and the agent's scenario language.
- **Accessibility & edge cases** — `aria-live` regions, keyboard-first input, offline banner, retry on error, 15s response timeout, character limits.

### 🧱 Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript, Vite, Tailwind CSS, Zustand |
| Backend | Node.js + Express, Server-Sent Events |
| LLM | Google Gemini API or Anthropic Claude API (optional — mock mode by default) |
| Markdown | `react-markdown` + `rehype-sanitize` |

### 🚀 Quick start

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev          # http://localhost:3001 (mock mode by default)
```

```bash
# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev           # http://localhost:5173
```

To use a real LLM instead of mock responses, set `GEMINI_API_KEY` (Google Gemini, used by default when present) or `ANTHROPIC_API_KEY` (Claude) in `backend/.env`. Set `LLM_PROVIDER=gemini|anthropic|mock` to force a specific provider regardless of which keys are set.

### 🎭 Customizing the agent's persona

The LLM's system prompt (persona, tone, topic restrictions, escalation instructions, etc.) is **not** hardcoded — it's read fresh from `backend/prompt.local.txt` on every message.

```bash
cd backend
cp prompt.example.txt prompt.local.txt
# edit prompt.local.txt — no restart needed, next message picks it up
```

`prompt.local.txt` is git-ignored, so anything sensitive you put there (a real clinic phone number, internal policy, etc.) never leaves your machine. If the file doesn't exist, the backend falls back to a built-in generic prompt so it still works out of the box.

### 📡 API

- `POST /api/chat/session` — create a session, returns `{ sessionId }`
- `POST /api/chat/message` — `{ sessionId, message, locale }` → SSE stream (`typing`, `token`*, `done` with `suggestions`, or `error`)
- `GET /api/chat/faq?locale=ru|uz` — FAQ questions grouped by category
- `GET /api/health` — status + current LLM mode (`mock` / `anthropic` / `gemini`)

### 📁 Project structure

```
support-agent/
├── backend/
│   ├── prompt.example.txt   # tracked template for the agent's system prompt
│   ├── prompt.local.txt     # your real prompt — git-ignored (copy from the example above)
│   └── src/                 # Express API gateway, LLM adapters, mock scenario bank, SSE streaming
└── frontend/   # React SPA (chat UI, FAQ modal, theme/language settings)
```

---

<a id="русский"></a>
## 🇷🇺 Русский

### ✨ Возможности

- **Потоковый чат** — backend передаёт ответ через Server-Sent Events (`typing` → `token`* → `done`/`error`), создавая настоящий эффект «агент печатает…».
- **44 реалистичных сценария поддержки** на русском и узбекском — сброс пароля, оплата, подписки, технические проблемы, доступ команды и т.д. Подбираются по ключевым словам, без обращения к LLM.
- **Mock-режим по умолчанию** — можно попробовать весь продукт без API-ключа. Впишите `GEMINI_API_KEY` (или `ANTHROPIC_API_KEY`), чтобы подключить реальную LLM.
- **Подключаемый и настраиваемый локально системный промпт** — персона агента и тематические ограничения живут в `backend/prompt.local.txt`, обычном текстовом файле в `.gitignore` (скопируйте `backend/prompt.example.txt`, чтобы начать). Отредактировали файл — уже следующее сообщение отвечает по-новому, перезапуск не нужен. Так, например, обычного бота поддержки превращают в медицинского ассистента клиники, который отвечает только на вопросы про здоровье и перенаправляет остальное на номер телефона — без единой строчки кода.
- **FAQ прямо в чате** — glass-модалка со всеми сценариями по категориям; клик по вопросу сразу отправляет его в диалог.
- **Подсказки для продолжения** — после каждого ответа по сценарию появляются 2–3 связанных вопроса в виде чипсов, чтобы диалог развивался естественно.
- **Оценка ответов** от 1 до 5 звёзд под каждым сообщением агента (косметика на клиенте).
- **Анимированная 3D-аватарка** — голова робота на слоистом SVG с настоящими CSS 3D-трансформациями: поворачивается вслед за курсором через `perspective` + `rotateX/rotateY`, пульсирующая антенна, «сканирующий» визор.
- **Дизайн в стиле Apple** — системный шрифт, палитра iOS, пружинные анимации, пузыри в духе iMessage с едва заметным зелёным подтоном, настоящий glass-эффект в шапке и поле ввода (контент реально видно сквозь размытие при скролле, а не плоская полупрозрачность).
- **Светлая и тёмная темы** — глубокий «дорогой» тёмно-синий фон вместо чистого чёрного, тёплый off-white вместо чистого белого; переключатель в шапке, выбор сохраняется, по умолчанию берётся системная тема.
- **Переключатель RU/UZ** — меняет весь интерфейс и язык ответов агента.
- **Доступность и edge cases** — `aria-live`, управление с клавиатуры, баннер офлайна, повтор при ошибке, таймаут ответа 15 сек, лимит символов.

### 🧱 Стек технологий

| Слой | Технология |
|---|---|
| Frontend | React 18 + TypeScript, Vite, Tailwind CSS, Zustand |
| Backend | Node.js + Express, Server-Sent Events |
| LLM | Google Gemini API или Anthropic Claude API (опционально — по умолчанию mock-режим) |
| Markdown | `react-markdown` + `rehype-sanitize` |

### 🚀 Быстрый старт

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev          # http://localhost:3001 (mock-режим по умолчанию)
```

```bash
# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev           # http://localhost:5173
```

Чтобы подключить настоящую LLM вместо mock-ответов, впишите `GEMINI_API_KEY` (Google Gemini, используется по умолчанию, если задан) или `ANTHROPIC_API_KEY` (Claude) в `backend/.env`. Переменная `LLM_PROVIDER=gemini|anthropic|mock` позволяет явно выбрать провайдера независимо от того, какие ключи заданы.

### 🎭 Настройка персоны агента

Системный промпт LLM (персона, тон, тематические ограничения, инструкции по эскалации и т.д.) **не зашит в код** — он читается заново из `backend/prompt.local.txt` перед каждым сообщением.

```bash
cd backend
cp prompt.example.txt prompt.local.txt
# отредактируйте prompt.local.txt — перезапуск не нужен, следующее сообщение уже учтёт изменения
```

`prompt.local.txt` в `.gitignore`, поэтому всё чувствительное, что вы туда впишете (реальный номер телефона клиники, внутренние правила и т.д.), никогда не покинет вашу машину. Если файла нет, backend использует встроенный запасной промпт — работает и без него.

### 📡 API

- `POST /api/chat/session` — создать сессию, вернёт `{ sessionId }`
- `POST /api/chat/message` — `{ sessionId, message, locale }` → SSE-поток (`typing`, `token`*, `done` с `suggestions`, либо `error`)
- `GET /api/chat/faq?locale=ru|uz` — вопросы FAQ, сгруппированные по категориям
- `GET /api/health` — статус и текущий режим LLM (`mock` / `anthropic` / `gemini`)

### 📁 Структура проекта

```
support-agent/
├── backend/
│   ├── prompt.example.txt   # трекаемый шаблон системного промпта агента
│   ├── prompt.local.txt     # ваш реальный промпт — в .gitignore (скопируйте с примера выше)
│   └── src/                 # Express API-шлюз, адаптеры LLM, банк mock-сценариев, SSE-стриминг
└── frontend/   # React SPA (чат, FAQ-модалка, настройки темы/языка)
```

---

<p align="center"><sub>Built as an MVP prototype · Собрано как MVP-прототип</sub></p>
