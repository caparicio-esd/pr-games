export type SquaresLevel = '2-5' | '2-10' | '2-15' | '2-20';
export type SquaresQuestionMode = 'direct' | 'inverse' | 'mixed';
export type SquaresSessionMode = 'block' | 'sprint';

export interface SquaresProblem {
  id: string;
  base: number;      // e.g. 7
  square: number;    // e.g. 49
  type: 'direct' | 'inverse'; // direct: 7² = ?, inverse: √49 = ?
  expectedAnswer: number;
}

export interface SquaresAttempt {
  problem: SquaresProblem;
  userAnswer: number | null;
  isCorrect: boolean;
  timeTakenMs: number;
}

export interface SquaresSessionSummary {
  id: string;
  timestamp: number;
  level: SquaresLevel;
  questionMode: SquaresQuestionMode;
  sessionMode: SquaresSessionMode;
  totalProblems: number;
  correctCount: number;
  accuracy: number;
  score: number;
  highestStreak: number;
  avgTimeMs: number;
  attempts: SquaresAttempt[];
}

export interface SquaresSettings {
  level: SquaresLevel;
  questionMode: SquaresQuestionMode;
  blockSize: number; // 10, 15, 20
}

export interface SquaresOverview {
  totalSessions: number;
  totalSolved: number;
  bestStreakAllTime: number;
  fastestAvgTimeMs: number;
  masteryByNumber: Record<number, { total: number; correct: number; percent: number }>;
}
