import { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { useTranslations } from '../../hooks/useTranslations';
import { ChatHeader } from '../Header/ChatHeader';
import { ChatInput } from '../ChatInput/ChatInput';
import { MessageList } from './MessageList';
import { FaqModal } from './FaqModal';

export function ChatWindow() {
  const {
    messages,
    isAgentTyping,
    isConnected,
    isSending,
    sendMessage,
    retryLastMessage,
    startNewChat,
    rateMessage,
  } = useChat();
  const { t } = useTranslations();
  const [isFaqOpen, setFaqOpen] = useState(false);

  const status = !isConnected ? 'offline' : isAgentTyping ? 'typing' : 'online';

  const { containerRef, handleScroll, hasNewMessages, scrollToBottom } = useAutoScroll([
    messages,
    isAgentTyping,
  ]);

  const handleFaqSelect = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="relative mx-auto flex h-full w-full max-w-full flex-col overflow-hidden bg-surface shadow-2xl dark:bg-surface-dark tablet:h-[660px] tablet:max-w-[420px] tablet:rounded-[28px] tablet:border tablet:border-black/10 dark:tablet:border-white/10 desktop:max-w-[420px]">
      <div ref={containerRef} onScroll={handleScroll} className="chat-scroll flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col">
          <div className="sticky top-0 z-20">
            <ChatHeader status={status} onNewChat={startNewChat} onOpenFaq={() => setFaqOpen(true)} />
            {!isConnected && (
              <div className="animate-message-in bg-error/10 px-4 py-2 text-center text-[12px] font-medium text-error backdrop-blur-2xl dark:bg-error-dark/10 dark:text-error-dark">
                {t.offlineBanner}
              </div>
            )}
          </div>

          <div className="flex-1">
            <MessageList
              messages={messages}
              isAgentTyping={isAgentTyping}
              onQuickReply={sendMessage}
              onRetry={retryLastMessage}
              onRate={rateMessage}
              onOpenFaq={() => setFaqOpen(true)}
            />
          </div>

          <div className="sticky bottom-0 z-20">
            <ChatInput onSend={sendMessage} disabled={!isConnected} isSending={isSending} />
          </div>
        </div>
      </div>

      {hasNewMessages && (
        <button
          type="button"
          onClick={() => scrollToBottom()}
          className="absolute bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-primary px-3 py-1.5 text-[12px] font-medium text-white shadow-lg transition-all duration-200 hover:opacity-90 active:scale-95 dark:bg-primary-dark"
        >
          ↓ {t.message.newMessages}
        </button>
      )}

      <FaqModal isOpen={isFaqOpen} onClose={() => setFaqOpen(false)} onSelectQuestion={handleFaqSelect} />
    </div>
  );
}
