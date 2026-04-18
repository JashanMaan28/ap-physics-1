"use client";

import { Suspense, useCallback, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useProgress } from "@/contexts/progress-context";
import { useMistakes } from "@/contexts/mistake-context";
import { useArcade } from "@/contexts/arcade-context";
import type { UnitConfig, TopicProps } from "@/types/unit";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileMenu } from "@/components/profile-menu";
import { ErrorBoundary } from "@/components/error-boundary";

function TopicSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-1/3 rounded bg-muted/60" />
      <div className="h-4 w-2/3 rounded bg-muted/40" />
      <div className="h-64 w-full rounded-lg bg-muted/30" />
    </div>
  );
}

function SectionIcon({ type, size = 16 }: { type: string; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "learn":
      return (
        <svg {...props}>
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
        </svg>
      );
    case "practice":
      return (
        <svg {...props}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      );
    case "tools":
      return (
        <svg {...props}>
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "review":
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      );
    case "simulations":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      );
    default:
      return null;
  }
}

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
    const check = () => {
      const mobile = window.innerWidth < 1024;
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

    // If this is a learn topic, pass topic props
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
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${
            isMobile
              ? `fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-out shadow-xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
              : `relative shrink-0 overflow-hidden transition-[width] duration-300 ease-out ${sidebarOpen ? "w-72 border-r" : "w-0"}`
          }
          bg-card
        `}
      >
        <div className="flex h-full w-72 flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center gap-3 px-5 py-5">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-colors hover:opacity-80"
              style={{ backgroundColor: config.color, color: "#fff" }}
            >
              <span className="text-sm font-bold">{config.number}</span>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold tracking-tight">AP Physics 1</h1>
              <p className="text-xs text-muted-foreground">{config.shortName}</p>
            </div>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 cursor-pointer p-0 text-muted-foreground"
                aria-label="Close sidebar"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Button>
            )}
          </div>

          {/* Progress */}
          <div className="mx-5 mb-4 rounded-xl bg-primary/5 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                {completedTopics.size} of {config.learnTopicIds.length} topics
              </span>
              <Badge variant="secondary" className="h-5 px-2 font-mono text-[10px]">
                {Math.round(progressPercent)}%
              </Badge>
            </div>
            <Progress value={progressPercent} className="mt-2 h-1.5" />
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-3">
            {config.sections.map((section) => (
              <div key={section.label} className="mb-4">
                <div className="flex items-center gap-2 px-2 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70">
                  <SectionIcon type={section.icon} size={13} />
                  {section.label}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = activeView === item.id;
                    const isCompleted = completedTopics.has(item.id);
                    return (
                      <Link
                        key={item.id}
                        href={hrefFor(item.id)}
                        scroll={false}
                        replace
                        prefetch={false}
                        onClick={() => {
                          if (isMobile) setSidebarOpen(false);
                        }}
                        className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span className="flex-1 truncate">{item.name}</span>
                        {isCompleted && !isActive && (
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0 text-primary"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                        {isCompleted && isActive && (
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0 text-primary-foreground"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                        {item.id === "mistakes" && unitMistakes.length > 0 && (
                          <Badge
                            variant={isActive ? "secondary" : "destructive"}
                            className="h-5 min-w-[20px] justify-center px-1.5 text-[10px]"
                          >
                            {unitMistakes.length}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t px-5 py-3">
            <Link
              href="/arcade"
              className="mb-2 block rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-center text-[11px] font-medium text-primary transition hover:bg-primary/15"
            >
              Study Arcade · {streak}-day streak
            </Link>
            <Link href="/" className="block text-center text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">
              ← Back to All Units
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-2 border-b bg-card/50 px-3 py-2.5 backdrop-blur-sm sm:gap-3 sm:px-5 sm:py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-9 w-9 cursor-pointer p-0"
            aria-label="Toggle sidebar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {sidebarOpen && !isMobile ? (
                <>
                  <path d="M11 17l-5-5 5-5" />
                  <path d="M18 17l-5-5 5-5" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="15" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </Button>

          <Separator orientation="vertical" className="hidden h-5 sm:block" />

          {/* Breadcrumb */}
          <div className="flex min-w-0 items-center gap-1.5 text-sm">
            <Link href="/" className="hidden text-xs text-muted-foreground hover:text-foreground transition-colors sm:inline">
              Unit {config.number}
            </Link>
            {currentSection && (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="hidden shrink-0 text-muted-foreground/50 sm:inline"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {currentSection.label}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="hidden shrink-0 text-muted-foreground/50 sm:inline"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </>
            )}
            <h2 className="truncate font-semibold">{currentItem?.name ?? ""}</h2>
          </div>

          {/* Right side: progress on mobile */}
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-[10px] lg:hidden">
              {completedTopics.size}/{config.learnTopicIds.length}
            </Badge>
            <Link
              href="/arcade"
              className="hidden rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary transition hover:bg-primary/15 sm:inline"
            >
              Arcade · Lv {level}
            </Link>
            <ThemeToggle />
            <ProfileMenu />
          </div>
        </header>

        {/* Content */}
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
