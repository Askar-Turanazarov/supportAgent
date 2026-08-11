import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useChatStore } from '../store/chatStore';
import { createSession, streamChatMessage } from '../services/chatApi';
import { useTypingStatus } from './useTypingStatus';
import { useTranslations } from './useTranslations';
import { limits } from '../styles/theme';
import type { Message } from '../types/chat.types';

export function useChat() {
  const {
    messages,
    isAgentTyping,
    isResponding,
    isConnected,
    sessionId,
    setSessionId,
    addMessage,
    updateMessage,
    appendToMessage,
    setAgentTyping,
    setResponding,
    setConnected,
    resetChat,
  } = useChatStore();
  const { t, locale } = useTranslations();

  const [isSending, setIsSending] = useState(false);
  const activeAgentMessageId = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleTimeout = useCallback(() => {
    setAgentTyping(false);
    setResponding(false);
    setIsSending(false);
    abortControllerRef.current?.abort();

    const agentId = activeAgentMessageId.current;
    if (agentId) {
      updateMessage(agentId, { content: t.message.timeoutError, status: 'error' });
      activeAgentMessageId.current = null;
    }
  }, [setAgentTyping, setResponding, updateMessage, t]);

  const typingTimer = useTypingStatus({ onTimeout: handleTimeout });

  useEffect(() => {
    if (!sessionId) {
      createSession()
        .then(setSessionId)
        .catch(() => setConnected(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleOnline = () => setConnected(true);
    const handleOffline = () => setConnected(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setConnected(navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setConnected]);

  const runStream = useCallback(
    async (userText: string) => {
      const agentMessageId = uuid();
      activeAgentMessageId.current = null;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsSending(true);
      setAgentTyping(true);
      setResponding(true);
      typingTimer.start();

      try {
        await streamChatMessage(
          sessionId,
          userText,
          locale,
          {
            onTyping: () => {
              setAgentTyping(true);
            },
            onToken: (text) => {
              typingTimer.reset();
              if (!activeAgentMessageId.current) {
                activeAgentMessageId.current = agentMessageId;
                addMessage({
                  id: agentMessageId,
                  role: 'agent',
                  content: text,
                  timestamp: Date.now(),
                  isStreaming: true,
                });
                setAgentTyping(false);
              } else {
                appendToMessage(agentMessageId, text);
              }
            },
            onDone: (_messageId, resolvedSessionId, suggestions) => {
              typingTimer.clear();
              setAgentTyping(false);
              setResponding(false);
              setIsSending(false);
              if (activeAgentMessageId.current) {
                updateMessage(activeAgentMessageId.current, { isStreaming: false, suggestions });
              }
              if (resolvedSessionId && resolvedSessionId !== sessionId) {
                setSessionId(resolvedSessionId);
              }
              activeAgentMessageId.current = null;
            },
            onError: (message) => {
              typingTimer.clear();
              setAgentTyping(false);
              setResponding(false);
              setIsSending(false);
              if (activeAgentMessageId.current) {
                updateMessage(activeAgentMessageId.current, {
                  content: message,
                  status: 'error',
                  isStreaming: false,
                });
              } else {
                addMessage({
                  id: agentMessageId,
                  role: 'agent',
                  content: message,
                  timestamp: Date.now(),
                  status: 'error',
                });
              }
              activeAgentMessageId.current = null;
            },
          },
          controller.signal
        );
      } catch {
        typingTimer.clear();
        setAgentTyping(false);
        setResponding(false);
        setIsSending(false);
        if (!controller.signal.aborted) {
          addMessage({
            id: agentMessageId,
            role: 'agent',
            content: t.message.error,
            timestamp: Date.now(),
            status: 'error',
          });
        }
      }
    },
    [
      sessionId,
      locale,
      addMessage,
      appendToMessage,
      updateMessage,
      setAgentTyping,
      setResponding,
      setSessionId,
      typingTimer,
      t,
    ]
  );

  const sendMessage = useCallback(
    (rawText: string) => {
      const text = rawText.trim();
      if (!text || text.length > limits.maxMessageLength) return;
      if (isSending || !isConnected) return;

      const userMessage: Message = {
        id: uuid(),
        role: 'user',
        content: text,
        timestamp: Date.now(),
        status: 'sent',
      };
      addMessage(userMessage);
      void runStream(text);
    },
    [isSending, isConnected, addMessage, runStream]
  );

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMessage) return;
    void runStream(lastUserMessage.content);
  }, [messages, runStream]);

  const startNewChat = useCallback(() => {
    abortControllerRef.current?.abort();
    typingTimer.clear();
    setIsSending(false);
    resetChat();
  }, [resetChat, typingTimer]);

  const rateMessage = useCallback(
    (messageId: string, rating: number) => {
      updateMessage(messageId, { rating });
    },
    [updateMessage]
  );

  return {
    messages,
    isAgentTyping,
    isResponding,
    isConnected,
    isSending,
    sendMessage,
    retryLastMessage,
    startNewChat,
    rateMessage,
  };
}
