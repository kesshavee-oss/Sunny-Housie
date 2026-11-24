import { useCallback, useEffect, useRef, useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { motion } from 'motion/react';
import { LanguageId } from '../types/housie';
import { I18N } from '../utils/i18n';

interface LockBannerProps {
  language: LanguageId;
  onUnlock: () => void;
}

const HOLD_DURATION_MS = 2000;

export function LockBanner({ language, onUnlock }: LockBannerProps) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const unlockedRef = useRef(false);
  const t = I18N[language];

  const stopHold = useCallback(() => {
    setHolding(false);
    setProgress(0);
    startTimeRef.current = null;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (startTimeRef.current === null || unlockedRef.current) return;
    const elapsed = performance.now() - startTimeRef.current;
    const nextProgress = Math.min(1, elapsed / HOLD_DURATION_MS);
    setProgress(nextProgress);

    if (nextProgress >= 1) {
      unlockedRef.current = true;
      stopHold();
      onUnlock();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [onUnlock, stopHold]);

  const startHold = useCallback(() => {
    if (unlockedRef.current || holding) return;
    setHolding(true);
    setProgress(0);
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [holding, tick]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      className="sticky top-0 z-40 w-full bg-teal-100/95 backdrop-blur-md border-b-2 border-teal-300/80 shadow-sm"
      role="region"
      aria-label={t.lockScreen}
    >
      <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-lock-shake">
            <Lock className="w-4.5 h-4.5" strokeWidth={2.5} />
          </div>
          <p className="font-display font-bold text-base sm:text-lg text-teal-950 truncate">
            {t.screenLocked}
          </p>
        </div>

        <motion.button
          type="button"
          animate={
            holding
              ? { scale: [1, 1.05, 1] }
              : { scale: 1 }
          }
          transition={
            holding
              ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 400, damping: 20 }
          }
          onPointerDown={(e) => {
            if (e.button !== 0 && e.pointerType === 'mouse') return;
            e.currentTarget.setPointerCapture?.(e.pointerId);
            startHold();
          }}
          onPointerUp={stopHold}
          onPointerCancel={stopHold}
          onPointerLeave={stopHold}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
              e.preventDefault();
              startHold();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              stopHold();
            }
          }}
          onContextMenu={(e) => e.preventDefault()}
          className="relative overflow-hidden min-h-[44px] px-6 py-2.5 rounded-full bg-white border-2 border-teal-600 text-teal-950 font-display font-bold text-sm sm:text-base touch-none shrink-0 whitespace-nowrap shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-teal-400/50 origin-left pointer-events-none"
            style={{ transform: `scaleX(${progress})` }}
          />
          <span className="relative z-10 flex items-center gap-2">
            <Unlock className="w-4 h-4" strokeWidth={2.5} />
            <span>{holding ? t.unlocking : t.unlock}</span>
          </span>
        </motion.button>
      </div>
    </div>
  );
}
