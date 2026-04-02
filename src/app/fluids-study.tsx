"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import { PressureDepth } from "@/components/topics/pressure-depth";
import { PascalsLaw } from "@/components/topics/pascals-law";
import { Buoyancy } from "@/components/topics/buoyancy";
import { ContinuityEquation } from "@/components/topics/continuity";
import { BernoullisEquation } from "@/components/topics/bernoullis";
import { PracticeQuiz } from "@/components/topics/practice-quiz";
import { EquationSolver } from "@/components/tools/equation-solver";
import { UnitConverter } from "@/components/tools/unit-converter";
import { FBDBuilder } from "@/components/tools/fbd-builder";
import { Flashcards } from "@/components/review/flashcards";
import { WorkedExamples } from "@/components/review/worked-examples";
import { FormulaSheet } from "@/components/review/formula-sheet";
import { MistakeTracker } from "@/components/review/mistake-tracker";
import { ProblemGenerator } from "@/components/practice/problem-generator";
import { FRQPractice } from "@/components/practice/frq-practice";
import { TimedTest } from "@/components/practice/timed-test";
import { ConceptMap } from "@/components/explore/concept-map";
import { RealWorldExamples } from "@/components/explore/real-world";
import { WhatIfScenarios } from "@/components/explore/what-if";

// Mistake tracker context
interface MistakeEntry {
  topic: string;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  timestamp: number;
}

interface MistakeContextType {
  mistakes: MistakeEntry[];
  addMistake: (m: MistakeEntry) => void;
  clearMistakes: () => void;
}

export const MistakeContext = createContext<MistakeContextType>({
  mistakes: [],
  addMistake: () => {},
  clearMistakes: () => {},
});

export const useMistakes = () => useContext(MistakeContext);

const sections = [
  {
    label: "Learn",
    icon: "learn",
    items: [
      { id: "pressure", name: "Pressure & Depth", short: "Pressure" },
      { id: "pascal", name: "Pascal's Law", short: "Pascal" },
      { id: "buoyancy", name: "Buoyancy", short: "Buoyancy" },
      { id: "continuity", name: "Continuity Eq.", short: "Continuity" },
      { id: "bernoulli", name: "Bernoulli's Eq.", short: "Bernoulli" },
      { id: "concept-map", name: "Concept Map", short: "Map" },
      { id: "real-world", name: "Real-World Examples", short: "Examples" },
      { id: "what-if", name: "What If?", short: "What If" },
    ],
  },
  {
    label: "Practice",
    icon: "practice",
    items: [
      { id: "quiz", name: "Topic Quiz", short: "Quiz" },
      { id: "problem-gen", name: "Problem Generator", short: "Problems" },
      { id: "frq", name: "FRQ Practice", short: "FRQ" },
      { id: "timed-test", name: "Timed Mini-Test", short: "Timed" },
    ],
  },
  {
    label: "Tools",
    icon: "tools",
    items: [
      { id: "equation-solver", name: "Equation Solver", short: "Solver" },
      { id: "unit-converter", name: "Unit Converter", short: "Units" },
      { id: "fbd-builder", name: "FBD Builder", short: "FBD" },
    ],
  },
  {
    label: "Review",
    icon: "review",
    items: [
      { id: "flashcards", name: "Flashcards", short: "Flash" },
      { id: "worked-examples", name: "Worked Examples", short: "Worked" },
      { id: "formula-sheet", name: "Formula Sheet", short: "Formulas" },
      { id: "mistakes", name: "Mistake Tracker", short: "Mistakes" },
    ],
  },
];

function SectionIcon({ type, size = 16 }: { type: string; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "learn": return <svg {...props}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>;
    case "practice": return <svg {...props}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
    case "tools": return <svg {...props}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>;
    case "review": return <svg {...props}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
    default: return null;
  }
}

export function FluidsStudyApp() {
  const [activeView, setActiveView] = useState("pressure");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);

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

  const addMistake = useCallback((m: MistakeEntry) => {
    setMistakes((prev) => [...prev, m]);
  }, []);

  const clearMistakes = useCallback(() => {
    setMistakes([]);
  }, []);

  const toggleComplete = (topicId: string) => {
    setCompletedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  };

  const navigate = (id: string) => {
    setActiveView(id);
    if (isMobile) setSidebarOpen(false);
  };

  const learnTopics = sections[0].items.slice(0, 5);
  const progressPercent = (completedTopics.size / learnTopics.length) * 100;
  const currentItem = sections.flatMap((s) => s.items).find((i) => i.id === activeView);
  const currentSection = sections.find((s) => s.items.some((i) => i.id === activeView));

  const renderContent = () => {
    const topicProps = (id: string) => ({
      onComplete: () => toggleComplete(id),
      isComplete: completedTopics.has(id),
    });

    switch (activeView) {
      case "pressure": return <PressureDepth {...topicProps("pressure")} />;
      case "pascal": return <PascalsLaw {...topicProps("pascal")} />;
      case "buoyancy": return <Buoyancy {...topicProps("buoyancy")} />;
      case "continuity": return <ContinuityEquation {...topicProps("continuity")} />;
      case "bernoulli": return <BernoullisEquation {...topicProps("bernoulli")} />;
      case "concept-map": return <ConceptMap />;
      case "real-world": return <RealWorldExamples />;
      case "what-if": return <WhatIfScenarios />;
      case "quiz": return <PracticeQuiz />;
      case "problem-gen": return <ProblemGenerator />;
      case "frq": return <FRQPractice />;
      case "timed-test": return <TimedTest />;
      case "equation-solver": return <EquationSolver />;
      case "unit-converter": return <UnitConverter />;
      case "fbd-builder": return <FBDBuilder />;
      case "flashcards": return <Flashcards />;
      case "worked-examples": return <WorkedExamples />;
      case "formula-sheet": return <FormulaSheet />;
      case "mistakes": return <MistakeTracker />;
      default: return <PressureDepth {...topicProps("pressure")} />;
    }
  };

  return (
    <MistakeContext.Provider value={{ mistakes, addMistake, clearMistakes }}>
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
            ${isMobile
              ? `fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-out shadow-xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
              : `relative shrink-0 overflow-hidden transition-[width] duration-300 ease-out ${sidebarOpen ? "w-72 border-r" : "w-0"}`
            }
            bg-card
          `}
        >
          <div className="flex h-full w-72 flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center gap-3 px-5 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14c0 4 4 6 8 6s8-2 8-6" />
                  <path d="M4 14c0-2 2-4 4-5" />
                  <path d="M20 14c0-2-2-4-4-5" />
                  <path d="M12 4v5" />
                  <circle cx="12" cy="11" r="2" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base font-bold tracking-tight">AP Physics 1</h1>
                <p className="text-xs text-muted-foreground">Fluids Unit</p>
              </div>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="h-8 w-8 cursor-pointer p-0 text-muted-foreground"
                  aria-label="Close sidebar"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </Button>
              )}
            </div>

            {/* Progress */}
            <div className="mx-5 mb-4 rounded-xl bg-primary/5 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{completedTopics.size} of {learnTopics.length} topics</span>
                <Badge variant="secondary" className="h-5 px-2 font-mono text-[10px]">
                  {Math.round(progressPercent)}%
                </Badge>
              </div>
              <Progress value={progressPercent} className="mt-2 h-1.5" />
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-3">
              {sections.map((section) => (
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
                        <button
                          key={item.id}
                          onClick={() => navigate(item.id)}
                          className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <span className="flex-1 truncate">{item.name}</span>
                          {isCompleted && !isActive && (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                          {isCompleted && isActive && (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary-foreground">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                          {item.id === "mistakes" && mistakes.length > 0 && (
                            <Badge
                              variant={isActive ? "secondary" : "destructive"}
                              className="h-5 min-w-[20px] justify-center px-1.5 text-[10px]"
                            >
                              {mistakes.length}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="border-t px-5 py-3">
              <p className="text-center text-[10px] text-muted-foreground/50">
                AP Physics 1 &middot; Fluids Study Guide
              </p>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              {currentSection && (
                <>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {currentSection.label}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hidden shrink-0 text-muted-foreground/50 sm:inline">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </>
              )}
              <h2 className="truncate font-semibold">{currentItem?.name ?? ""}</h2>
            </div>

            {/* Right side: progress on mobile */}
            <div className="ml-auto flex items-center gap-2 lg:hidden">
              <Badge variant="secondary" className="font-mono text-[10px]">
                {completedTopics.size}/{learnTopics.length}
              </Badge>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </MistakeContext.Provider>
  );
}
