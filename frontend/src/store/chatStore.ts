import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type { Message } from '../types/chat.types';

const SESSION_STORAGE_KEY = 'support-agent:sessionId';

function readStoredSessionId(): string | null {
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function persistSessionId(sessionId: string): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  } catch {
    // sessionStorage недоступен (приватный режим и т.п.) — просто не сохраняем
  }
}

interface ChatStore {
  messages: Message[];
  isAgentTyping: boolean;
  /** true с момента отправки сообщения и до полного завершения стрима ответа
   * (включая пословное появление текста) — управляет статусом "печатает…"
   * в шапке чата, в отличие от isAgentTyping, который гаснет уже на первом
   * токене (когда точки-индикатор сменяется растущим текстом). */
  isResponding: boolean;
  isConnected: boolean;
  sessionId: string;
  hasStoredSession: boolean;

  setSessionId: (sessionId: string) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, patch: Partial<Message>) => void;
  appendToMessage: (id: string, textChunk: string) => void;
  setAgentTyping: (isTyping: boolean) => void;
  setResponding: (isResponding: boolean) => void;
  setConnected: (isConnected: boolean) => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isAgentTyping: false,
  isResponding: false,
  isConnected: true,
  sessionId: readStoredSessionId() ?? '',
  hasStoredSession: readStoredSessionId() !== null,

  setSessionId: (sessionId) => {
    persistSessionId(sessionId);
    set({ sessionId });
  },

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessage: (id, patch) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    })),

  appendToMessage: (id, textChunk) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + textChunk } : m
      ),
    })),

  setAgentTyping: (isAgentTyping) => set({ isAgentTyping }),
  setResponding: (isResponding) => set({ isResponding }),
  setConnected: (isConnected) => set({ isConnected }),

  resetChat: () => {
    const newSessionId = uuid();
    persistSessionId(newSessionId);
    set({ messages: [], isAgentTyping: false, isResponding: false, sessionId: newSessionId });
  },
}));
