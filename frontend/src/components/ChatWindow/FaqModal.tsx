import { useEffect, useState } from 'react';
import { fetchFaq } from '../../services/chatApi';
import { useTranslations } from '../../hooks/useTranslations';
import type { FaqCategory } from '../../types/chat.types';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (question: string) => void;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-spring ${open ? 'rotate-180' : ''}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function FaqModal({ isOpen, onClose, onSelectQuestion }: FaqModalProps) {
  const { t, locale } = useTranslations();
  const [categories, setCategories] = useState<FaqCategory[] | null>(null);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setError(false);
    fetchFaq(locale)
      .then((data) => {
        if (cancelled) return;
        setCategories(data);
        setExpanded(new Set(data.length > 0 ? [data[0].category] : []));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, locale]);

  if (!isOpen) return null;

  const toggleCategory = (category: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm animate-message-in tablet:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[80vh] w-full flex-col rounded-t-[28px] border border-white/20 bg-surface/90 shadow-2xl backdrop-blur-2xl backdrop-saturate-150 animate-pop-in dark:border-white/10 dark:bg-surface-dark/90 tablet:max-w-[420px] tablet:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-black/10 px-5 py-4 dark:border-white/10">
          <div>
            <h2 className="text-[16px] font-semibold tracking-tight text-black dark:text-white">{t.faq.title}</h2>
            <p className="mt-0.5 text-[12px] text-black/50 dark:text-white/50">{t.faq.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.faq.closeAria}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 text-black/50 transition-colors duration-200 hover:bg-black/10 active:scale-90 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="chat-scroll overflow-y-auto px-3 py-2">
          {error && <p className="px-2 py-4 text-[13px] text-error dark:text-error-dark">{t.faq.error}</p>}
          {!error && !categories && (
            <p className="px-2 py-4 text-[13px] text-black/50 dark:text-white/50">{t.faq.loading}</p>
          )}
          {categories?.map((group) => {
            const isOpenGroup = expanded.has(group.category);
            return (
              <div key={group.category} className="border-b border-black/5 last:border-0 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => toggleCategory(group.category)}
                  className="flex w-full items-center justify-between gap-2 px-2 py-3 text-left"
                >
                  <span className="text-[13px] font-semibold text-black/70 dark:text-white/70">{group.label}</span>
                  <ChevronIcon open={isOpenGroup} />
                </button>
                {isOpenGroup && (
                  <div className="flex flex-col gap-1 pb-2">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectQuestion(item.question);
                          onClose();
                        }}
                        className="rounded-xl px-2 py-2 text-left text-[13px] text-black/85 transition-colors duration-150 hover:bg-primary/10 hover:text-primary active:scale-[0.99] dark:text-white/85 dark:hover:bg-primary-dark/15 dark:hover:text-primary-dark"
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
