"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileMenu } from "@/components/profile-menu";
import type { Section, SectionItem, UnitConfig } from "@/types/unit";

interface UnitHeaderProps {
  config: UnitConfig;
  completedTopics: Set<string>;
  currentItem: SectionItem | undefined;
  currentSection: Section | undefined;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
  level: number;
}

export function UnitHeader({
  config,
  completedTopics,
  currentItem,
  currentSection,
  sidebarOpen,
  setSidebarOpen,
  isMobile,
  level,
}: UnitHeaderProps) {
  return (
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

      <Separator orientation="vertical" className="hidden h-5 self-center data-vertical:self-center sm:block" />

      <div className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link
          href="/"
          aria-label="Back to home"
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-2"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M3 11l9-8 9 8" />
            <path d="M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" />
          </svg>
          <span className="hidden sm:inline">Unit {config.number}</span>
          <span className="sm:hidden">U{config.number}</span>
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
              className="shrink-0 text-muted-foreground/50"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </>
        )}
        <h2 className="truncate font-semibold">{currentItem?.name ?? ""}</h2>
      </div>

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
  );
}
