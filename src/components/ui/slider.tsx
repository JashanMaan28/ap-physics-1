"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
// Suppress base-ui script tag warning by rendering thumbs only on client
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return mounted ? <>{children}</> : null
}

import { cn } from "@/lib/utils"

type SliderProps = Omit<SliderPrimitive.Root.Props, "onValueChange" | "value"> & {
  value?: number | number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValueChange?: (value: any) => void;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  onValueChange,
  ...props
}: SliderProps) {
  const normalizedValue = React.useMemo(
    () =>
      value !== undefined
        ? Array.isArray(value) ? value : [value]
        : undefined,
    [value]
  )

  const _values = React.useMemo(
    () =>
      normalizedValue
        ? normalizedValue
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [normalizedValue, defaultValue, min, max]
  )

  // Detect if caller passed array-style value (e.g. value={[x]}) or scalar (value={x})
  const isArrayMode = Array.isArray(value)

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={normalizedValue}
      min={min}
      max={max}
      thumbAlignment="edge"
      onValueChange={
        onValueChange
          ? (v: number | readonly number[]) => {
              if (isArrayMode) {
                // Pass as array for callers expecting ([v]) => ...
                onValueChange(Array.isArray(v) ? [...v] : [v])
              } else {
                // Pass as scalar for callers expecting (v) => ...
                onValueChange(Array.isArray(v) ? v[0] : v)
              }
            }
          : undefined
      }
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        <ClientOnly>
          {_values.map((_, index) => (
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              key={index}
              index={index}
              className="relative block size-3 shrink-0 rounded-full border border-ring bg-background ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
            />
          ))}
        </ClientOnly>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
