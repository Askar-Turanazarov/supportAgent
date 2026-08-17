import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { AgentAvatar } from './AgentAvatar';
import { useTranslations } from '../../hooks/useTranslations';

type AgentStatus = 'online' | 'typing' | 'offline';

interface ChatHeaderProps {
  status: AgentStatus;
  onNewChat: () => void;
  onOpenFaq: () => void;
}

export function ChatHeader({ status, onNewChat, onOpenFaq }: ChatHeaderProps) {
  const { t } = useTranslations();

  const statusConfig: Record<AgentStatus, { label: string; dotClass: string }> = {
    online: { label: t.status.online, dotClass: 'bg-[#34C759] animate-status-glow' },
    typing: { label: t.status.typing, dotClass: 'bg-[#34C759] animate-pulse' },
    offline: { label: t.status.offline, dotClass: 'bg-black/30 dark:bg-white/30' },
  };
  const { label, dotClass } = statusConfig[status];

  return (
    <header className="flex items-start justify-between gap-2 border-b border-black/10 bg-surface/60 px-4 py-3 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-surface-dark/60">
      <div className="flex min-w-0 items-center gap-3 pt-0.5">
        <AgentAvatar />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold tracking-tight text-black dark:text-white">
            {t.headerTitle}
          </p>
          <div className="flex items-center gap-1.5 text-[12px] text-black/50 dark:text-white/50">
            <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
            <span>{label}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <button
          type="button"
          onClick={onNewChat}
          className="flex h-8 items-center rounded-full bg-black/5 px-3 text-[12px] font-medium text-black/70 transition-colors duration-200 hover:bg-black/10 active:scale-95 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15"
        >
          {t.newChat}
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenFaq}
            aria-label={t.faq.buttonAria}
            className="flex h-8 w-8 items-center justify-center rounded-full text-black/60 transition-colors duration-200 hover:bg-black/5 active:scale-90 dark:text-white/60 dark:hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M9.5 9a2.5 2.5 0 114.2 1.85c-.6.55-1.2.9-1.2 1.9" />
              <circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          </button>
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
