import { MathSessionSummary, MathSettings, MathStatsOverview } from '../types/math';

const MATH_STORAGE_KEYS = {
  SESSIONS: 'math_hero_sessions',
  SETTINGS: 'math_hero_settings',
};

export const DEFAULT_MATH_SETTINGS: MathSettings = {
  level: 1,
  opType: 'mixed',
  blockSize: 20,
  instantAdvance: true,
  showKeypad: false,
};

export const mathStorage = {
  getSettings(): MathSettings {
    try {
      const data = localStorage.getItem(MATH_STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_MATH_SETTINGS, ...JSON.parse(data) } : DEFAULT_MATH_SETTINGS;
    } catch {
      return DEFAULT_MATH_SETTINGS;
    }
  },

  saveSettings(settings: MathSettings): void {
    try {
      localStorage.setItem(MATH_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },

  getSessions(): MathSessionSummary[] {
    try {
      const data = localStorage.getItem(MATH_STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSession(session: MathSessionSummary): void {
    try {
      const sessions = this.getSessions();
      sessions.unshift(session);
      // Keep up to 100 recent sessions
      localStorage.setItem(MATH_STORAGE_KEYS.SESSIONS, JSON.stringify(sessions.slice(0, 100)));
    } catch (e) {
      console.error(e);
    }
  },

  getOverview(): MathStatsOverview {
    const sessions = this.getSessions();
    const totalSessions = sessions.length;
    let totalProblemsSolved = 0;
    let bestStreakAllTime = 0;
    let fastestAvgTimeMs = Infinity;

    const accuracyByLevel: MathStatsOverview['accuracyByLevel'] = {
      1: { total: 0, correct: 0 },
      2: { total: 0, correct: 0 },
      3: { total: 0, correct: 0 },
      4: { total: 0, correct: 0 },
    };

    sessions.forEach(s => {
      totalProblemsSolved += s.correctCount;
      if (s.highestStreak > bestStreakAllTime) {
        bestStreakAllTime = s.highestStreak;
      }
      if (s.avgTimePerProblemMs > 0 && s.avgTimePerProblemMs < fastestAvgTimeMs) {
        fastestAvgTimeMs = s.avgTimePerProblemMs;
      }
      if (accuracyByLevel[s.level]) {
        accuracyByLevel[s.level].total += s.totalProblems;
        accuracyByLevel[s.level].correct += s.correctCount;
      }
    });

    return {
      totalSessions,
      totalProblemsSolved,
      bestStreakAllTime,
      fastestAvgTimeMs: fastestAvgTimeMs === Infinity ? 0 : fastestAvgTimeMs,
      accuracyByLevel,
    };
  },

  resetAll(): void {
    try {
      localStorage.removeItem(MATH_STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(MATH_STORAGE_KEYS.SETTINGS);
    } catch (e) {
      console.error(e);
    }
  },
};
