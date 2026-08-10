import { forwardRef, useLayoutEffect } from 'react';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  maxLength: number;
  placeholder: string;
  ariaLabel: string;
}

const MAX_HEIGHT_PX = 120;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ value, onChange, onSubmit, disabled, maxLength, placeholder, ariaLabel }, ref) => {
    useLayoutEffect(() => {
      const el = (ref as React.RefObject<HTMLTextAreaElement>)?.current;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
    }, [value, ref]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    };

    return (
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        maxLength={maxLength}
        className="max-h-[120px] flex-1 resize-none overflow-y-auto bg-transparent py-2 text-[14px] leading-relaxed text-black placeholder:text-black/35 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:placeholder:text-white/35"
      />
    );
  }
);

TextArea.displayName = 'TextArea';
