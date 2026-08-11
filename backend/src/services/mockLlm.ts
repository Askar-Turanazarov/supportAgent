import type { ChatHistoryEntry, Locale } from '../types.js';
import { scenarios, fallbackResponses, getSuggestions, type Scenario } from './scenarios.js';
import { scorePhrases } from './textMatch.js';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Ключевые слова сценария плюс сам вопрос FAQ — клик по FAQ всегда попадает в свой сценарий. */
function getKeywords(scenario: Scenario, locale: Locale): string[] {
  return [...scenario[locale].keywords, scenario[locale].question];
}

export interface MockReply {
  text: string;
  suggestions: string[];
}

/**
 * Сопоставляет сообщение пользователя с банком сценариев поддержки по
 * ключевым словам (с допуском на словоформы и синонимы — см. textMatch.ts)
 * и возвращает правдоподобный ответ агента, не раскрывая mock-природу
 * режима, плюс подсказки для продолжения диалога.
 */
export async function getMockResponse(
  message: string,
  _history: ChatHistoryEntry[],
  locale: Locale
): Promise<MockReply> {
  let bestScenario: Scenario | null = null;
  let bestScore = 0;

  for (const scenario of scenarios) {
    const score = scorePhrases(message, getKeywords(scenario, locale), locale);
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
