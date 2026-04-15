"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { units } from "@/data/units";
import { useMistakes } from "@/contexts/mistake-context";
import { useArcade } from "@/contexts/arcade-context";
import {
  buildExamDraft,
  createShareCardText,
  getBossBattle,
  getDailyChallenge,
  getTodayKey,
  type ArcadeQuestion,
} from "@/lib/arcade-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeIcon, type HomeIconHandle } from "@/components/icons/home-icon";

type ArcadeTab = "overview" | "challenges" | "planner" | "notebook" | "unlocks";
type ChallengeTab = "daily" | "boss";

function initialTab(): ArcadeTab {
  if (typeof window !== "undefined" && window.location.hash === "#lab-notebook") {
    return "notebook";
  }
  return "overview";
}

function formatWhen(timestamp: number) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Section({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Card id={id} className="border-white/[0.08] bg-white/[0.03]">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card size="sm" className="border-white/10 bg-black/20">
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-foreground/40">{label}</p>
        <p className="mt-2 text-3xl font-black">{value}</p>
        <p className="mt-1 text-xs text-foreground/55">{detail}</p>
      </CardContent>
    </Card>
  );
}

function Runner({
  title,
  description,
  questions,
  answers,
  setAnswers,
  score,
  submitLabel,
  onSubmit,
  currentIndex,
  setCurrentIndex,
  record,
  intro,
  accent,
}: {
  title: string;
  description: string;
  questions: ArcadeQuestion[];
  answers: Record<string, number>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  score: number | null;
  submitLabel: string;
  onSubmit: () => void;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  record?: React.ReactNode;
  intro?: React.ReactNode;
  accent: string;
}) {
  const current = questions[currentIndex];
  const answered = questions.filter((question) => answers[question.id] !== undefined).length;

  return (
    <Section title={title} description={description}>
      <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
        <Badge variant="secondary">
          Question {currentIndex + 1} / {questions.length}
        </Badge>
        <span>{answered}/{questions.length} answered</span>
        {record}
      </div>

      {intro}

      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={question.id}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs transition ${
              currentIndex === index
                ? `${accent} border-transparent text-white`
                : answers[question.id] !== undefined
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border text-foreground/55 hover:border-primary/40"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-background/60 p-5">
        <p className="text-sm font-semibold">{current.prompt}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {current.choices.map((choice, choiceIndex) => (
            <button
              key={choice}
              type="button"
              onClick={() =>
                setAnswers((value) => ({
                  ...value,
                  [current.id]: choiceIndex,
                }))
              }
              className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                answers[current.id] === choiceIndex
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground/75 hover:border-primary/40"
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
        {score !== null && (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-foreground/80">
            {answers[current.id] === current.answer ? "Correct." : "Review:"} {current.explanation}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((value) => Math.min(questions.length - 1, value + 1))}
          disabled={currentIndex === questions.length - 1}
        >
          Next
        </Button>
        <Button onClick={onSubmit}>{submitLabel}</Button>
        {score !== null && <span className="text-sm text-foreground/65">Score {score}/{questions.length}</span>}
      </div>
    </Section>
  );
}

export function StudyArcade() {
  const homeIconRef = useRef<HomeIconHandle>(null);
  const {
    xp,
    level,
    streak,
    nextLevelXp,
    overallProgress,
    progressByUnit,
    mistakesByUnit,
    notebook,
    achievements,
    dailyChallenges,
    bossBattles,
    rematchWins,
    draftsGenerated,
    shareCopies,
    addNotebookNote,
    completeDailyChallenge,
    completeBossBattle,
    completeRematch,
    recordDraftGenerated,
    copyShareCard,
  } = useArcade();
  const { mistakes } = useMistakes();

  const [tab, setTab] = useState<ArcadeTab>(initialTab);
  const [challengeTab, setChallengeTab] = useState<ChallengeTab>("daily");
  const [dailyIndex, setDailyIndex] = useState(0);
  const [bossIndex, setBossIndex] = useState(0);

  const todayKey = getTodayKey();
  const dailyQuestions = getDailyChallenge(todayKey);
  const todayRecord = dailyChallenges.find((entry) => entry.dateKey === todayKey);
  const [dailyAnswers, setDailyAnswers] = useState<Record<string, number>>({});
  const [dailyScore, setDailyScore] = useState<number | null>(null);

  const [selectedBattleUnit, setSelectedBattleUnit] = useState(units[0].slug);
  const battle = getBossBattle(selectedBattleUnit);
  const currentBattleRecord = bossBattles.find((entry) => entry.unitSlug === selectedBattleUnit);
  const [battleAnswers, setBattleAnswers] = useState<Record<string, number>>({});
  const [battleScore, setBattleScore] = useState<number | null>(null);

  const [draftSeed, setDraftSeed] = useState(1);
  const draftSteps = buildExamDraft(progressByUnit, mistakesByUnit, draftSeed);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [noteUnit, setNoteUnit] = useState("");
  const [notebookPage, setNotebookPage] = useState(0);

  const [clearedMistakes, setClearedMistakes] = useState<string[]>([]);
  const recentMistakes = [...mistakes].reverse().slice(0, 3);

  const unlocked = achievements.filter((achievement) => achievement.unlocked);
  const locked = achievements.filter((achievement) => !achievement.unlocked);
  const xpToNextLevel = Math.max(0, nextLevelXp - xp);
  const xpWithinLevel = xp - (level - 1) * 120;
  const notebookPageSize = 4;
  const notebookPageCount = Math.max(1, Math.ceil(notebook.length / notebookPageSize));
  const safeNotebookPage = Math.min(notebookPage, notebookPageCount - 1);
  const notebookStart = safeNotebookPage * notebookPageSize;
  const visibleNotebookEntries = notebook.slice(
    notebookStart,
    notebookStart + notebookPageSize
  );
  const shareText = createShareCardText({
    level,
    xp,
    streak,
    progress: overallProgress,
    dailyBest: dailyChallenges[0] ? `${dailyChallenges[0].score}/${dailyChallenges[0].total}` : undefined,
    bossBest: bossBattles[0] ? `${bossBattles[0].unitSlug} (${bossBattles[0].rank})` : undefined,
  });

  function submitDaily() {
    const score = dailyQuestions.reduce((total, question) => {
      return total + (dailyAnswers[question.id] === question.answer ? 1 : 0);
    }, 0);
    setDailyScore(score);
    completeDailyChallenge({ dateKey: todayKey, score, total: dailyQuestions.length });
  }

  function submitBoss() {
    const score = battle.questions.reduce((total, question) => {
      return total + (battleAnswers[question.id] === question.answer ? 1 : 0);
    }, 0);
    setBattleScore(score);
    completeBossBattle({ unitSlug: selectedBattleUnit, score, total: battle.questions.length });
  }

  function saveNote() {
    const title = noteTitle.trim();
    const body = noteBody.trim();
    if (!title || !body) return;
    addNotebookNote({ title, body, unitSlug: noteUnit || undefined });
    setNoteTitle("");
    setNoteBody("");
    setNoteUnit("");
    setNotebookPage(0);
  }

  async function copyCard() {
    await copyShareCard();
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-start">
          <Link
            href="/"
            onMouseEnter={() => homeIconRef.current?.startAnimation()}
            onMouseLeave={() => homeIconRef.current?.stopAnimation()}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/80 px-3 py-2 text-sm text-foreground/75 transition hover:border-primary/30 hover:text-foreground"
            aria-label="Go home"
          >
            <HomeIcon ref={homeIconRef} size={20} className="text-primary" />
            <span>Home</span>
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
                Study Arcade
              </Badge>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Organized into focus lanes instead of one giant wall.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/65 sm:text-base">
                Jump between overview, challenges, planning, notebook work, and unlock tracking.
                The features are the same, but the page is easier to scan and use.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  ["overview", "Overview"],
                  ["challenges", "Challenges"],
                  ["planner", "Planner"],
                  ["notebook", "Notebook"],
                  ["unlocks", "Unlocks"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key as ArcadeTab)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      tab === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/10 bg-black/10 text-foreground/65 hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[27rem]">
              <Stat label="Level" value={`${level}`} detail={`${xp} XP total`} />
              <Stat label="Streak" value={`${streak}`} detail="Daily login streak" />
              <Card size="sm" className="border-white/10 bg-black/20 sm:col-span-2">
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-center justify-between text-xs text-foreground/55">
                    <span>Progress to next level</span>
                    <span>{xpToNextLevel} XP left</span>
                  </div>
                  <Progress value={(xpWithinLevel / 120) * 100} className="h-2" />
                  <div className="flex flex-wrap gap-3 text-xs text-foreground/55">
                    <span>{Math.round(overallProgress)}% course complete</span>
                    <span>{unlocked.length}/{achievements.length} achievements</span>
                    <span>{rematchWins} rematches cleared</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(value) => setTab(value as ArcadeTab)} className="mt-8 gap-6">
          <TabsList variant="line" className="w-full justify-start overflow-x-auto rounded-2xl border bg-card p-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="planner">Planner</TabsTrigger>
            <TabsTrigger value="notebook">Notebook</TabsTrigger>
            <TabsTrigger value="unlocks">Unlocks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <Section title="Today at a Glance" description="A compact summary instead of full-page everything.">
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">Daily</p>
                      <p className="mt-2 text-2xl font-black">{todayRecord ? `${todayRecord.score}/${todayRecord.total}` : "Not run"}</p>
                      <p className="mt-1 text-xs text-foreground/55">Best score for {todayKey}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">Bosses</p>
                      <p className="mt-2 text-2xl font-black">{bossBattles.length}</p>
                      <p className="mt-1 text-xs text-foreground/55">Units cleared</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">Notebook</p>
                      <p className="mt-2 text-2xl font-black">{notebook.length}</p>
                      <p className="mt-1 text-xs text-foreground/55">Saved entries</p>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <button type="button" onClick={() => { setTab("challenges"); setChallengeTab("daily"); }} className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4 text-left transition hover:border-primary/30">
                      <p className="text-sm font-semibold">Start daily challenge</p>
                      <p className="mt-2 text-xs leading-5 text-foreground/60">Five questions, one clean runner.</p>
                    </button>
                    <button type="button" onClick={() => setTab("planner")} className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4 text-left transition hover:border-primary/30">
                      <p className="text-sm font-semibold">Open exam planner</p>
                      <p className="mt-2 text-xs leading-5 text-foreground/60">Weighted draft based on progress and mistakes.</p>
                    </button>
                    <button type="button" onClick={() => setTab("notebook")} className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4 text-left transition hover:border-primary/30">
                      <p className="text-sm font-semibold">Go to notebook</p>
                      <p className="mt-2 text-xs leading-5 text-foreground/60">Capture notes and simulation ideas.</p>
                    </button>
                    <button type="button" onClick={() => setTab("unlocks")} className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4 text-left transition hover:border-primary/30">
                      <p className="text-sm font-semibold">Review unlocks</p>
                      <p className="mt-2 text-xs leading-5 text-foreground/60">See what is done and what is still locked.</p>
                    </button>
                  </div>
                </Section>

                <Section title="Mistake Pressure" description="Fresh weak spots only.">
                  {recentMistakes.length === 0 ? (
                    <p className="text-sm text-foreground/60">No mistakes logged yet.</p>
                  ) : (
                    <div className="grid gap-3">
                      {recentMistakes.map((mistake, index) => (
                        <div key={`${mistake.timestamp}-${index}`} className="rounded-2xl border border-white/10 bg-background/60 p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{mistake.topic}</Badge>
                            <span className="text-xs text-foreground/45">{formatWhen(mistake.timestamp)}</span>
                          </div>
                          <p className="mt-3 text-sm font-semibold">{mistake.question}</p>
                          <p className="mt-2 text-xs leading-5 text-foreground/60">
                            Your answer: {mistake.yourAnswer} · Correct: {mistake.correctAnswer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>
              </div>

              <div className="space-y-6">
                <Section title="Share Card" description="A compact preview instead of a huge standalone block.">
                  <div className="rounded-[1.5rem] border border-primary/20 bg-[linear-gradient(135deg,rgba(59,130,246,0.16),rgba(16,185,129,0.08))] p-5">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-6 text-foreground/80">{shareText}</pre>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={copyCard}>Copy result card</Button>
                    <span className="text-sm text-foreground/60">Cards copied: {shareCopies}</span>
                  </div>
                </Section>

                <Section title="Recent Unlocks" description="Preview only. Full wall lives in Unlocks.">
                  <div className="space-y-3">
                    {unlocked.slice(0, 5).map((achievement) => (
                      <div key={achievement.id} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">{achievement.title}</p>
                          <Badge variant="secondary">Unlocked</Badge>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-foreground/65">{achievement.description}</p>
                      </div>
                    ))}
                    {unlocked.length === 0 && <p className="text-sm text-foreground/60">No unlocks yet.</p>}
                  </div>
                </Section>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <Tabs value={challengeTab} onValueChange={(value) => setChallengeTab(value as ChallengeTab)} className="gap-4">
                  <TabsList variant="line" className="w-full justify-start rounded-2xl border bg-card p-2">
                    <TabsTrigger value="daily">Daily Challenge</TabsTrigger>
                    <TabsTrigger value="boss">Boss Battles</TabsTrigger>
                  </TabsList>

                  <TabsContent value="daily">
                    <Runner
                      title="Daily Challenge"
                      description="One compact runner for the entire daily set."
                      questions={dailyQuestions}
                      answers={dailyAnswers}
                      setAnswers={setDailyAnswers}
                      score={dailyScore}
                      submitLabel="Submit daily challenge"
                      onSubmit={submitDaily}
                      currentIndex={dailyIndex}
                      setCurrentIndex={setDailyIndex}
                      accent="bg-primary"
                      record={todayRecord ? <span>Best today: {todayRecord.score}/{todayRecord.total}</span> : <span>First run today</span>}
                      intro={<div className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4 text-sm text-foreground/65">Same questions all day, picked deterministically from the date.</div>}
                    />
                  </TabsContent>

                  <TabsContent value="boss">
                    <Runner
                      title="Boss Battles"
                      description="Pick a unit, then fight one question at a time."
                      questions={battle.questions}
                      answers={battleAnswers}
                      setAnswers={setBattleAnswers}
                      score={battleScore}
                      submitLabel="Enter boss battle"
                      onSubmit={submitBoss}
                      currentIndex={bossIndex}
                      setCurrentIndex={setBossIndex}
                      accent="bg-rose-500"
                      record={currentBattleRecord ? <span>Best rank: {currentBattleRecord.rank} ({currentBattleRecord.score}/{currentBattleRecord.total})</span> : <span>Not cleared yet</span>}
                      intro={
                        <div className="space-y-4">
                          <select
                            value={selectedBattleUnit}
                            onChange={(event) => {
                              setSelectedBattleUnit(event.target.value);
                              setBattleAnswers({});
                              setBattleScore(null);
                              setBossIndex(0);
                            }}
                            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                          >
                            {units.map((unit) => (
                              <option key={unit.slug} value={unit.slug}>
                                {unit.shortName}
                              </option>
                            ))}
                          </select>
                          <div className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4">
                            <p className="text-lg font-semibold">{battle.title}</p>
                            <p className="mt-1 text-sm text-foreground/65">{battle.flavor}</p>
                            <p className="mt-2 text-xs text-emerald-500">{battle.reward}</p>
                          </div>
                        </div>
                      }
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <Section title="Mistake Revenge Mode" description="Small and focused.">
                {recentMistakes.length === 0 ? (
                  <p className="text-sm text-foreground/60">No mistakes logged yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recentMistakes.map((mistake, index) => {
                      const key = `${mistake.timestamp}-${index}`;
                      const cleared = clearedMistakes.includes(key);
                      return (
                        <div key={key} className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <Badge variant="outline">{mistake.topic}</Badge>
                            <span className="text-xs text-foreground/45">{formatWhen(mistake.timestamp)}</span>
                          </div>
                          <p className="mt-3 text-sm font-semibold">{mistake.question}</p>
                          <div className="mt-3 grid gap-2">
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">Your answer: {mistake.yourAnswer}</div>
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">Correct answer: {mistake.correctAnswer}</div>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <Button
                              variant={cleared ? "secondary" : "default"}
                              onClick={() => {
                                if (cleared) return;
                                completeRematch(mistake.topic);
                                setClearedMistakes((value) => [...value, key]);
                              }}
                            >
                              {cleared ? "Cleared" : "Clear rematch"}
                            </Button>
                            <span className="text-xs text-foreground/55">Counts toward revenge clears and arcade XP.</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Section>
            </div>
          </TabsContent>

          <TabsContent value="planner" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Section title="Exam Mode Draft" description="Weighted planning based on actual need.">
                <div className="grid gap-3 md:grid-cols-2">
                  {draftSteps.map((step, index) => (
                    <div key={step.unitSlug} className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{index + 1}. {step.unitName}</p>
                        <Badge variant="secondary">{step.minutes} min</Badge>
                      </div>
                      <p className="mt-2 text-sm text-primary">{step.focus}</p>
                      <p className="mt-2 text-xs leading-5 text-foreground/60">{step.reason}</p>
                      <div className="mt-3 text-xs text-foreground/45">Current progress: {Math.round(progressByUnit[step.unitSlug] ?? 0)}%</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => { setDraftSeed((value) => value + 1); recordDraftGenerated(); }}>Redraft session</Button>
                  <span className="text-sm text-foreground/60">Drafts generated: {draftsGenerated}</span>
                </div>
              </Section>

              <Section title="Unit Pressure Map" description="Progress and mistake load in one side panel.">
                <div className="space-y-4">
                  {units.map((unit) => (
                    <div key={unit.slug} className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{unit.shortName}</p>
                        <Badge variant="outline">{mistakesByUnit[unit.slug] ?? 0} mistakes</Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-xs text-foreground/55">
                          <span>Progress</span>
                          <span>{Math.round(progressByUnit[unit.slug] ?? 0)}%</span>
                        </div>
                        <Progress value={progressByUnit[unit.slug] ?? 0} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </TabsContent>

          <TabsContent value="notebook" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <Section id="lab-notebook" title="Write a Note" description="Capture first, review second.">
                <div className="grid gap-3">
                  <input value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} placeholder="Entry title" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                  <select value={noteUnit} onChange={(event) => setNoteUnit(event.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
                    <option value="">General note</option>
                    {units.map((unit) => <option key={unit.slug} value={unit.slug}>{unit.shortName}</option>)}
                  </select>
                  <textarea value={noteBody} onChange={(event) => setNoteBody(event.target.value)} placeholder="What did you notice, predict, or finally understand?" className="min-h-32 rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={saveNote}>Save note</Button>
                    <span className="text-xs text-foreground/55">Simulation predictions land here too.</span>
                  </div>
                </div>
              </Section>

              <Section title="Notebook Entries" description="Newest first.">
                <div className="space-y-3">
                  {notebook.length === 0 ? (
                    <p className="text-sm text-foreground/60">No entries yet. Save a note here or lock a prediction from a simulation.</p>
                  ) : (
                    visibleNotebookEntries.map((entry) => (
                      <div key={entry.id} className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{entry.kind}</Badge>
                          {entry.unitSlug && <Badge variant="secondary">{entry.unitSlug}</Badge>}
                          {entry.confidence && <Badge variant="secondary">{entry.confidence} confidence</Badge>}
                          <span className="text-xs text-foreground/45">{formatWhen(entry.createdAt)}</span>
                        </div>
                        <p className="mt-3 text-sm font-semibold">{entry.title}</p>
                        <p className="mt-2 text-sm leading-6 text-foreground/65">{entry.body}</p>
                      </div>
                    ))
                  )}
                </div>
                {notebook.length > notebookPageSize && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-white/10 bg-background/40 px-4 py-3">
                    <span className="text-xs text-foreground/55">
                      Showing {notebookStart + 1}-{Math.min(notebookStart + notebookPageSize, notebook.length)} of {notebook.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setNotebookPage((value) => Math.max(0, value - 1))}
                        disabled={safeNotebookPage === 0}
                      >
                        Previous
                      </Button>
                      <span className="text-xs text-foreground/55">
                        Page {safeNotebookPage + 1} / {notebookPageCount}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setNotebookPage((value) =>
                            Math.min(notebookPageCount - 1, value + 1)
                          )
                        }
                        disabled={safeNotebookPage >= notebookPageCount - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </Section>
            </div>
          </TabsContent>

          <TabsContent value="unlocks" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <Section title="Achievements" description="Unlocked first, locked second.">
                <div className="space-y-6">
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.18em] text-foreground/40">Unlocked</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {unlocked.map((achievement) => (
                        <div key={achievement.id} className="rounded-[1.5rem] border border-emerald-500/25 bg-emerald-500/10 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold">{achievement.title}</p>
                            <Badge variant="secondary">Unlocked</Badge>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-foreground/65">{achievement.description}</p>
                        </div>
                      ))}
                      {unlocked.length === 0 && <p className="text-sm text-foreground/60">Nothing unlocked yet.</p>}
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.18em] text-foreground/40">Still Locked</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {locked.map((achievement) => (
                        <div key={achievement.id} className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold">{achievement.title}</p>
                            <Badge variant="outline">Locked</Badge>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-foreground/60">{achievement.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              <div className="space-y-6">
                <Section title="Result Card" description="Summary artifact, not a workflow panel.">
                  <div className="rounded-[1.5rem] border border-primary/20 bg-[linear-gradient(135deg,rgba(59,130,246,0.16),rgba(16,185,129,0.08))] p-5">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-6 text-foreground/80">{shareText}</pre>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={copyCard}>Copy result card</Button>
                    <span className="text-sm text-foreground/60">Cards copied: {shareCopies}</span>
                  </div>
                </Section>

                <Section title="Boss Battle Log" description="Recent clears without taking over the challenge flow.">
                  <div className="space-y-3">
                    {bossBattles.length === 0 ? (
                      <p className="text-sm text-foreground/60">No boss battles cleared yet.</p>
                    ) : (
                      bossBattles.map((battleRecord) => (
                        <div key={battleRecord.unitSlug} className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold">{battleRecord.unitSlug}</p>
                            <Badge variant="secondary">{battleRecord.rank}</Badge>
                          </div>
                          <p className="mt-2 text-xs text-foreground/60">
                            Score {battleRecord.score}/{battleRecord.total} · {formatWhen(battleRecord.completedAt)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </Section>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-foreground/55">
          <Link href="/" className="text-primary hover:underline">
            Back to home
          </Link>
          <span>·</span>
          <span>Boss battle clears: {bossBattles.length}</span>
          <span>·</span>
          <span>Daily runs stored: {dailyChallenges.length}</span>
        </div>
      </div>
    </div>
  );
}
