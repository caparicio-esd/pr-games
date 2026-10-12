import { SquaresSettings, SquaresSessionSummary, SquaresOverview } from '../types/squares';

const STORAGE_KEYS = {
  SESSIONS: 'squares_hero_sessions',
  SETTINGS: 'squares_hero_settings',
};

export const DEFAULT_SQUARES_SETTINGS: SquaresSettings = {
  level: '2-10',
  questionMode: 'mixed',
  blockSize: 15,
};

export const squaresStorage = {
  getSettings(): SquaresSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SQUARES_SETTINGS, ...JSON.parse(data) } : DEFAULT_SQUARES_SETTINGS;
    } catch {
      return DEFAULT_SQUARES_SETTINGS;
    }
  },

  saveSettings(settings: SquaresSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },

  getSessions(): SquaresSessionSummary[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSession(session: SquaresSessionSummary): void {
    try {
      const sessions = this.getSessions();
      sessions.unshift(session);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions.slice(0, 100)));
    } catch (e) {
      console.error(e);
    }
  },

  getOverview(): SquaresOverview {
    const sessions = this.getSessions();
    const totalSessions = sessions.length;
    let totalSolved = 0;
    let bestStreakAllTime = 0;
    let fastestAvgTimeMs = Infinity;

    const masteryByNumber: SquaresOverview['masteryByNumber'] = {};
    for (let n = 2; n <= 20; n++) {
      masteryByNumber[n] = { total: 0, correct: 0, percent: 0 };
    }

    sessions.forEach(s => {
      totalSolved += s.correctCount;
      if (s.highestStreak > bestStreakAllTime) {
        bestStreakAllTime = s.highestStreak;
      }
      if (s.avgTimeMs > 0 && s.avgTimeMs < fastestAvgTimeMs) {
        fastestAvgTimeMs = s.avgTimeMs;
      }

      s.attempts.forEach(att => {
        const base = att.problem.base;
        if (masteryByNumber[base]) {
          masteryByNumber[base].total += 1;
          if (att.isCorrect) {
            masteryByNumber[base].correct += 1;
          }
        }
      });
    });

    for (let n = 2; n <= 20; n++) {
      const item = masteryByNumber[n];
      item.percent = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    }

    return {
      totalSessions,
      totalSolved,
      bestStreakAllTime,
      fastestAvgTimeMs: fastestAvgTimeMs === Infinity ? 0 : fastestAvgTimeMs,
      masteryByNumber,
    };
  },

  resetAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (e) {
      console.error(e);
    }
  },
};
