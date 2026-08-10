import { useState } from 'react';

interface StarRatingProps {
  value?: number;
  onRate: (rating: number) => void;
  label: string;
  thanksLabel: string;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-all duration-150 ${
        filled ? 'scale-100 fill-[#FF9F0A] dark:fill-[#FFD60A]' : 'scale-95 fill-black/15 dark:fill-white/20'
      }`}
    >
      <path d="M12 2.5l2.9 6.32 6.95.72-5.2 4.75 1.5 6.86L12 17.9l-6.15 3.25 1.5-6.86-5.2-4.75 6.95-.72L12 2.5z" />
    </svg>
  );
}

export function StarRating({ value, onRate, label, thanksLabel }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? value ?? 0;

  return (
    <div className="flex items-center gap-1.5 px-1 pt-0.5">
      {value ? (
        <span className="text-[11px] text-black/40 dark:text-white/40">{thanksLabel}</span>
      ) : (
        <span className="text-[11px] text-black/40 dark:text-white/40">{label}</span>
      )}
      <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onClick={() => onRate(star)}
            aria-label={`${label}: ${star}/5`}
            className="rounded-full p-0.5 transition-transform duration-150 hover:scale-125 active:scale-95"
          >
            <StarIcon filled={star <= active} />
          </button>
        ))}
      </div>
    </div>
  );
}
