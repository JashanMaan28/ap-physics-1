"use client"

import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value?: number | null
  max?: number
}

function Progress({ value, max = 100, className, ...props }: ProgressProps) {
  const pct =
    value == null || !Number.isFinite(value)
      ? 0
      : Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value ?? undefined}
      data-slot="progress"
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="h-full bg-primary transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export { Progress }
