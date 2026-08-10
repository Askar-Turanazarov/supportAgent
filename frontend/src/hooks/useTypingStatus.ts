import { useCallback, useRef } from 'react';
import { limits } from '../styles/theme';

interface UseTypingStatusOptions {
  onTimeout: () => void;
}

/**
 * Управляет таймаутом индикатора "печатает...": если за 15 сек не пришёл
 * ни один token/done/error — считаем ответ зависшим.
 */
export function useTypingStatus({ onTimeout }: UseTypingStatusOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clear();
    timeoutRef.current = setTimeout(onTimeout, limits.typingTimeoutMs);
  }, [clear, onTimeout]);

  const reset = useCallback(() => {
    start();
  }, [start]);

  return { start, reset, clear };
}
