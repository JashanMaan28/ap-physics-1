"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SimulationPredictionCard } from "@/components/arcade/simulation-prediction-card";

interface SimCanvasProps {
  title: string;
  description: string;
  width?: number;
  height?: number;
  onDraw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dt: number, elapsed: number) => void;
  onReset?: () => void;
  controls?: React.ReactNode;
  overlay?: React.ReactNode;
}

export function SimCanvas({ title, description, width = 800, height = 500, onDraw, onReset, controls, overlay }: SimCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(animRef.current);
      return undefined;
    }

    function draw(timestamp: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dt = lastTimeRef.current
        ? Math.min((timestamp - lastTimeRef.current) / 1000, 0.05)
        : 0;
      lastTimeRef.current = timestamp;
      elapsedRef.current += dt;

      onDraw(ctx, canvas, dt, elapsedRef.current);
      animRef.current = requestAnimationFrame(draw);
    }

    lastTimeRef.current = 0;
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [playing, onDraw]);

  // Draw initial frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    onDraw(ctx, canvas, 0, 0);
  }, [onDraw]);

  const handleReset = () => {
    setPlaying(false);
    elapsedRef.current = 0;
    lastTimeRef.current = 0;
    onReset?.();
    // Redraw initial frame
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setTimeout(() => onDraw(ctx, canvas, 0, 0), 0);
  };

  return (
    <div className="space-y-4">
      <SimulationPredictionCard title={title} />

      <Card className="overflow-hidden border-white/[0.08] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls row */}
          {controls}

          {/* Canvas */}
          <div className="relative w-full overflow-hidden rounded-lg border border-white/[0.06]">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="w-full"
              style={{ aspectRatio: `${width} / ${height}`, background: "oklch(0.12 0.015 260)" }}
            />
            {overlay}
          </div>

          {/* Play controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={playing ? "secondary" : "default"}
              size="sm"
              onClick={() => setPlaying(!playing)}
              className="cursor-pointer gap-1.5"
            >
              {playing ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>Pause</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>Play</>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} className="cursor-pointer gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
