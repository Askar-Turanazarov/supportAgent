import type { FaqCategory, Locale } from '../types/chat.types';
import { getTranslations } from '../i18n/translations';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface StreamHandlers {
  onTyping?: () => void;
  onToken?: (text: string) => void;
  onDone?: (messageId: string, sessionId?: string, suggestions?: string[]) => void;
  onError?: (message: string) => void;
}

export async function createSession(): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/chat/session`, { method: 'POST' });
  if (!res.ok) throw new Error('Не удалось создать сессию');
  const data = (await res.json()) as { sessionId: string };
  return data.sessionId;
}

export async function fetchFaq(locale: Locale): Promise<FaqCategory[]> {
  const res = await fetch(`${API_BASE_URL}/api/chat/faq?locale=${locale}`);
  if (!res.ok) throw new Error('Не удалось загрузить FAQ');
  const data = (await res.json()) as { categories: FaqCategory[] };
  return data.categories;
}

function parseSseBlock(block: string): { event: string; data: string } | null {
  let event = 'message';
  const dataLines: string[] = [];

  for (const line of block.split('\n')) {
    if (line.startsWith('event:')) {
      event = line.slice('event:'.length).trim();
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice('data:'.length).trim());
    }
  }

  if (dataLines.length === 0) return null;
  return { event, data: dataLines.join('\n') };
}

/**
 * Отправляет сообщение и разбирает потоковый SSE-ответ backend.
 * Используется fetch + ReadableStream вместо EventSource, т.к. EventSource
 * не поддерживает POST-запросы с телом.
 */
export async function streamChatMessage(
  sessionId: string,
  message: string,
  locale: Locale,
  handlers: StreamHandlers,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message, locale }),
    signal,
  });

  if (!res.ok || !res.body) {
    handlers.onError?.(getTranslations(locale).message.error);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() ?? '';

    for (const block of blocks) {
      const parsed = parseSseBlock(block);
      if (!parsed) continue;

      switch (parsed.event) {
        case 'typing':
          handlers.onTyping?.();
          break;
        case 'token': {
          const payload = JSON.parse(parsed.data) as { text: string };
          handlers.onToken?.(payload.text);
          break;
        }
        case 'done': {
          const payload = JSON.parse(parsed.data) as {
            messageId: string;
            sessionId?: string;
            suggestions?: string[];
          };
          handlers.onDone?.(payload.messageId, payload.sessionId, payload.suggestions);
          break;
        }
        case 'error': {
          const payload = JSON.parse(parsed.data) as { message: string };
          handlers.onError?.(payload.message);
          break;
        }
        default:
          break;
      }
    }
  }
}
