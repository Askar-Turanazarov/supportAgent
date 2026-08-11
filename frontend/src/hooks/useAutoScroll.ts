import { useCallback, useEffect, useRef, useState } from 'react';

const BOTTOM_THRESHOLD_PX = 48;

/**
 * Автоскролл ленты сообщений вниз при появлении новых сообщений и во время
 * стриминга ответа — но не мешает пользователю, если он вручную
 * проскроллил вверх.
 *
 * Пока `isStreaming` истинно и лента "приколота" к низу, позиция скролла
 * синхронизируется на каждый кадр через requestAnimationFrame — вместо
 * повторного вызова scrollTo({behavior:'smooth'}) на каждое слово. Рост
 * текста слово за словом перезапускал бы eased-анимацию по нескольку раз
 * за секунду, и она "боролась" бы сама с собой, создавая заметное
 * подёргивание; прямое присваивание scrollTop на каждый кадр отображения
 * убирает анимацию как источник рывков и следует за текстом с частотой
 * обновления самого монитора.
 */
export function useAutoScroll<T>(deps: T[], isStreaming: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
    setIsPinnedToBottom(true);
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

  // Дискретные события (новое сообщение, смена статуса) — один плавный
  // прыжок вниз. Во время стриминга прыжок не нужен: следующий эффект уже
  // держит ленту прижатой к низу на каждом кадре.
  useEffect(() => {
    if (isPinnedToBottom) {
      if (!isStreaming) scrollToBottom('smooth');
    } else {
      setHasNewMessages(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (!isStreaming || !isPinnedToBottom) return;

    let frameId: number;
    const tick = () => {
      const el = containerRef.current;
      if (el) el.scrollTop = el.scrollHeight - el.clientHeight;
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isStreaming, isPinnedToBottom]);

  return { containerRef, handleScroll, isPinnedToBottom, hasNewMessages, scrollToBottom };
}
