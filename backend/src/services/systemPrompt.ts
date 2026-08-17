import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { Locale } from '../types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = path.resolve(__dirname, '../..');
const LOCAL_PROMPT_PATH = path.join(BACKEND_ROOT, 'prompt.local.txt');

const LOCALE_NAME: Record<Locale, string> = {
  ru: 'русском',
  uz: 'узбекском (латиница)',
};

const FALLBACK_PROMPT = [
  'Ты — вежливый и лаконичный ИИ-агент поддержки медицинской клиники.',
  'Отвечай ТОЛЬКО на вопросы, связанные с медициной, здоровьем, симптомами, услугами клиники и записью на приём.',
  'Если вопрос не связан с медициной — вежливо сообщи, что можешь помочь только по медицинским темам, ' +
    'и предложи связаться с клиникой по телефону (номер задайте в backend/prompt.local.txt).',
  'Не ставь диагнозы и не назначай лечение — только общая информация и направление к врачу.',
].join('\n');

function loadPromptBase(): string {
  if (existsSync(LOCAL_PROMPT_PATH)) {
    const content = readFileSync(LOCAL_PROMPT_PATH, 'utf-8').trim();
    if (content) return content;
  }
  return FALLBACK_PROMPT;
}

export function buildSystemPrompt(locale: Locale): string {
  const base = loadPromptBase();
  return (
    `${base}\n\n` +
    `Отвечай на ${LOCALE_NAME[locale]} языке, по существу, используя markdown только когда это уместно (списки, код).`
  );
}
