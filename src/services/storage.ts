import { RoundSessionSummary, VerbStats, UserSettings, Achievement } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'verb_hero_sessions',
  VERB_STATS: 'verb_hero_verb_stats',
  SETTINGS: 'verb_hero_settings',
  ACHIEVEMENTS: 'verb_hero_achievements',
};

export const DEFAULT_SETTINGS: UserSettings = {
  roundSize: 20,
  levelFilter: 'all',
  soundEnabled: true,
  voiceVolume: 1,
  autoSpeak: true,
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_round', title: '¡Primer Paso!', description: 'Completa tu primera ronda de verbos', icon: '🌱' },
  { id: 'streak_5', title: '¡En Racha!', description: 'Consigue una racha de 5 verbos seguidos sin fallar', icon: '🔥' },
  { id: 'streak_10', title: '¡Imparable!', description: 'Consigue una racha de 10 verbos perfectos', icon: '⚡' },
  { id: 'perfect_round', title: '¡Perfección Total!', description: 'Consigue el 100% en una ronda de al menos 10 verbos', icon: '🏆' },
  { id: 'verbs_50', title: 'Exploradora de Verbos', description: 'Has practicado más de 50 verbos', icon: '📚' },
  { id: 'verbs_100', title: 'Maestra de los Verbos', description: 'Has practicado más de 100 verbos', icon: '👑' },
  { id: 'master_weak', title: 'Superando Desafíos', description: 'Práctica una sesión completa de verbos difíciles', icon: '💪' },
];

export const storage = {
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  },

  getSessions(): RoundSessionSummary[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSession(session: RoundSessionSummary): void {
    try {
      const sessions = this.getSessions();
      sessions.unshift(session);
      // Keep up to 100 most recent sessions
      const trimmed = sessions.slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(trimmed));

      // Update verb stats
      const stats = this.getVerbStats();
      session.attempts.forEach(attempt => {
        const id = attempt.verbId;
        if (!stats[id]) {
          stats[id] = {
            verbId: id,
            timesSeen: 0,
            timesFlawless: 0,
            timesFailed: 0,
            lastPracticed: session.timestamp,
          };
        }
        stats[id].timesSeen += 1;
        stats[id].lastPracticed = session.timestamp;
        if (attempt.allCorrect) {
          stats[id].timesFlawless += 1;
        } else {
          stats[id].timesFailed += 1;
        }
      });
      localStorage.setItem(STORAGE_KEYS.VERB_STATS, JSON.stringify(stats));

      // Check achievements
      this.evaluateAchievements(session, trimmed, stats);
    } catch (e) {
      console.error('Error saving session', e);
    }
  },

  getVerbStats(): Record<string, VerbStats> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VERB_STATS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  getDifficultVerbIds(): string[] {
    const stats = this.getVerbStats();
    // Verbs that have at least 1 mistake, sorted by fail rate or failure count desc
    return Object.values(stats)
      .filter(s => s.timesFailed > 0)
      .sort((a, b) => b.timesFailed - a.timesFailed || (b.timesFailed / b.timesSeen) - (a.timesFailed / a.timesSeen))
      .map(s => s.verbId);
  },

  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      const unlockedMap: Record<string, number> = data ? JSON.parse(data) : {};
      return INITIAL_ACHIEVEMENTS.map(ach => ({
        ...ach,
        unlockedAt: unlockedMap[ach.id],
      }));
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  },

  evaluateAchievements(session: RoundSessionSummary, allSessions: RoundSessionSummary[], stats: Record<string, VerbStats>): Achievement[] {
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      const unlockedMap: Record<string, number> = existing ? JSON.parse(existing) : {};
      const newUnlocked: string[] = [];

      // 1. First round
      if (allSessions.length >= 1 && !unlockedMap['first_round']) {
        unlockedMap['first_round'] = Date.now();
        newUnlocked.push('first_round');
      }

      // 2. Streak 5
      if (session.highestStreak >= 5 && !unlockedMap['streak_5']) {
        unlockedMap['streak_5'] = Date.now();
        newUnlocked.push('streak_5');
      }

      // 3. Streak 10
      if (session.highestStreak >= 10 && !unlockedMap['streak_10']) {
        unlockedMap['streak_10'] = Date.now();
        newUnlocked.push('streak_10');
      }

      // 4. Perfect round
      if (session.accuracy === 100 && session.totalVerbs >= 10 && !unlockedMap['perfect_round']) {
        unlockedMap['perfect_round'] = Date.now();
        newUnlocked.push('perfect_round');
      }

      // 5. Verbs count
      const totalVerbsPracticed = Object.keys(stats).length;
      if (totalVerbsPracticed >= 50 && !unlockedMap['verbs_50']) {
        unlockedMap['verbs_50'] = Date.now();
        newUnlocked.push('verbs_50');
      }
      if (totalVerbsPracticed >= 100 && !unlockedMap['verbs_100']) {
        unlockedMap['verbs_100'] = Date.now();
        newUnlocked.push('verbs_100');
      }

      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(unlockedMap));
      return this.getAchievements();
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  },

  resetAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.VERB_STATS);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    } catch (e) {
      console.error(e);
    }
  }
};
