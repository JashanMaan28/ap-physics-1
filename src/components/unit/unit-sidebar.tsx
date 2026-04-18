"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SectionIcon } from "@/components/icons/section-icon";
import type { UnitConfig } from "@/types/unit";

interface UnitSidebarProps {
  config: UnitConfig;
  activeView: string;
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  completedTopics: Set<string>;
  progressPercent: number;
  unitMistakeCount: number;
  streak: number;
  hrefFor: (id: string) => string;
}

export function UnitSidebar({
  config,
  activeView,
  isMobile,
  sidebarOpen,
  setSidebarOpen,
  completedTopics,
  progressPercent,
  unitMistakeCount,
  streak,
  hrefFor,
}: UnitSidebarProps) {
  return (
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
                      {item.id === "mistakes" && unitMistakeCount > 0 && (
                        <Badge
                          variant={isActive ? "secondary" : "destructive"}
                          className="h-5 min-w-[20px] justify-center px-1.5 text-[10px]"
                        >
                          {unitMistakeCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

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
  );
}
