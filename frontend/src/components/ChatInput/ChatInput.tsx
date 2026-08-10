import { useRef, useState } from 'react';
import { TextArea } from './TextArea';
import { SendButton } from './SendButton';
import { limits } from '../../styles/theme';
import { useTranslations } from '../../hooks/useTranslations';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  isSending: boolean;
}

export function ChatInput({ onSend, disabled, isSending }: ChatInputProps) {
  const { t } = useTranslations();
  const [value, setValue] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const trimmedLength = value.trim().length;
  const isTooLong = value.length > limits.maxMessageLength;
  const canSend = trimmedLength > 0 && !isTooLong && !disabled && !isSending;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value);
    setValue('');
    requestAnimationFrame(() => textAreaRef.current?.focus());
  };

  return (
    <div className="border-t border-black/10 bg-surface/60 px-3 py-2 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-surface-dark/60 tablet:px-4 tablet:py-3">
      <div className="flex items-end gap-2 rounded-[20px] border border-black/10 bg-black/[0.03] px-3 py-1 transition-colors duration-200 focus-within:border-primary dark:border-white/10 dark:bg-white/5 dark:focus-within:border-primary-dark">
        <TextArea
          ref={textAreaRef}
          value={value}
          onChange={setValue}
          onSubmit={handleSend}
          disabled={disabled || isSending}
          maxLength={limits.maxMessageLength}
          placeholder={t.input.placeholder}
          ariaLabel={t.input.ariaLabel}
        />
        <div className="pb-1.5">
          <SendButton
            disabled={!canSend}
            isLoading={isSending}
            onClick={handleSend}
            ariaLabel={t.input.sendAriaLabel}
          />
        </div>
      </div>

      {value.length > limits.charCounterWarningThreshold && (
        <p
          className={`mt-1 px-1 text-right text-[11px] ${
            isTooLong ? 'text-error dark:text-error-dark' : 'text-black/40 dark:text-white/40'
          }`}
        >
          {value.length} / {limits.maxMessageLength}
        </p>
      )}
    </div>
  );
}
