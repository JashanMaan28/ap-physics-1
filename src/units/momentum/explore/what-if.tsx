"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

export function WhatIf() {
  // Scenario 1: What if you could catch a bullet?
  const [bulletMass, setBulletMass] = useState(0.01);
  const [bulletSpeed, setBulletSpeed] = useState(800);
  const [personMass, setPersonMass] = useState(70);
  const bulletMomentum = bulletMass * bulletSpeed;
  const personRecoil = bulletMomentum / personMass;
  const bulletKE = 0.5 * bulletMass * bulletSpeed * bulletSpeed;

  // Scenario 2: Asteroid deflection
  const [asteroidMass, setAsteroidMass] = useState(1e9); // kg
  const [asteroidSpeed, setAsteroidSpeed] = useState(20000); // m/s
  const [rocketMass, setRocketMass] = useState(1000); // kg
  const [rocketSpeed, setRocketSpeed] = useState(30000); // m/s
  const asteroidDeltaV = (rocketMass * rocketSpeed) / asteroidMass;

  // Scenario 3: Super-elastic collision (what if KE increased?)
  const [superBounceFactor, setSuperBounceFactor] = useState(1.5);
  const m1 = 5, v1 = 10, m2 = 5;
  const elasticV2f = (2 * m1 * v1) / (m1 + m2);
  const superV2f = elasticV2f * superBounceFactor;
  const superKEf = 0.5 * m2 * superV2f * superV2f;
  const normalKEi = 0.5 * m1 * v1 * v1;
  const energyGain = superKEf - normalKEi;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">What-If Scenarios</CardTitle>
          <CardDescription>Explore momentum through thought experiments</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="bullet">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bullet">Catching a Bullet</TabsTrigger>
          <TabsTrigger value="asteroid">Asteroid Deflection</TabsTrigger>
          <TabsTrigger value="super">Super-Elastic</TabsTrigger>
        </TabsList>

        {/* Scenario 1: Catching a Bullet */}
        <TabsContent value="bullet">
          <Card>
            <CardHeader>
              <CardTitle>What if you could catch a bullet?</CardTitle>
              <CardDescription>Perfectly inelastic collision: bullet embeds in person</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Bullet mass: {bulletMass} kg ({(bulletMass * 1000).toFixed(0)} g)</Label>
                  <Slider value={[bulletMass]} onValueChange={([v]) => setBulletMass(v)} min={0.005} max={0.05} step={0.005} />
                </div>
                <div className="space-y-2">
                  <Label>Bullet speed: {bulletSpeed} m/s</Label>
                  <Slider value={[bulletSpeed]} onValueChange={([v]) => setBulletSpeed(v)} min={200} max={1200} step={50} />
                </div>
                <div className="space-y-2">
                  <Label>Your mass: {personMass} kg</Label>
                  <Slider value={[personMass]} onValueChange={([v]) => setPersonMass(v)} min={40} max={120} step={5} />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded bg-muted text-center">
                  <div className="text-sm text-muted-foreground">Bullet Momentum</div>
                  <div className="text-lg font-bold">{bulletMomentum.toFixed(1)} kg·m/s</div>
                </div>
                <div className="p-4 rounded bg-muted text-center">
                  <div className="text-sm text-muted-foreground">Your Recoil Speed</div>
                  <div className="text-lg font-bold">{personRecoil.toFixed(3)} m/s</div>
                </div>
                <div className="p-4 rounded bg-red-500/10 border border-red-500/30 text-center col-span-2">
                  <div className="text-sm text-muted-foreground">Bullet Kinetic Energy</div>
                  <div className="text-lg font-bold text-red-500">{bulletKE.toFixed(0)} J</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    (A baseball pitch has ~120 J. This is {(bulletKE / 120).toFixed(0)}x more.)
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded text-sm">
                <p className="font-semibold">Insight:</p>
                <p>
                  The recoil speed is tiny ({personRecoil.toFixed(3)} m/s &mdash; barely a nudge) because
                  you&apos;re so much heavier than the bullet. But the bullet carries {bulletKE.toFixed(0)} J of
                  kinetic energy, which would be deposited into your body as tissue damage. Momentum is small;
                  energy is devastating. That&apos;s the key difference between p = mv and KE = &frac12;mv&sup2;.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenario 2: Asteroid Deflection */}
        <TabsContent value="asteroid">
          <Card>
            <CardHeader>
              <CardTitle>What if we had to deflect an asteroid?</CardTitle>
              <CardDescription>Using momentum transfer to save the planet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Asteroid mass: {asteroidMass.toExponential(1)} kg</Label>
                  <Slider value={[Math.log10(asteroidMass)]} onValueChange={([v]) => setAsteroidMass(Math.pow(10, v))} min={6} max={12} step={0.5} />
                </div>
                <div className="space-y-2">
                  <Label>Asteroid speed: {asteroidSpeed.toLocaleString()} m/s</Label>
                  <Slider value={[asteroidSpeed]} onValueChange={([v]) => setAsteroidSpeed(v)} min={5000} max={50000} step={1000} />
                </div>
                <div className="space-y-2">
                  <Label>Impactor mass: {rocketMass} kg</Label>
                  <Slider value={[rocketMass]} onValueChange={([v]) => setRocketMass(v)} min={100} max={10000} step={100} />
                </div>
                <div className="space-y-2">
                  <Label>Impactor speed: {rocketSpeed.toLocaleString()} m/s</Label>
                  <Slider value={[rocketSpeed]} onValueChange={([v]) => setRocketSpeed(v)} min={5000} max={70000} step={1000} />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded bg-muted text-center">
                  <div className="text-sm text-muted-foreground">Impactor Momentum</div>
                  <div className="text-lg font-bold">{(rocketMass * rocketSpeed).toExponential(2)} kg·m/s</div>
                </div>
                <div className="p-4 rounded bg-purple-500/10 border border-purple-500/30 text-center">
                  <div className="text-sm text-muted-foreground">Asteroid &Delta;v</div>
                  <div className="text-lg font-bold text-purple-500">{asteroidDeltaV.toExponential(3)} m/s</div>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded text-sm">
                <p className="font-semibold">Insight:</p>
                <p>
                  NASA&apos;s DART mission (2022) did exactly this! A 570 kg spacecraft hit asteroid
                  Dimorphos at ~6,100 m/s, changing its orbital period by 33 minutes. Even a tiny
                  &Delta;v of {asteroidDeltaV.toExponential(3)} m/s, applied years in advance, can shift
                  the asteroid&apos;s path enough to miss Earth. Conservation of momentum saves the planet!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenario 3: Super-Elastic */}
        <TabsContent value="super">
          <Card>
            <CardHeader>
              <CardTitle>What if collisions were &ldquo;super-elastic&rdquo;?</CardTitle>
              <CardDescription>What if objects bounced back faster than they came in?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                In reality, elastic collisions conserve KE, and inelastic ones lose KE. But what if
                a collision <em>added</em> KE? (This would violate energy conservation, but let&apos;s
                see what happens to momentum.)
              </p>

              <div className="space-y-2">
                <Label>Bounce factor: {superBounceFactor.toFixed(1)}x (1.0 = elastic)</Label>
                <Slider value={[superBounceFactor]} onValueChange={([v]) => setSuperBounceFactor(v)} min={0.5} max={3.0} step={0.1} />
              </div>

              <Separator />

              <div className="text-sm space-y-2">
                <p>Setup: {m1} kg ball at {v1} m/s hits a {m2} kg ball at rest.</p>
                <p>Elastic result: target ball leaves at {elasticV2f.toFixed(1)} m/s</p>
                <p>Super-elastic result: target ball leaves at <strong>{superV2f.toFixed(1)} m/s</strong></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded bg-muted text-center">
                  <div className="text-sm text-muted-foreground">Normal KE (in)</div>
                  <div className="text-lg font-bold">{normalKEi.toFixed(0)} J</div>
                </div>
                <div className="p-4 rounded bg-green-500/10 border border-green-500/30 text-center">
                  <div className="text-sm text-muted-foreground">Super KE (out)</div>
                  <div className="text-lg font-bold text-green-500">{superKEf.toFixed(0)} J</div>
                </div>
              </div>

              {energyGain > 0 && (
                <Badge variant="outline" className="text-green-600 border-green-400 dark:text-green-400">
                  +{energyGain.toFixed(0)} J created from nothing!
                </Badge>
              )}

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded text-sm">
                <p className="font-semibold">Insight:</p>
                <p>
                  Super-elastic collisions would violate conservation of energy &mdash; creating free
                  energy from nothing. This is why perfectly elastic is the upper limit for real collisions.
                  However, &ldquo;super-elastic&rdquo; behavior can appear when internal energy is released
                  (like an explosion triggered by impact), but the energy source is internal, not created.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WhatIf;
