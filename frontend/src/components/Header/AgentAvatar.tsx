import { useEffect, useRef } from 'react';

const MAX_TILT_DEG = 18;
const TILT_RANGE_PX = 260;
const EASE = 0.14;

export function AgentAvatar() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number;

    function handlePointerMove(e: PointerEvent) {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / TILT_RANGE_PX;
      const dy = (e.clientY - cy) / TILT_RANGE_PX;
      targetRef.current = {
        x: Math.max(-1, Math.min(1, dx)),
        y: Math.max(-1, Math.min(1, dy)),
      };
    }

    function tick() {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      cur.x += (tgt.x - cur.x) * EASE;
      cur.y += (tgt.y - cur.y) * EASE;

      const rotateY = cur.x * MAX_TILT_DEG;
      const rotateX = -cur.y * MAX_TILT_DEG;

      if (faceRef.current) {
        faceRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
      if (highlightRef.current) {
        highlightRef.current.style.transform = `translate(${cur.x * -5}px, ${cur.y * -5}px)`;
      }

      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('pointermove', handlePointerMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative shrink-0 [perspective:420px]">
      <div className="animate-bot-float">
        <div
          ref={faceRef}
          className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary via-primary to-[#5AC8FA] will-change-transform [box-shadow:0_6px_14px_-4px_rgba(0,122,255,0.55),inset_0_-4px_7px_rgba(2,20,60,0.4),inset_0_2px_3px_rgba(255,255,255,0.55)]"
        >
          <div
            ref={highlightRef}
            className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.55),transparent_55%)]"
          />

          <svg viewBox="0 0 40 40" className="relative h-9 w-9" aria-hidden="true">
            <defs>
              <linearGradient id="botFace" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#D7E4FF" />
              </linearGradient>
              <linearGradient id="botVisor" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3DF3FF" />
                <stop offset="100%" stopColor="#0A84FF" />
              </linearGradient>
              <radialGradient id="botTip" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#EAFEFF" />
                <stop offset="100%" stopColor="#2DD4F5" />
              </radialGradient>
            </defs>

            {/* antenna */}
            <line x1="20" y1="5.6" x2="20" y2="1.3" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
            <circle cx="20" cy="1.6" r="1.5" fill="#03153A" opacity="0.25" />
            <circle
              cx="20"
              cy="1.1"
              r="2.3"
              fill="url(#botTip)"
              className="origin-center animate-bot-antenna [filter:drop-shadow(0_0_3px_rgba(45,212,245,0.9))] [transform-box:fill-box]"
            />

            {/* head depth layer */}
            <rect x="4.6" y="7" width="33" height="28" rx="10" fill="#03153A" opacity="0.28" />
            {/* head plate */}
            <rect x="3.5" y="5.5" width="33" height="28" rx="10" fill="url(#botFace)" />
            {/* plate sheen */}
            <ellipse cx="12" cy="11.5" rx="8.5" ry="4.3" fill="white" opacity="0.45" />

            {/* side nubs */}
            <circle cx="3.5" cy="20.3" r="2.6" fill="url(#botFace)" />
            <circle cx="36.5" cy="20.3" r="2.6" fill="url(#botFace)" />

            {/* visor bezel */}
            <rect x="8" y="15.5" width="24" height="9.5" rx="4.75" fill="#07142E" />
            {/* visor glow */}
            <rect
              x="9.4"
              y="16.9"
              width="21.2"
              height="6.7"
              rx="3.35"
              fill="url(#botVisor)"
              className="origin-center animate-bot-scan [filter:drop-shadow(0_0_2.5px_rgba(61,243,255,0.85))] [transform-box:fill-box]"
            />
            {/* visor sheen */}
            <ellipse cx="13.5" cy="19" rx="3.2" ry="1.3" fill="white" opacity="0.5" />

            {/* mouth */}
            <rect x="14.5" y="28.3" width="11" height="2.1" rx="1.05" fill="#07142E" opacity="0.28" />
          </svg>
        </div>
      </div>
    </div>
  );
}
