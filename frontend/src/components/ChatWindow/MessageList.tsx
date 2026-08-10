import type { Message } from '../../types/chat.types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';
import { SuggestionChips } from './SuggestionChips';

interface MessageListProps {
  messages: Message[];
  isAgentTyping: boolean;
  onQuickReply: (text: string) => void;
  onRetry: () => void;
  onRate: (messageId: string, rating: number) => void;
  onOpenFaq: () => void;
}

export function MessageList({
  messages,
  isAgentTyping,
  onQuickReply,
  onRetry,
  onRate,
  onOpenFaq,
}: MessageListProps) {
  if (messages.length === 0 && !isAgentTyping) {
    return <EmptyState onQuickReply={onQuickReply} onOpenFaq={onOpenFaq} />;
  }

  const lastMessage = messages[messages.length - 1];
  const showSuggestions =
    lastMessage &&
    lastMessage.role === 'agent' &&
    lastMessage.status !== 'error' &&
    !lastMessage.isStreaming &&
    (lastMessage.suggestions?.length ?? 0) > 0;

  return (
    <div role="log" aria-live="polite" aria-relevant="additions" className="flex flex-col gap-3 px-4 py-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onRetry={message.status === 'error' ? onRetry : undefined}
          onRate={(rating) => onRate(message.id, rating)}
        />
      ))}
      {isAgentTyping && <TypingIndicator />}
      {showSuggestions && <SuggestionChips suggestions={lastMessage.suggestions!} onSelect={onQuickReply} />}
    </div>
  );
}
