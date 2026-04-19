"use client";

import { Suspense, useCallback, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useProgress } from "@/contexts/progress-context";
import { useMistakes } from "@/contexts/mistake-context";
import { useArcade } from "@/contexts/arcade-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { TopicSkeleton } from "@/components/unit/topic-skeleton";
import { UnitSidebar } from "@/components/unit/unit-sidebar";
import { UnitHeader } from "@/components/unit/unit-header";
import type { UnitConfig, TopicProps } from "@/types/unit";

function resolveInitialView(config: UnitConfig, initialView?: string) {
  const validIds = new Set(config.sections.flatMap((section) => section.items.map((item) => item.id)));
  if (initialView && validIds.has(initialView)) {
    return initialView;
  }

  return config.sections[0]?.items[0]?.id ?? "";
}

export function UnitShell({ config }: { config: UnitConfig }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeView = resolveInitialView(config, searchParams.get("view") ?? undefined);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { getCompleted, toggleComplete, getProgress } = useProgress();
  const { getMistakesForUnit } = useMistakes();
  const { level, streak } = useArcade();

  const completedTopics = getCompleted(config.slug);
  const unitMistakes = getMistakesForUnit(config.slug);
  const progressPercent = getProgress(config.slug, config.learnTopicIds.length);

  useEffect(() => {
    // Tablets and up (≥ 820px, covers iPad portrait) keep the persistent
    // sidebar; narrower phones use the off-canvas drawer.
    const check = () => {
      const mobile = window.innerWidth < 820;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const hrefFor = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", id);
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  const currentItem = config.sections.flatMap((s) => s.items).find((i) => i.id === activeView);
  const currentSection = config.sections.find((s) => s.items.some((i) => i.id === activeView));

  const renderContent = () => {
    const Component = config.componentMap[activeView];
    if (!Component) return null;

    if (config.learnTopicIds.includes(activeView)) {
      const Comp = Component as React.ComponentType<TopicProps>;
      return (
        <Comp
          onComplete={() => toggleComplete(config.slug, activeView)}
          isComplete={completedTopics.has(activeView)}
        />
      );
    }

    const Comp = Component as React.ComponentType;
    return <Comp />;
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <UnitSidebar
        config={config}
        activeView={activeView}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        completedTopics={completedTopics}
        progressPercent={progressPercent}
        unitMistakeCount={unitMistakes.length}
        streak={streak}
        hrefFor={hrefFor}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <UnitHeader
          config={config}
          completedTopics={completedTopics}
          currentItem={currentItem}
          currentSection={currentSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
          level={level}
        />

        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
            <ErrorBoundary fallbackLabel="This section failed to load">
              <Suspense fallback={<TopicSkeleton />}>{renderContent()}</Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
