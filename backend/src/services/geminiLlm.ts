import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import type { ChatHistoryEntry, Locale } from '../types.js';
import { buildSystemPrompt } from './systemPrompt.js';

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

export async function getGeminiResponse(
  message: string,
  history: ChatHistoryEntry[],
  locale: Locale
): Promise<string> {
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

  const contents = [
    ...history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const response = await getClient().models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: buildSystemPrompt(locale),
      maxOutputTokens: 1024,
      thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
    },
  });

  return response.text ?? '';
}
