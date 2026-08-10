import { create } from 'zustand';
import type { Locale } from '../types/chat.types';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'support-agent:theme';
const LOCALE_STORAGE_KEY = 'support-agent:locale';

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored === 'ru' || stored === 'uz' ? stored : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeClass(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage недоступен — тема не сохранится между визитами
  }
}

function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // localStorage недоступен — язык не сохранится между визитами
  }
}

interface SettingsStore {
  theme: Theme;
  locale: Locale;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const initialTheme = readStoredTheme() ?? getSystemTheme();
applyThemeClass(initialTheme);

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  theme: initialTheme,
  locale: readStoredLocale() ?? 'ru',

  setTheme: (theme) => {
    applyThemeClass(theme);
    persistTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light';
    applyThemeClass(next);
    persistTheme(next);
    set({ theme: next });
  },

  setLocale: (locale) => {
    persistLocale(locale);
    set({ locale });
  },

  toggleLocale: () => {
    const next: Locale = get().locale === 'ru' ? 'uz' : 'ru';
    persistLocale(next);
    set({ locale: next });
  },
}));
