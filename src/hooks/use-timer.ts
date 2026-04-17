"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  duration: number;
  autoStart?: boolean;
  onExpire?: () => void;
  onTick?: (remaining: number) => void;
}

/**
 * Countdown timer with pause/resume/reset. Ticks once per second.
 * `remaining` starts at `duration` and decreases to 0.
 */
export function useTimer({ duration, autoStart = false, onExpire, onTick }: UseTimerOptions) {
  const [remaining, setRemaining] = useState(duration);
  const [active, setActive] = useState(autoStart);
  const expiredRef = useRef(false);

  const start = useCallback(() => {
    if (remaining > 0) setActive(true);
  }, [remaining]);

  const pause = useCallback(() => setActive(false), []);

  const reset = useCallback(
    (next = duration) => {
      setRemaining(next);
      setActive(false);
      expiredRef.current = false;
    },
    [duration],
  );

  useEffect(() => {
    if (!active) return;
    if (remaining <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpire?.();
      }
      return;
    }
    const t = window.setTimeout(() => {
      setRemaining((r) => {
        const next = Math.max(0, r - 1);
        onTick?.(next);
        return next;
      });
    }, 1000);
    return () => window.clearTimeout(t);
  }, [active, remaining, onExpire, onTick]);

  return { remaining, active, start, pause, reset, setRemaining };
}
