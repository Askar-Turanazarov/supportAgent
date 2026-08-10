import { useSettingsStore } from '../../store/settingsStore';
import { useTranslations } from '../../hooks/useTranslations';
import type { Locale } from '../../types/chat.types';

const OPTIONS: Locale[] = ['ru', 'uz'];

export function LanguageToggle() {
  const locale = useSettingsStore((s) => s.locale);
  const setLocale = useSettingsStore((s) => s.setLocale);
  const { t } = useTranslations();

  return (
    <div
      role="group"
      aria-label={t.language.toggleAria}
      className="relative flex h-8 items-center rounded-full bg-black/5 p-0.5 text-[11px] font-semibold dark:bg-white/10"
    >
      <div
        className="absolute h-7 w-8 rounded-full bg-white shadow-sm transition-transform duration-300 ease-spring dark:bg-white/90"
        style={{ transform: locale === 'ru' ? 'translateX(0)' : 'translateX(32px)' }}
      />
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          className={`relative z-10 flex h-7 w-8 items-center justify-center rounded-full uppercase transition-colors duration-200 ${
            locale === option ? 'text-black' : 'text-black/50 dark:text-white/50'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
