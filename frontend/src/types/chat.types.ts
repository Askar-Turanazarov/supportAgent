export type MessageRole = 'user' | 'agent';

export type MessageStatus = 'sending' | 'sent' | 'error';

export type Locale = 'ru' | 'uz';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  status?: MessageStatus;
  isStreaming?: boolean;
  rating?: number;
  suggestions?: string[];
}

export interface ChatState {
  messages: Message[];
  isAgentTyping: boolean;
  isConnected: boolean;
  sessionId: string;
}

export interface FaqItem {
  id: string;
  question: string;
}

export interface FaqCategory {
  category: string;
  label: string;
  items: FaqItem[];
}

export type ChatSseEvent =
  | { event: 'typing'; data: Record<string, never> }
  | { event: 'token'; data: { text: string } }
  | { event: 'done'; data: { messageId: string; sessionId?: string; suggestions?: string[] } }
  | { event: 'error'; data: { message: string } };
