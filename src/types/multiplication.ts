export type MultiQuestionMode = 'standard' | 'missing_factor' | 'sequential';
export type MultiSessionMode = 'block' | 'sprint';

export interface MultiProblem {
  id: string;
  factorA: number; // 1-12
  factorB: number; // 1-12
  result: number;  // factorA * factorB
  blankPosition: 'result' | 'factorA' | 'factorB';
  expectedAnswer: number;
  tableNumber: number; // The reference table
}

export interface MultiAttempt {
  problem: MultiProblem;
  userAnswer: number | null;
  isCorrect: boolean;
  timeTakenMs: number;
}

export interface MultiSessionSummary {
  id: string;
  timestamp: number;
  selectedTables: number[];
  questionMode: MultiQuestionMode;
  sessionMode: MultiSessionMode;
  totalProblems: number;
  correctCount: number;
  accuracy: number;
  score: number;
  highestStreak: number;
  avgTimeMs: number;
  attempts: MultiAttempt[];
}

export interface MultiSettings {
  selectedTables: number[]; // e.g. [7] or [6,7,8,9]
  questionMode: MultiQuestionMode;
  blockSize: number; // 10, 15, 20, 24
}

export interface MultiOverview {
  totalSessions: number;
  totalSolved: number;
  bestStreakAllTime: number;
  fastestAvgTimeMs: number;
  masteryByTable: Record<number, { total: number; correct: number; percent: number }>;
}
