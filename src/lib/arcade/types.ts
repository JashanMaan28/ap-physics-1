export interface ArcadeQuestion {
  id: string;
  unitSlug: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
  tag: string;
}

export interface BossBattle {
  unitSlug: string;
  title: string;
  flavor: string;
  reward: string;
  questions: ArcadeQuestion[];
}

export interface FormulaSprintQuestion {
  id: string;
  unitSlug: string;
  prompt: string;
  choices: string[];
  answer: number;
  formula: string;
  hint: string;
}

export interface ExamDraftStep {
  unitSlug: string;
  unitName: string;
  minutes: number;
  focus: string;
  reason: string;
}
