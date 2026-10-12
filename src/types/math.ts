export type MathLevel = 1 | 2 | 3 | 4;
export type MathOpType = 'addition' | 'subtraction' | 'mixed';
export type MathGameMode = 'block' | 'sprint'; // block: 20 ops; sprint: 60s

export interface MathProblem {
  id: string;
  num1: number;
  operator: '+' | '-';
  num2: number;
  answer: number;
  hintCategory?: string; // e.g. "Amigos del 10", "Dobles", "Paso de decena"
}

export interface MathAttempt {
  problem: MathProblem;
  userAnswer: number | null;
  isCorrect: boolean;
  timeTakenMs: number;
}

export interface MathSessionSummary {
  id: string;
  timestamp: number;
  level: MathLevel;
  opType: MathOpType;
  mode: MathGameMode;
  totalProblems: number;
  correctCount: number;
  accuracy: number;
  score: number;
  highestStreak: number;
  avgTimePerProblemMs: number;
  attempts: MathAttempt[];
}

export interface MathSettings {
  level: MathLevel;
  opType: MathOpType;
  blockSize: number; // default 20
  instantAdvance: boolean; // instantly goes to next problem if correct
  showKeypad: boolean;
}

export interface MathStatsOverview {
  totalSessions: number;
  totalProblemsSolved: number;
  bestStreakAllTime: number;
  fastestAvgTimeMs: number;
  accuracyByLevel: Record<MathLevel, { total: number; correct: number }>;
}
