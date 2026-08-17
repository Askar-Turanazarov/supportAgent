import Anthropic from '@anthropic-ai/sdk';
import type { ChatHistoryEntry, Locale } from '../types.js';
import { buildSystemPrompt } from './systemPrompt.js';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function getAnthropicResponse(
  message: string,
  history: ChatHistoryEntry[],
  locale: Locale
): Promise<string> {
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

  const response = await getClient().messages.create({
    model,
    max_tokens: 1024,
    system: buildSystemPrompt(locale),
    messages: [...history, { role: 'user', content: message }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock && 'text' in textBlock ? textBlock.text : '';
}
