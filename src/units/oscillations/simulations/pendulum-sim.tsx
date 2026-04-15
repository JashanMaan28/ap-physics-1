"use client";

import { useState, useCallback, useRef } from "react";
import { SimCanvas } from "@/components/simulations/sim-canvas";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { getSimulationManifestBySimId } from "@/lib/simulation-manifests";

const TWO_PI = 2 * Math.PI;

export function PendulumSim() {
  const [length, setLength] = useState(2);
  const [gravity, setGravity] = useState(9.8);
  const [initAngle, setInitAngle] = useState(30);
  const [measuredPeriod, setMeasuredPeriod] = useState<number | undefined>(undefined);
  const [resolutionToken, setResolutionToken] = useState<number | null>(null);

  const stateRef = useRef({
    theta: (initAngle * Math.PI) / 180,
    omega: 0,
    time: 0,
  });
  const previousThetaRef = useRef<number | null>(null);
  const firstMatchingCrossingRef = useRef<number | null>(null);
  const reportedPeriodRef = useRef(false);

  const period = TWO_PI * Math.sqrt(length / gravity);

  const reset = useCallback(() => {
    previousThetaRef.current = null;
    firstMatchingCrossingRef.current = null;
    reportedPeriodRef.current = false;
    setMeasuredPeriod(undefined);
    setResolutionToken(null);
    stateRef.current = {
      theta: (initAngle * Math.PI) / 180,
      omega: 0,
      time: 0,
    };
  }, [initAngle]);

  const onDraw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dt: number) => {
    const W = canvas.width;
    const H = canvas.height;

    // Clear
    ctx.fillStyle = "oklch(0.12 0.015 260)";
    ctx.fillRect(0, 0, W, H);

    const s = stateRef.current;

    // Physics: simple pendulum with exact (non-small-angle) equation
    if (dt > 0) {
      const alpha = -(gravity / length) * Math.sin(s.theta);
      s.omega += alpha * dt;
      s.theta += s.omega * dt;
      s.time += dt;

      const previousTheta = previousThetaRef.current;
      if (
        previousTheta !== null &&
        previousTheta > 0 &&
        s.theta <= 0 &&
        s.omega < 0
      ) {
        if (firstMatchingCrossingRef.current === null) {
          firstMatchingCrossingRef.current = s.time;
        } else if (!reportedPeriodRef.current) {
          reportedPeriodRef.current = true;
          setMeasuredPeriod(Number((s.time - firstMatchingCrossingRef.current).toFixed(4)));
          setResolutionToken(Date.now());
        }
      }
      previousThetaRef.current = s.theta;
    }

    // Drawing
    const pivotX = W / 2;
    const pivotY = 60;
    const ropeLen = Math.min(length * 100, H - 140);
    const bobR = 18;

    const bobX = pivotX + ropeLen * Math.sin(s.theta);
    const bobY = pivotY + ropeLen * Math.cos(s.theta);

    // Pivot
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Rope
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Bob
    ctx.fillStyle = "#06b6d4";
    ctx.shadowColor = "#06b6d4";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Angle arc
    if (Math.abs(s.theta) > 0.02) {
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const arcR = 40;
      const startAngle = Math.PI / 2 - 0.01;
      const endAngle = Math.PI / 2 - s.theta;
      ctx.arc(pivotX, pivotY, arcR, Math.min(startAngle, endAngle), Math.max(startAngle, endAngle));
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${((s.theta * 180) / Math.PI).toFixed(1)}°`, pivotX + 55 * Math.sin(s.theta / 2), pivotY + 55 * Math.cos(s.theta / 2));
    }

    // Energy bars
    const maxPE = length * gravity * (1 - Math.cos((initAngle * Math.PI) / 180));
    const h = length * (1 - Math.cos(s.theta));
    const pe = gravity * h; // per unit mass
    const ke = 0.5 * length * length * s.omega * s.omega;
    const total = pe + ke;
    const barMax = Math.max(maxPE * 1.1, 1);
    const barW = 25;
    const barH = 150;
    const barX = W - 100;
    const barY = 80;

    // Bar backgrounds
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillRect(barX + 35, barY, barW, barH);
    ctx.fillRect(barX + 70, barY, barW, barH);

    // KE bar
    const keH = (ke / barMax) * barH;
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(barX, barY + barH - keH, barW, keH);

    // PE bar
    const peH = (pe / barMax) * barH;
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(barX + 35, barY + barH - peH, barW, peH);

    // Total bar
    const totH = (total / barMax) * barH;
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(barX + 70, barY + barH - totH, barW, totH);

    // Labels
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("KE", barX + barW / 2, barY + barH + 14);
    ctx.fillText("PE", barX + 35 + barW / 2, barY + barH + 14);
    ctx.fillText("E", barX + 70 + barW / 2, barY + barH + 14);

    // Info
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "11px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`T = ${period.toFixed(3)} s`, 20, H - 50);
    ctx.fillText(`t = ${s.time.toFixed(2)} s`, 20, H - 32);
    ctx.fillText(`ω = ${s.omega.toFixed(2)} rad/s`, 20, H - 14);
  }, [length, gravity, initAngle, period]);

  return (
    <SimCanvas
      title="Pendulum Lab"
      description="Watch a pendulum swing and observe energy conversion between KE and PE in real time."
      width={700}
      height={450}
      onDraw={onDraw}
      onReset={reset}
      predictionManifest={getSimulationManifestBySimId("pendulum-lab-native")}
      autoActualNumber={measuredPeriod}
      resolutionToken={resolutionToken}
      controls={
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs text-muted-foreground">Length: {length.toFixed(1)} m</label>
            <Slider value={length} onValueChange={setLength} min={0.5} max={4} step={0.1} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Gravity: {gravity.toFixed(1)} m/s²</label>
            <Slider value={gravity} onValueChange={setGravity} min={1} max={25} step={0.1} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Initial Angle: {initAngle}°</label>
            <Slider value={initAngle} onValueChange={setInitAngle} min={5} max={80} step={1} />
            <div className="flex gap-1 mt-1">
              <Badge variant="outline" className="text-[9px] font-mono">T ≈ {period.toFixed(2)}s</Badge>
            </div>
          </div>
        </div>
      }
    />
  );
}
