"use client";

import { useState, useEffect } from "react";
import { useProgress } from "@/contexts/progress-context";
import { unitConfigs, units } from "@/units/registry";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileMenu } from "@/components/profile-menu";
import { ArcadePreview } from "@/components/arcade/arcade-preview";
import { RadarPreviewCard } from "@/components/insights/radar-preview-card";
import { Hero } from "@/components/home/hero";
import { UnitGrid } from "@/components/home/unit-grid";
import { ExamWeightage } from "@/components/home/exam-weightage";
import { ExamInfo } from "@/components/home/exam-info";
import { HomeFooter } from "@/components/home/home-footer";

export default function HomePage() {
  const { getOverallProgress } = useProgress();
  const [mounted, setMounted] = useState(false);
  const [enterDone, setEnterDone] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => setEnterDone(true), 400 + units.length * 80 + 300);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  const unitTotals: Record<string, number> = {};
  for (const unit of units) {
    const config = unitConfigs[unit.slug];
    unitTotals[unit.slug] = config?.learnTopicIds.length ?? 0;
  }
  const overall = getOverallProgress(unitTotals);
  const totalTopics = Object.values(unitTotals).reduce((a, b) => a + b, 0);
  const showNewtonApple = mounted && overall === 100;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle className="bg-card/80 backdrop-blur-sm border border-border shadow-sm" />
        <ProfileMenu className="bg-card/80 backdrop-blur-sm rounded-full" />
      </div>

      <Hero mounted={mounted} overall={overall} totalTopics={totalTopics} />

      <UnitGrid mounted={mounted} enterDone={enterDone} overall={overall} />

      <section className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <RadarPreviewCard
          title="Weak Spot Radar"
          description="A live preview of the units pulling readiness down the most."
        />
      </section>

      <ArcadePreview />

      <ExamWeightage />

      <ExamInfo />

      <HomeFooter showNewtonApple={showNewtonApple} />

      <style>{`
        @keyframes float-drift {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-60px) translateX(30px); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
