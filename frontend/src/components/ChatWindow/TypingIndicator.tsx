import { useTranslations } from '../../hooks/useTranslations';

export function TypingIndicator() {
  const { t } = useTranslations();

  return (
    <div className="flex w-full animate-message-in justify-start" aria-live="polite">
      <div className="flex items-center gap-1 rounded-[18px] rounded-bl-[6px] bg-bubble-agent px-4 py-3 shadow-sm dark:bg-bubble-agent-dark">
        <span className="sr-only">{t.message.typingAria}</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-dot-pulse rounded-full bg-black/40 dark:bg-white/40"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
