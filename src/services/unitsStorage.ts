import { UnitSettings, UnitSessionSummary, UnitOverview, UnitMagnitude } from '../types/units';

const STORAGE_KEYS = {
  SESSIONS: 'units_hero_sessions',
  SETTINGS: 'units_hero_settings',
};

export const DEFAULT_UNIT_SETTINGS: UnitSettings = {
  level: '1',
  filter: 'all',
  blockSize: 15,
};

const MAGNITUDES: UnitMagnitude[] = ['length', 'mass', 'capacity', 'area', 'volume', 'time'];

export const unitsStorage = {
  getSettings(): UnitSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_UNIT_SETTINGS, ...JSON.parse(data) } : DEFAULT_UNIT_SETTINGS;
    } catch {
      return DEFAULT_UNIT_SETTINGS;
    }
  },

  saveSettings(settings: UnitSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },

  getSessions(): UnitSessionSummary[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSession(session: UnitSessionSummary): void {
    try {
      const sessions = this.getSessions();
      sessions.unshift(session);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions.slice(0, 100)));
    } catch (e) {
      console.error(e);
    }
  },

  getOverview(): UnitOverview {
    const sessions = this.getSessions();
    const totalSessions = sessions.length;
    let totalSolved = 0;
    let bestStreakAllTime = 0;
    let fastestAvgTimeMs = Infinity;

    const masteryByMagnitude: UnitOverview['masteryByMagnitude'] = {
      length: { total: 0, correct: 0, percent: 0 },
      mass: { total: 0, correct: 0, percent: 0 },
      capacity: { total: 0, correct: 0, percent: 0 },
      area: { total: 0, correct: 0, percent: 0 },
      volume: { total: 0, correct: 0, percent: 0 },
      time: { total: 0, correct: 0, percent: 0 },
    };

    sessions.forEach(s => {
      totalSolved += s.correctCount;
      if (s.highestStreak > bestStreakAllTime) {
        bestStreakAllTime = s.highestStreak;
      }
      if (s.avgTimeMs > 0 && s.avgTimeMs < fastestAvgTimeMs) {
        fastestAvgTimeMs = s.avgTimeMs;
      }

      s.attempts.forEach(att => {
        const mag = att.problem.magnitude;
        if (masteryByMagnitude[mag]) {
          masteryByMagnitude[mag].total += 1;
          if (att.isCorrect) {
            masteryByMagnitude[mag].correct += 1;
          }
        }
      });
    });

    MAGNITUDES.forEach(mag => {
      const item = masteryByMagnitude[mag];
      item.percent = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    });

    return {
      totalSessions,
      totalSolved,
      bestStreakAllTime,
      fastestAvgTimeMs: fastestAvgTimeMs === Infinity ? 0 : fastestAvgTimeMs,
      masteryByMagnitude,
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
