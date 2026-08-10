import type { ChatHistoryEntry, Locale } from '../types.js';
import { getMockResponse } from './mockLlm.js';
import { getAnthropicResponse } from './anthropicLlm.js';

function isMockMode(): boolean {
  if (process.env.USE_MOCK_LLM === 'true') return true;
  if (process.env.USE_MOCK_LLM === 'false') return false;
  return !process.env.ANTHROPIC_API_KEY;
}

export function getLlmMode(): 'mock' | 'anthropic' {
  return isMockMode() ? 'mock' : 'anthropic';
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
  if (isMockMode()) {
    return getMockResponse(message, history, locale);
  }
  const text = await getAnthropicResponse(message, history, locale);
  return { text, suggestions: [] };
}
