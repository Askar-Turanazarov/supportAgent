import type { ChatHistoryEntry, Locale } from '../types.js';
import { getMockResponse } from './mockLlm.js';
import { getAnthropicResponse } from './anthropicLlm.js';
import { getGeminiResponse } from './geminiLlm.js';

export type LlmMode = 'mock' | 'anthropic' | 'gemini';

function resolveMode(): LlmMode {
  if (process.env.USE_MOCK_LLM === 'true') return 'mock';

  const explicitProvider = process.env.LLM_PROVIDER?.toLowerCase();
  if (explicitProvider === 'gemini' || explicitProvider === 'anthropic' || explicitProvider === 'mock') {
    return explicitProvider;
  }

  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  return 'mock';
}

export function getLlmMode(): LlmMode {
  return resolveMode();
}

export interface LlmReply {
  text: string;
  suggestions: string[];
}

export async function getLlmResponse(
  message: string,
  history: ChatHistoryEntry[],
  locale: Locale
): Promise<LlmReply> {
  const mode = resolveMode();

  if (mode === 'mock') {
    return getMockResponse(message, history, locale);
  }
  if (mode === 'gemini') {
    const text = await getGeminiResponse(message, history, locale);
    return { text, suggestions: [] };
  }
  const text = await getAnthropicResponse(message, history, locale);
  return { text, suggestions: [] };
}
