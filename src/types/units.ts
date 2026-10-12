export type UnitMagnitude = 'length' | 'mass' | 'capacity' | 'area' | 'volume' | 'time';
export type UnitLevel = '1' | '2' | '3' | '4';
export type UnitSessionMode = 'block' | 'sprint';
export type UnitMagnitudeFilter = 'all' | UnitMagnitude;

export interface UnitProblem {
  id: string;
  magnitude: UnitMagnitude;
  fromValue: number;
  fromUnit: string;
  toUnit: string;
  expectedAnswer: number;
  formattedExpected: string;
  hintExplanation: string;
}

export interface UnitAttempt {
  problem: UnitProblem;
  userAnswer: string | null;
  isCorrect: boolean;
  timeTakenMs: number;
}

export interface UnitSessionSummary {
  id: string;
  timestamp: number;
  level: UnitLevel;
  filter: UnitMagnitudeFilter;
  sessionMode: UnitSessionMode;
  totalProblems: number;
  correctCount: number;
  accuracy: number;
  score: number;
  highestStreak: number;
  avgTimeMs: number;
  attempts: UnitAttempt[];
}

export interface UnitSettings {
  level: UnitLevel;
  filter: UnitMagnitudeFilter;
  blockSize: number; // 10, 15, 20
}

export interface UnitOverview {
  totalSessions: number;
  totalSolved: number;
  bestStreakAllTime: number;
  fastestAvgTimeMs: number;
  masteryByMagnitude: Record<UnitMagnitude, { total: number; correct: number; percent: number }>;
}
