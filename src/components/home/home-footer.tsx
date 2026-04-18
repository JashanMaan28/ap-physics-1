"use client";

import { useCallback, useRef } from "react";
import { useToast } from "@/components/effects/toast";

export function HomeFooter({ showNewtonApple }: { showNewtonApple: boolean }) {
  const { toast } = useToast();
  const footerClicks = useRef<number[]>([]);

  const handleFooterClick = useCallback(() => {
    const now = Date.now();
    footerClicks.current.push(now);
    footerClicks.current = footerClicks.current.filter((t) => now - t < 1500);
    if (footerClicks.current.length >= 3) {
      footerClicks.current = [];
      toast("Sir Isaac Newton is, however, affiliated with this app", "🍏", 4000);
    }
  }, [toast]);

  return (
    <footer className="border-t border-foreground/[0.04] py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-foreground/20">
            AP Physics 1 Study Guide · Built for the 2025–26 College Board CED
            {showNewtonApple && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-emerald-500 text-[10px] font-medium" title="You completed everything!">
                🍎 Newton&apos;s Apple
              </span>
            )}
          </p>
          <p
            className="text-xs text-foreground/10 cursor-default select-none"
            onClick={handleFooterClick}
          >
            Not affiliated with College Board
          </p>
        </div>
      </div>
    </footer>
  );
}
