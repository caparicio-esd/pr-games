export type VerbLevel = 'easy' | 'medium' | 'hard';

export interface Verb {
  id: string;
  spanish: string;
  infinitive: string;
  pastSimple: string;
  pastParticiple: string;
  infinitiveAlts?: string[];
  pastSimpleAlts?: string[];
  pastParticipleAlts?: string[];
  level: VerbLevel;
  example?: string;
  exampleEs?: string;
}

export interface VerbAttempt {
  verbId: string;
  verb: Verb;
  userInfinitive: string;
  userPastSimple: string;
  userPastParticiple: string;
  infinitiveCorrect: boolean;
  pastSimpleCorrect: boolean;
  pastParticipleCorrect: boolean;
  allCorrect: boolean;
  pointsEarned: number;
}

export interface RoundSessionSummary {
  id: string;
  timestamp: number;
  totalVerbs: number;
  score: number;
  maxScore: number;
  accuracy: number;
  perfectVerbsCount: number;
  highestStreak: number;
  attempts: VerbAttempt[];
}

export interface VerbStats {
  verbId: string;
  timesSeen: number;
  timesFlawless: number;
  timesFailed: number;
  lastPracticed: number;
}

export interface UserSettings {
  roundSize: number; // 10, 15, 20, 30, or all (0)
  levelFilter: 'all' | VerbLevel;
  soundEnabled: boolean;
  voiceVolume: number;
  autoSpeak: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}
