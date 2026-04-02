"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PhETEmbedProps {
  title: string;
  description: string;
  simUrl: string;
  tips?: string[];
}

export function PhETEmbed({ title, description, simUrl, tips }: PhETEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!fullscreen) {
      containerRef.current.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  }, [fullscreen]);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-white/[0.08] bg-white/[0.02]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                PhET Simulation
              </Badge>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="h-8 w-8 p-0 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {fullscreen ? (
                    <><path d="M8 3v3a2 2 0 01-2 2H3" /><path d="M21 8h-3a2 2 0 01-2-2V3" /><path d="M3 16h3a2 2 0 012 2v3" /><path d="M16 21v-3a2 2 0 012-2h3" /></>
                  ) : (
                    <><path d="M8 3H5a2 2 0 00-2 2v3" /><path d="M21 8V5a2 2 0 00-2-2h-3" /><path d="M3 16v3a2 2 0 002 2h3" /><path d="M16 21h3a2 2 0 002-2v-3" /></>
                  )}
                </svg>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={containerRef} className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
            {/* Loading overlay */}
            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
                <p className="mt-3 text-sm text-white/50">Loading simulation...</p>
              </div>
            )}
            <iframe
              src={simUrl}
              className="h-full w-full border-0"
              allow="fullscreen"
              onLoad={() => setLoaded(true)}
              title={title}
              sandbox="allow-same-origin allow-scripts allow-popups"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      {tips && tips.length > 0 && (
        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tips for this simulation</p>
            <ul className="space-y-1.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
