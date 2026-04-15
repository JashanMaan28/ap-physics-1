"use client";

import { useState, useCallback, useRef } from "react";
import { SimCanvas } from "@/components/simulations/sim-canvas";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSimulationManifestBySimId } from "@/lib/simulation-manifests";

const g = 9.8;

export function ProjectileLauncher() {
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(25);
  const [showAir, setShowAir] = useState(false);
  const [resolvedRange, setResolvedRange] = useState<number | undefined>(undefined);
  const [resolutionToken, setResolutionToken] = useState<number | null>(null);
  const rad = (angle * Math.PI) / 180;
  const range = (speed * speed * Math.sin(2 * rad)) / g;
  const maxH = (speed * speed * Math.sin(rad) * Math.sin(rad)) / (2 * g);
  const totalT = (2 * speed * Math.sin(rad)) / g;

  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const ghostRef = useRef<{ x: number; y: number }[]>([]);
  const posRef = useRef({
    x: 0,
    y: 0,
    vx: speed * Math.cos(rad),
    vy: speed * Math.sin(rad),
    landed: false,
  });
  const reportedLandingRef = useRef(false);

  const reset = useCallback(() => {
    trailRef.current = [];
    ghostRef.current = [];
    reportedLandingRef.current = false;
    setResolvedRange(undefined);
    setResolutionToken(null);
    posRef.current = {
      x: 0, y: 0,
      vx: speed * Math.cos(rad),
      vy: speed * Math.sin(rad),
      landed: false,
    };
  }, [speed, rad]);

  const onDraw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dt: number) => {
    const W = canvas.width;
    const H = canvas.height;
    const groundY = H - 60;
    const originX = 60;
    const scale = Math.min((W - 100) / Math.max(range * 1.2, 50), (groundY - 40) / Math.max(maxH * 1.2, 20));

    // Clear
    ctx.fillStyle = "oklch(0.12 0.015 260)";
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, groundY);
    ctx.lineTo(W - 20, groundY);
    ctx.stroke();

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    for (let i = 0; i < 10; i++) {
      const gx = originX + (i * range * scale) / 9;
      ctx.beginPath(); ctx.moveTo(gx, 30); ctx.lineTo(gx, groundY); ctx.stroke();
      const gy = groundY - (i * maxH * scale) / 9;
      ctx.beginPath(); ctx.moveTo(40, gy); ctx.lineTo(W - 20, gy); ctx.stroke();
    }

    // Update physics
    const p = posRef.current;
    if (!p.landed && dt > 0) {
      const dragCoeff = showAir ? 0.002 : 0;
      const v = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const dragX = -dragCoeff * v * p.vx;
      const dragY = -dragCoeff * v * p.vy;

      p.vx += dragX * dt;
      p.vy -= g * dt + dragY * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.y < 0) { p.y = 0; p.landed = true; }
      trailRef.current.push({ x: p.x, y: p.y });
      if (p.landed && !reportedLandingRef.current) {
        reportedLandingRef.current = true;
        setResolvedRange(Number(p.x.toFixed(4)));
        setResolutionToken(Date.now());
      }
    }

    // Ghost trajectory (ideal, no air)
    if (ghostRef.current.length === 0) {
      const steps = 60;
      const vx0 = speed * Math.cos(rad);
      const vy0 = speed * Math.sin(rad);
      for (let i = 0; i <= steps; i++) {
        const t = (totalT * i) / steps;
        const gx = vx0 * t;
        const gy = vy0 * t - 0.5 * g * t * t;
        if (gy < 0) break;
        ghostRef.current.push({ x: gx, y: gy });
      }
    }

    // Draw ghost trajectory
    if (showAir && ghostRef.current.length > 1) {
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ghostRef.current.forEach((pt, i) => {
        const sx = originX + pt.x * scale;
        const sy = groundY - pt.y * scale;
        if (i === 0) {
          ctx.moveTo(sx, sy);
        } else {
          ctx.lineTo(sx, sy);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw trail
    if (trailRef.current.length > 1) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      trailRef.current.forEach((pt, i) => {
        const sx = originX + pt.x * scale;
        const sy = groundY - pt.y * scale;
        if (i === 0) {
          ctx.moveTo(sx, sy);
        } else {
          ctx.lineTo(sx, sy);
        }
      });
      ctx.stroke();

      // Trail dots
      ctx.fillStyle = "rgba(59,130,246,0.4)";
      trailRef.current.forEach((pt, i) => {
        if (i % 5 === 0) {
          const sx = originX + pt.x * scale;
          const sy = groundY - pt.y * scale;
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Draw projectile
    const sx = originX + p.x * scale;
    const sy = groundY - p.y * scale;
    ctx.fillStyle = "#60a5fa";
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(sx, sy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Velocity arrow
    if (!p.landed) {
      const arrowScale = 1.5;
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + p.vx * arrowScale, sy - p.vy * arrowScale);
      ctx.stroke();
    }

    // Launch angle indicator
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(originX, groundY);
    ctx.lineTo(originX + 50 * Math.cos(rad), groundY - 50 * Math.sin(rad));
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "11px monospace";
    ctx.fillText(`${angle}°`, originX + 20, groundY - 8);

    // Info text
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "11px monospace";
    ctx.fillText(`x: ${p.x.toFixed(1)} m`, W - 160, 25);
    ctx.fillText(`y: ${p.y.toFixed(1)} m`, W - 160, 42);
    ctx.fillText(`v: ${Math.sqrt(p.vx * p.vx + p.vy * p.vy).toFixed(1)} m/s`, W - 160, 59);
    if (p.landed) {
      ctx.fillStyle = "#22c55e";
      ctx.fillText(`Range: ${p.x.toFixed(1)} m`, W - 160, 80);
    }
  }, [angle, speed, range, maxH, totalT, rad, showAir]);

  return (
    <SimCanvas
      title="Projectile Launcher"
      description="Launch projectiles and watch them fly. Compare trajectories with and without air resistance."
      width={800}
      height={450}
      onDraw={onDraw}
      onReset={reset}
      predictionManifest={getSimulationManifestBySimId("projectile-launcher")}
      autoActualNumber={resolvedRange}
      resolutionToken={resolutionToken}
      controls={
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs text-muted-foreground">Angle: {angle}°</label>
            <Slider value={angle} onValueChange={setAngle} min={5} max={85} step={1} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Speed: {speed} m/s</label>
            <Slider value={speed} onValueChange={setSpeed} min={5} max={50} step={1} />
          </div>
          <div className="flex items-end gap-2">
            <Button
              variant={showAir ? "default" : "outline"}
              size="sm"
              onClick={() => { setShowAir(!showAir); reset(); }}
              className="cursor-pointer text-xs"
            >
              {showAir ? "Air Resistance ON" : "Air Resistance OFF"}
            </Button>
            <Badge variant="secondary" className="text-[10px] font-mono">
              R ≈ {range.toFixed(1)}m
            </Badge>
          </div>
        </div>
      }
    />
  );
}
