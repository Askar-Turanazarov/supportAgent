interface SendButtonProps {
  disabled: boolean;
  isLoading: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export function SendButton({ disabled, isLoading, onClick, ariaLabel }: SendButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={[
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 ease-spring',
        disabled
          ? 'cursor-not-allowed bg-black/10 text-black/30 dark:bg-white/10 dark:text-white/30'
          : 'bg-primary text-white hover:opacity-90 active:scale-90 dark:bg-primary-dark',
      ].join(' ')}
    >
      {isLoading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </button>
  );
}
