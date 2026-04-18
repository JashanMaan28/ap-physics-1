"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tex } from "@/components/ui/math";

export function WhatIfScenarios() {
  const [gValue, setGValue] = useState(9.8);
  const [throwSpeed, setThrowSpeed] = useState(20);

  const timeUp = throwSpeed / gValue;
  const maxH = (throwSpeed * throwSpeed) / (2 * gValue);
  const totalTime = 2 * timeUp;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>What If? Scenarios</CardTitle>
          <CardDescription>Explore how changing physics parameters affects motion</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">What if gravity were different?</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">You throw a ball straight up at {throwSpeed} m/s. How does changing g affect the flight?</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground">Gravity g = {gValue.toFixed(1)} m/s²</label>
              <Slider value={gValue} onValueChange={setGValue} min={1} max={25} step={0.1} />
              <div className="flex gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-[10px] cursor-pointer" onClick={() => setGValue(1.6)}>Moon (1.6)</Badge>
                <Badge variant="outline" className="text-[10px] cursor-pointer" onClick={() => setGValue(3.7)}>Mars (3.7)</Badge>
                <Badge variant="outline" className="text-[10px] cursor-pointer" onClick={() => setGValue(9.8)}>Earth (9.8)</Badge>
                <Badge variant="outline" className="text-[10px] cursor-pointer" onClick={() => setGValue(24.8)}>Jupiter (24.8)</Badge>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Throw speed = {throwSpeed} m/s</label>
              <Slider value={throwSpeed} onValueChange={setThrowSpeed} min={5} max={50} step={1} />
            </div>
          </div>
          <Separator />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Max Height</p>
              <p className="font-mono text-lg font-bold">{maxH.toFixed(1)} m</p>
            </div>
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Time to Peak</p>
              <p className="font-mono text-lg font-bold">{timeUp.toFixed(2)} s</p>
            </div>
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Flight</p>
              <p className="font-mono text-lg font-bold">{totalTime.toFixed(2)} s</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">On the Moon, you&apos;d reach {((throwSpeed * throwSpeed) / (2 * 1.6)).toFixed(0)} m — about {((9.8 / 1.6)).toFixed(1)}× higher than Earth!</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">What if there were no air resistance?</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">In a vacuum, a feather and a bowling ball fall at exactly the same rate. Apollo 15 astronaut David Scott demonstrated this on the Moon in 1971.</p>
          <p className="text-sm text-muted-foreground">Without air resistance, a baseball thrown at 40 m/s at 45° would travel <Tex>{"163 \\text{ m}"}</Tex>. In real life, air drag reduces this to about 120 m. Air resistance is why we can ignore it for AP Physics 1 — the idealized model is much simpler!</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">What if you could throw at 1000 m/s?</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">At 45°, the range would be <Tex>{"R = (1000)^{2} \\sin(90^{\\circ}) / 9.8 = 102 \\text{ km}"}</Tex>! The max height would be 25.5 km — well into the stratosphere.</p>
          <p className="text-sm text-muted-foreground">At this point, our flat-Earth approximation breaks down. You&apos;d need to account for the curvature of the Earth, decreasing gravity with altitude, and significant air resistance at high speeds.</p>
          <p className="text-sm text-muted-foreground">At about 7,900 m/s horizontal, an object would orbit the Earth instead of falling back — that&apos;s orbital velocity!</p>
        </CardContent>
      </Card>
    </div>
  );
}
