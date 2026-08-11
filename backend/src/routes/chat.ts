import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { DEFAULT_LOCALE, isLocale, type ChatMessageRequestBody, type Locale } from '../types.js';
import { appendHistory, createSession, getOrCreateSession } from '../services/sessionStore.js';
import { getLlmResponse } from '../services/llmService.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { getFaqCategories } from '../services/scenarios.js';

export const chatRouter = Router();

const LLM_TIMEOUT_MS = 12_000;
const TOKEN_CHUNK_DELAY_MS = 25;
const MAX_MESSAGE_LENGTH = 2000;

const ERROR_MESSAGES: Record<Locale, { invalid: string; timeout: string; generic: string }> = {
  ru: {
    invalid: 'Некорректное сообщение',
    timeout: 'Превышено время ожидания ответа. Попробуйте снова.',
    generic: 'Не удалось получить ответ, попробуйте снова',
  },
  uz: {
    invalid: 'Xabar noto‘g‘ri',
    timeout: 'Javob kutish vaqti tugadi. Qaytadan urinib ko‘ring.',
    generic: 'Javobni olib bo‘lmadi, qaytadan urinib ko‘ring',
  },
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('LLM_TIMEOUT')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function sseSend(res: import('express').Response, event: string, data: unknown): void {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function chunkIntoWords(text: string): string[] {
  const parts = text.split(/(\s+)/).filter((p) => p.length > 0);
  return parts;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

chatRouter.post('/session', (_req, res) => {
  const session = createSession();
  res.json({ sessionId: session.id });
});

chatRouter.get('/faq', (req, res) => {
  const rawLocale = req.query.locale;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  res.json({ categories: getFaqCategories(locale) });
});

chatRouter.post('/message', rateLimit, async (req, res) => {
  const { sessionId, message, locale: rawLocale } = req.body as ChatMessageRequestBody;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const trimmed = (message ?? '').trim();
  if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ message: ERROR_MESSAGES[locale].invalid });
    return;
  }

  const session = getOrCreateSession(sessionId);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  let clientClosed = false;
  res.on('close', () => {
    clientClosed = true;
  });

  sseSend(res, 'typing', {});

  try {
    const historyForLlm = session.history.map((h) => ({ role: h.role, content: h.content }));
    const reply = await withTimeout(getLlmResponse(trimmed, historyForLlm, locale), LLM_TIMEOUT_MS);

    if (clientClosed) return;

    appendHistory(session, { role: 'user', content: trimmed });
    appendHistory(session, { role: 'assistant', content: reply.text });

    for (const chunk of chunkIntoWords(reply.text)) {
      if (clientClosed) return;
      sseSend(res, 'token', { text: chunk });
      await delay(TOKEN_CHUNK_DELAY_MS);
    }

    if (clientClosed) return;
    sseSend(res, 'done', {
      messageId: randomUUID(),
      sessionId: session.id,
      suggestions: reply.suggestions,
    });
  } catch (err) {
    console.error('[chat/message] LLM error:', err);
    if (!clientClosed) {
      const timedOut = err instanceof Error && err.message === 'LLM_TIMEOUT';
      sseSend(res, 'error', {
        message: timedOut ? ERROR_MESSAGES[locale].timeout : ERROR_MESSAGES[locale].generic,
      });
    }
  } finally {
    res.end();
  }
});
