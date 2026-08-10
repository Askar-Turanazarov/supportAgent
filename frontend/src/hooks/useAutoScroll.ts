import { useCallback, useEffect, useRef, useState } from 'react';

const BOTTOM_THRESHOLD_PX = 48;

/**
 * Автоскролл ленты сообщений вниз при появлении новых сообщений,
 * но не мешает пользователю, если он вручную проскроллил вверх.
 */
export function useAutoScroll<T>(deps: T[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
    setHasNewMessages(false);
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const pinned = distanceFromBottom < BOTTOM_THRESHOLD_PX;
    setIsPinnedToBottom(pinned);
    if (pinned) setHasNewMessages(false);
  }, []);

  useEffect(() => {
    if (isPinnedToBottom) {
      scrollToBottom('smooth');
    } else {
      setHasNewMessages(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { containerRef, handleScroll, isPinnedToBottom, hasNewMessages, scrollToBottom };
}
