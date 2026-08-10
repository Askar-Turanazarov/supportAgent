import { randomUUID } from 'node:crypto';
import type { ChatHistoryEntry, Session } from '../types.js';

const SESSION_TTL_MS = 1000 * 60 * 60 * 2; // 2 часа неактивности — сессия истекает
const MAX_HISTORY_ENTRIES = 40; // ограничение контекста, отправляемого в LLM

const sessions = new Map<string, Session>();

function purgeExpired(): void {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastActiveAt > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}

export function createSession(): Session {
  purgeExpired();
  const session: Session = {
    id: randomUUID(),
    history: [],
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  };
  sessions.set(session.id, session);
  return session;
}

export function getOrCreateSession(sessionId: string | undefined): Session {
  if (sessionId) {
    const existing = sessions.get(sessionId);
    if (existing) {
      existing.lastActiveAt = Date.now();
      return existing;
    }
  }
  return createSession();
}

export function appendHistory(session: Session, entry: ChatHistoryEntry): void {
  session.history.push(entry);
  if (session.history.length > MAX_HISTORY_ENTRIES) {
    session.history.splice(0, session.history.length - MAX_HISTORY_ENTRIES);
  }
  session.lastActiveAt = Date.now();
}
