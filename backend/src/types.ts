export type ChatRole = 'user' | 'assistant';

export type Locale = 'ru' | 'uz';

export const DEFAULT_LOCALE: Locale = 'ru';

export function isLocale(value: unknown): value is Locale {
  return value === 'ru' || value === 'uz';
}

export interface ChatHistoryEntry {
  role: ChatRole;
  content: string;
}

export interface Session {
  id: string;
  history: ChatHistoryEntry[];
  createdAt: number;
  lastActiveAt: number;
}

export interface ChatMessageRequestBody {
  sessionId?: string;
  message?: string;
  locale?: string;
}
