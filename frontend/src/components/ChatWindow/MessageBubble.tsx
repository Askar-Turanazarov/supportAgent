import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import type { Message } from '../../types/chat.types';
import { StarRating } from './StarRating';
import { useTranslations } from '../../hooks/useTranslations';

interface MessageBubbleProps {
  message: Message;
  onRetry?: () => void;
  onRate?: (rating: number) => void;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message, onRetry, onRate }: MessageBubbleProps) {
  const { t } = useTranslations();
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const canRate = !isUser && !isError && !message.isStreaming && message.content.length > 0;

  return (
    <div className={`flex w-full animate-message-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex max-w-[85%] flex-col gap-1 tablet:max-w-[75%]">
        <div
          className={[
            'rounded-[18px] px-4 py-2.5 text-[14px] leading-relaxed break-words shadow-sm',
            isUser
              ? 'rounded-br-[6px] bg-primary text-white dark:bg-primary-dark'
              : 'rounded-bl-[6px] bg-bubble-agent text-black dark:bg-bubble-agent-dark dark:text-white',
            isError ? 'border border-error/30 bg-error/5 text-error dark:border-error-dark/40 dark:text-error-dark' : '',
          ].join(' ')}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div
          className={`flex items-center gap-2 px-1 text-[11px] text-black/40 dark:text-white/40 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{formatTime(message.timestamp)}</span>
          {message.status === 'sending' && <span>{t.input.sending}</span>}
          {isError && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="font-medium text-error underline underline-offset-2 hover:text-error/80 dark:text-error-dark dark:hover:text-error-dark/80"
            >
              {t.message.retry}
            </button>
          )}
        </div>

        {canRate && onRate && (
          <StarRating
            value={message.rating}
            onRate={onRate}
            label={t.message.rate}
            thanksLabel={t.message.rateThanks}
          />
        )}
      </div>
    </div>
  );
}
