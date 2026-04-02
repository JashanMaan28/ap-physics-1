"use client";

import { useState, useCallback, useRef } from "react";
import { SimCanvas } from "@/components/simulations/sim-canvas";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CollisionSim() {
  const [m1, setM1] = useState(2);
  const [m2, setM2] = useState(1);
  const [v1i, setV1i] = useState(5);
  const [v2i, setV2i] = useState(-2);
  const [elastic, setElastic] = useState(true);

  const stateRef = useRef({
    x1: 0, x2: 0, v1: 0, v2: 0, collided: false, phase: "before" as "before" | "colliding" | "after",
  });

  const computeFinal = useCallback(() => {
    if (elastic) {
      const v1f = ((m1 - m2) * v1i + 2 * m2 * v2i) / (m1 + m2);
      const v2f = ((m2 - m1) * v2i + 2 * m1 * v1i) / (m1 + m2);
      return { v1f, v2f };
    } else {
      const vf = (m1 * v1i + m2 * v2i) / (m1 + m2);
      return { v1f: vf, v2f: vf };
    }
  }, [m1, m2, v1i, v2i, elastic]);

  const reset = useCallback(() => {
    stateRef.current = { x1: 200, x2: 550, v1: v1i, v2: v2i, collided: false, phase: "before" };
  }, [v1i, v2i]);

  // Init
  if (stateRef.current.x1 === 0) {
    stateRef.current = { x1: 200, x2: 550, v1: v1i, v2: v2i, collided: false, phase: "before" };
  }

  const onDraw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dt: number) => {
    const W = canvas.width;
    const H = canvas.height;
    const trackY = H / 2 + 20;
    const r1 = 15 + m1 * 5;
    const r2 = 15 + m2 * 5;

    // Clear
    ctx.fillStyle = "oklch(0.12 0.015 260)";
    ctx.fillRect(0, 0, W, H);

    // Track
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, trackY);
    ctx.lineTo(W - 30, trackY);
    ctx.stroke();

    const s = stateRef.current;

    // Physics update
    if (dt > 0) {
      const pixelsPerMeter = 40;
      s.x1 += s.v1 * pixelsPerMeter * dt;
      s.x2 += s.v2 * pixelsPerMeter * dt;

      // Collision detection
      if (!s.collided && s.x1 + r1 >= s.x2 - r2) {
        s.collided = true;
        s.phase = "after";
        const { v1f, v2f } = computeFinal();
        s.v1 = v1f;
        s.v2 = v2f;
        // Separate them
        const overlap = (s.x1 + r1) - (s.x2 - r2);
        s.x1 -= overlap / 2;
        s.x2 += overlap / 2;
      }
    }

    // Draw ball 1
    ctx.fillStyle = "#3b82f6";
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(s.x1, trackY - r1, r1, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${m1}kg`, s.x1, trackY - r1 + 4);

    // Draw ball 2
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(s.x2, trackY - r2, r2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    ctx.font = "bold 12px monospace";
    ctx.fillText(`${m2}kg`, s.x2, trackY - r2 + 4);

    // Velocity arrows
    const arrowScale = 12;
    const drawArrow = (x: number, y: number, v: number, color: string) => {
      if (Math.abs(v) < 0.1) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + v * arrowScale, y);
      ctx.stroke();
      // Arrowhead
      const dir = v > 0 ? 1 : -1;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + v * arrowScale, y);
      ctx.lineTo(x + v * arrowScale - dir * 8, y - 5);
      ctx.lineTo(x + v * arrowScale - dir * 8, y + 5);
      ctx.closePath();
      ctx.fill();
    };

    drawArrow(s.x1, trackY - r1 * 2 - 15, s.v1, "#60a5fa");
    drawArrow(s.x2, trackY - r2 * 2 - 15, s.v2, "#f87171");

    // Momentum & KE bars
    const p1 = m1 * s.v1;
    const p2 = m2 * s.v2;
    const pTotal = p1 + p2;
    const ke = 0.5 * m1 * s.v1 * s.v1 + 0.5 * m2 * s.v2 * s.v2;
    const keI = 0.5 * m1 * v1i * v1i + 0.5 * m2 * v2i * v2i;

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "11px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`p₁ = ${p1.toFixed(1)} kg·m/s`, 30, H - 60);
    ctx.fillText(`p₂ = ${p2.toFixed(1)} kg·m/s`, 30, H - 42);
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`p_total = ${pTotal.toFixed(1)} kg·m/s`, 30, H - 20);

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText(`KE = ${ke.toFixed(1)} J`, W - 200, H - 42);
    ctx.fillText(`KE_initial = ${keI.toFixed(1)} J`, W - 200, H - 60);
    if (s.collided) {
      ctx.fillStyle = elastic ? "#22c55e" : "#f59e0b";
      ctx.fillText(`KE lost: ${(keI - ke).toFixed(1)} J`, W - 200, H - 20);
    }

    // Phase label
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.phase === "before" ? "BEFORE COLLISION" : "AFTER COLLISION", W / 2, 25);
  }, [m1, m2, v1i, v2i, elastic, computeFinal]);

  return (
    <SimCanvas
      title="Collision Simulator"
      description="Watch 1D collisions unfold. Compare elastic vs. perfectly inelastic collisions and verify conservation of momentum."
      width={800}
      height={400}
      onDraw={onDraw}
      onReset={reset}
      controls={
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="text-xs text-muted-foreground">m₁ = {m1} kg</label>
            <Slider value={m1} onValueChange={setM1} min={0.5} max={5} step={0.5} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">v₁ = {v1i} m/s</label>
            <Slider value={v1i} onValueChange={setV1i} min={-8} max={8} step={0.5} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">m₂ = {m2} kg</label>
            <Slider value={m2} onValueChange={setM2} min={0.5} max={5} step={0.5} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">v₂ = {v2i} m/s</label>
            <Slider value={v2i} onValueChange={setV2i} min={-8} max={8} step={0.5} />
          </div>
          <div className="flex items-end">
            <Button
              variant={elastic ? "default" : "secondary"}
              size="sm"
              onClick={() => setElastic(!elastic)}
              className="cursor-pointer text-xs w-full"
            >
              {elastic ? "Elastic" : "Inelastic"}
            </Button>
          </div>
        </div>
      }
    />
  );
}
