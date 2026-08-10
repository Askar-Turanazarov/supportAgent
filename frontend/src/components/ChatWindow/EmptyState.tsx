import { useTranslations } from '../../hooks/useTranslations';

interface EmptyStateProps {
  onQuickReply: (text: string) => void;
  onOpenFaq: () => void;
}

export function EmptyState({ onQuickReply, onOpenFaq }: EmptyStateProps) {
  const { t } = useTranslations();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center animate-message-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-[#5AC8FA]/15 text-2xl">
        👋
      </div>
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight text-black dark:text-white">
          {t.empty.title}
        </h2>
        <p className="mt-1 text-[13px] text-black/50 dark:text-white/50">{t.empty.subtitle}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {t.empty.quickReplies.map((reply) => (
          <button
            key={reply}
            type="button"
            onClick={() => onQuickReply(reply)}
            className="rounded-full border border-black/10 bg-surface px-3 py-1.5 text-[12px] text-black transition-all duration-200 hover:border-primary hover:text-primary active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-primary-dark dark:hover:text-primary-dark"
          >
            {reply}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onOpenFaq}
        className="text-[12px] font-medium text-primary underline-offset-2 transition-opacity duration-200 hover:underline active:opacity-70 dark:text-primary-dark"
      >
        {t.faq.buttonAria} →
      </button>
    </div>
  );
}
