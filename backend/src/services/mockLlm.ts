import type { ChatHistoryEntry, Locale } from '../types.js';
import { scenarios, fallbackResponses, getSuggestions, type Scenario } from './scenarios.js';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const APOSTROPHE_PATTERN = /[‘’ʻʼ`´]/g;

/** Приводит разные варианты апострофа (‘ ’ ʻ ʼ) и регистр к единому виду. */
function normalize(text: string): string {
  return text.toLowerCase().replace(APOSTROPHE_PATTERN, "'");
}

/** Ключевые слова сценария плюс сам вопрос FAQ — клик по FAQ всегда попадает в свой сценарий. */
function getKeywords(scenario: Scenario, locale: Locale): string[] {
  return [...scenario[locale].keywords, scenario[locale].question];
}

function scoreKeywords(normalizedText: string, keywords: string[]): number {
  return keywords.reduce(
    (score, keyword) => (normalizedText.includes(normalize(keyword)) ? score + 1 : score),
    0
  );
}

export interface MockReply {
  text: string;
  suggestions: string[];
}

/**
 * Сопоставляет сообщение пользователя с банком сценариев поддержки по
 * ключевым словам и возвращает правдоподобный ответ агента, не раскрывая
 * mock-природу режима, плюс подсказки для продолжения диалога.
 */
export async function getMockResponse(
  message: string,
  _history: ChatHistoryEntry[],
  locale: Locale
): Promise<MockReply> {
  const normalizedText = normalize(message);

  let bestScenario: Scenario | null = null;
  let bestScore = 0;

  for (const scenario of scenarios) {
    const score = scoreKeywords(normalizedText, getKeywords(scenario, locale));
    if (score > bestScore) {
      bestScore = score;
      bestScenario = scenario;
    }
  }

  if (bestScenario) {
    return {
      text: pick(bestScenario[locale].responses),
      suggestions: getSuggestions(bestScenario.id, locale),
    };
  }

  return {
    text: pick(fallbackResponses[locale]),
    suggestions: getSuggestions(null, locale),
  };
}
