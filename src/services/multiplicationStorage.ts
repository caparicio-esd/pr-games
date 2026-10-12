import { MultiSettings, MultiSessionSummary, MultiOverview } from '../types/multiplication';

const STORAGE_KEYS = {
  SESSIONS: 'multi_hero_sessions',
  SETTINGS: 'multi_hero_settings',
};

export const DEFAULT_MULTI_SETTINGS: MultiSettings = {
  selectedTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  questionMode: 'standard',
  blockSize: 20,
};

export const multiStorage = {
  getSettings(): MultiSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_MULTI_SETTINGS, ...JSON.parse(data) } : DEFAULT_MULTI_SETTINGS;
    } catch {
      return DEFAULT_MULTI_SETTINGS;
    }
  },

  saveSettings(settings: MultiSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },

  getSessions(): MultiSessionSummary[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSession(session: MultiSessionSummary): void {
    try {
      const sessions = this.getSessions();
      sessions.unshift(session);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions.slice(0, 100)));
    } catch (e) {
      console.error(e);
    }
  },

  getOverview(): MultiOverview {
    const sessions = this.getSessions();
    const totalSessions = sessions.length;
    let totalSolved = 0;
    let bestStreakAllTime = 0;
    let fastestAvgTimeMs = Infinity;

    const masteryByTable: MultiOverview['masteryByTable'] = {};
    for (let t = 1; t <= 12; t++) {
      masteryByTable[t] = { total: 0, correct: 0, percent: 0 };
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
        const t = att.problem.tableNumber;
        if (masteryByTable[t]) {
          masteryByTable[t].total += 1;
          if (att.isCorrect) {
            masteryByTable[t].correct += 1;
          }
        }
      });
    });

    for (let t = 1; t <= 12; t++) {
      const item = masteryByTable[t];
      item.percent = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    }

    return {
      totalSessions,
      totalSolved,
      bestStreakAllTime,
      fastestAvgTimeMs: fastestAvgTimeMs === Infinity ? 0 : fastestAvgTimeMs,
      masteryByTable,
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
