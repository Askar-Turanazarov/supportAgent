import type { Locale } from '../types.js';

const APOSTROPHE_PATTERN = /[‘’ʻʼ`´]/g;
const WORD_PATTERN = /[a-zа-яё0-9']+/giu;

/**
 * Синонимы с другим корнем (словоформы уже покрываются нечётким
 * сравнением ниже) — приводятся к общему "каноническому" слову, чтобы
 * не заводить для каждого синонима отдельную ветку в банке сценариев.
 */
const SYNONYMS: Record<Locale, Record<string, string>> = {
  ru: {
    'средства': 'деньги',
    'сумма': 'деньги',
    'платеж': 'оплата',
    'платёж': 'оплата',
    'списание': 'оплата',
    'имейл': 'почта',
    'емайл': 'почта',
    'мыло': 'почта',
    'email': 'почта',
    'мейл': 'почта',
    'апп': 'приложение',
    'программа': 'приложение',
    'баг': 'ошибка',
    'глюк': 'ошибка',
    'косяк': 'ошибка',
    'веб': 'сайт',
    'платформа': 'сайт',
    'акк': 'аккаунт',
    'профиль': 'аккаунт',
    'коллега': 'участник',
    'сотрудник': 'участник',
    'юзер': 'участник',
    'пользователь': 'участник',
    'лагает': 'тормозит',
    'глючит': 'тормозит',
  },
  uz: {
    'pochta': 'email',
    'meyl': 'email',
    'dastur': 'ilova',
    'app': 'ilova',
    'xato': 'xatolik',
    'nosozlik': 'xatolik',
    'sayt': 'veb',
    'platforma': 'veb',
    'hamkasb': 'a\'zo',
    'xodim': 'a\'zo',
    'foydalanuvchi': 'a\'zo',
    'sekinlashdi': 'sekin',
  },
};

function commonPrefixLength(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return i;
}

/**
 * Сравнивает два слова с допуском на словоформы (падежи, число, лицо,
 * узбекские аффиксы и т.д.): слова совпадают, если общее начало не короче
 * (длина_меньшего_слова − 2) и не короче 5 символов — то есть могут
 * отличаться максимум последними 1-2 буквами (типичная длина
 * окончания/суффикса). Слова короче 4 символов (акронимы вроде "2fa",
 * "gdpr") сравниваются строго, без допуска.
 *
 * Порог в 5, а не 4, не случаен: при пороге 4 слова вроде "привет" и
 * "привязать" (разные корни, случайно начинающиеся на "прив") тоже
 * считались бы совпадением — это давало реальные ложные срабатывания
 * (см. регрессионный тест). Единственная цена такого ужесточения —
 * отдельные короткие узбекские глагольные формы с расхождением на 5-м
 * символе (например, "unutdim"/"unutib") перестают фаззи-совпадать, но
 * для них так же не совпадал и предыдущий точный алгоритм.
 */
function wordsMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const minLen = Math.min(a.length, b.length);
  if (minLen < 4) return false;
  const threshold = Math.max(5, minLen - 2);
  return commonPrefixLength(a, b) >= threshold;
}

function canonicalize(word: string, locale: Locale): string {
  const dict = SYNONYMS[locale];
  for (const variant in dict) {
    if (wordsMatch(word, variant)) return dict[variant];
  }
  return word;
}

/**
 * Стоп-слова намеренно не отфильтровываются: фраза-ключ остаётся полным
 * набором требуемых слов, как и в исходном алгоритме точного вхождения
 * подстроки. Ранняя версия вырезала слова вроде "мои" — из-за этого ключ
 * "мои данные" схлопывался до одного общего слова "данные" и начинал
 * ложно перекрывать почти все технические сценарии, где встречается это
 * слово (экспорт/импорт/синхронизация и т.д.).
 */
function tokenize(text: string, locale: Locale): string[] {
  const normalized = text.toLowerCase().replace(APOSTROPHE_PATTERN, "'");
  const raw = normalized.match(WORD_PATTERN) ?? [];
  return raw.map((word) => canonicalize(word, locale));
}

/** Все ли слова фразы-ключа встречаются (в любой форме/синониме) среди токенов сообщения. */
function phraseMatches(keywordTokens: string[], messageTokens: string[]): boolean {
  if (keywordTokens.length === 0) return false;
  return keywordTokens.every((kw) => messageTokens.some((mt) => wordsMatch(kw, mt)));
}

/**
 * Возвращает "силу" совпадения сообщения с банком фраз `phrases` — длину
 * (в словах) самой длинной полностью совпавшей фразы, либо 0, если ни
 * одна не совпала. С допуском на словоформы, порядок слов и синонимы, что
 * позволяет естественным перефразировкам («забыла свой пароль», «не могу
 * вспомнить пароль от аккаунта») попадать в нужный сценарий.
 *
 * Считаем максимум, а не сумму по всем совпавшим фразам: банк сценариев
 * местами перечисляет словоформы одного слова как отдельные ключи
 * ("тариф" и "тарифы" — раньше это был обходной приём для точного
 * сравнения). Под нечётким сравнением обе формы совпадают с одним и тем
 * же словом сообщения; суммирование дало бы генеричным ключам
 * необоснованное преимущество перед более специфичной, но однократной
 * фразой в 2-3 слова у другого сценария.
 */
export function scorePhrases(message: string, phrases: string[], locale: Locale): number {
  const messageTokens = tokenize(message, locale);
  if (messageTokens.length === 0) return 0;

  let best = 0;
  for (const phrase of phrases) {
    const keywordTokens = tokenize(phrase, locale);
    if (keywordTokens.length > best && phraseMatches(keywordTokens, messageTokens)) {
      best = keywordTokens.length;
    }
  }
  return best;
}
