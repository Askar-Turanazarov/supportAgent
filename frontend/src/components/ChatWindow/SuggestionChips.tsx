interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex animate-message-in flex-wrap gap-2 px-1 pt-1">
      {suggestions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          className="rounded-2xl border border-primary/25 bg-primary/[0.06] px-3 py-1.5 text-left text-[12px] leading-snug text-primary transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 active:scale-[0.97] dark:border-primary-dark/30 dark:bg-primary-dark/10 dark:text-primary-dark dark:hover:bg-primary-dark/20"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
