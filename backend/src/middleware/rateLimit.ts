import type { NextFunction, Request, Response } from 'express';

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;

const hits = new Map<string, number[]>();

/**
 * Простой in-memory rate limiter по IP. Для продакшена с несколькими
 * инстансами backend стоит заменить на Redis-based решение.
 */
export function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const key = req.ip ?? 'unknown';
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({ message: 'Слишком много запросов. Попробуйте позже.' });
    return;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  next();
}
