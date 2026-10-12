import React from 'react';
import { RoundSessionSummary, VerbStats, Achievement, Verb } from '../types';
import { Award, Flame, CheckCircle, TrendingUp, AlertTriangle, Calendar, Star, Play, Sparkles } from 'lucide-react';

interface StatsViewProps {
  sessions: RoundSessionSummary[];
  verbStats: Record<string, VerbStats>;
  achievements: Achievement[];
  allVerbs: Verb[];
  onPracticeDifficult: (verbIds: string[]) => void;
  onStartNewRound: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  sessions,
  verbStats,
  achievements,
  allVerbs,
  onPracticeDifficult,
  onStartNewRound,
}) => {
  // Global computations
  const totalSessions = sessions.length;
  const totalPoints = sessions.reduce((sum, s) => sum + s.score, 0);
  const avgAccuracy = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions)
    : 0;
  const highestStreakAllTime = sessions.reduce((max, s) => Math.max(max, s.highestStreak), 0);

  // Verbs mastered: flawless >= 2 and fail == 0, or flawless >= 3
  const masteredCount = Object.values(verbStats).filter(
    s => (s.timesFlawless >= 2 && s.timesFailed === 0) || s.timesFlawless >= 3
  ).length;

  // Difficult verbs list
  const verbsMap = new Map(allVerbs.map(v => [v.id, v]));
  const difficultVerbs = Object.values(verbStats)
    .filter(s => s.timesFailed > 0)
    .sort((a, b) => b.timesFailed - a.timesFailed)
    .map(stat => ({
      stat,
      verb: verbsMap.get(stat.verbId),
    }))
    .filter(item => item.verb !== undefined) as { stat: VerbStats; verb: Verb }[];

  const difficultVerbIds = difficultVerbs.map(d => d.verb.id);

  // Recent 10 sessions
  const recentSessions = sessions.slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>Tu Progreso y Estadísticas</span>
            <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-400" />
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            Mira cómo mejoras día a día practicando tus verbos irregulares.
          </p>
        </div>

        <button
          onClick={onStartNewRound}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-2xl shadow-md shadow-indigo-100 text-sm active:scale-95 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Nueva Ronda</span>
        </button>
      </div>

      {/* Primary KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-3xl border border-indigo-50 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Partidas</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-800">{totalSessions}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Rondas completadas</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-50 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Puntos</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-3xl font-black text-indigo-600">{totalPoints}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Puntos acumulados</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-50 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Racha Récord</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-600">🔥 {highestStreakAllTime}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Mejor racha histórica</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-50 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Precisión</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{avgAccuracy}%</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Aciertos globales</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-50 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Dominados</span>
            <CheckCircle className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-purple-600">{masteredCount}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">De {allVerbs.length} verbos</div>
        </div>
      </div>

      {/* Difficult Verbs Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Verbos a Reforzar ({difficultVerbs.length})</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verbos en los que has tenido algún fallo. ¡Repásalos para dominarlos al 100%!
            </p>
          </div>

          {difficultVerbs.length > 0 && (
            <button
              onClick={() => onPracticeDifficult(difficultVerbIds)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-extrabold rounded-xl shadow-sm text-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>Entrenar estos verbos</span>
            </button>
          )}
        </div>

        {difficultVerbs.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-extrabold text-slate-700">¡No tienes verbos difíciles pendientes!</p>
            <p className="text-xs text-slate-400 mt-1">O aún no has jugado ninguna ronda o no has tenido ningún fallo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {difficultVerbs.slice(0, 9).map(({ stat, verb }) => (
              <div
                key={verb.id}
                className="p-3.5 bg-slate-50/80 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 rounded-2xl transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-slate-800 text-sm">{verb.spanish}</div>
                  <span className="text-[10px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                    {stat.timesFailed} fallo{stat.timesFailed > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-500 mt-1">
                  {verb.infinitive} • {verb.pastSimple} • {verb.pastParticiple}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wall of Trophies / Achievements */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-500" />
          <span>Muro de Medallas y Trofeos</span>
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-6">
          Desbloquea medallas especiales a medida que juegas y mejoras tu racha.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {achievements.map(ach => {
            const isUnlocked = Boolean(ach.unlockedAt);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-gradient-to-tr from-amber-50/60 to-yellow-50/40 border-amber-200/80 shadow-sm'
                    : 'bg-slate-50/40 border-slate-100 opacity-60'
                }`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  isUnlocked ? 'bg-amber-100/80 shadow-inner' : 'bg-slate-200/60 grayscale'
                }`}>
                  {ach.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-extrabold text-slate-800">{ach.title}</h4>
                    {isUnlocked && <span className="text-xs">✨</span>}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 leading-snug">
                    {ach.description}
                  </p>
                  {isUnlocked && ach.unlockedAt && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                      Desbloqueado {new Date(ach.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History of recent sessions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-500" />
          <span>Historial de Sesiones Recientes</span>
        </h3>

        {recentSessions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium text-sm">
            Aún no has jugado ninguna ronda. ¡Haz clic en "Nueva Ronda" para empezar!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
                  <th className="pb-3 pl-2">Fecha y Hora</th>
                  <th className="pb-3 text-center">Verbos</th>
                  <th className="pb-3 text-center">Puntos</th>
                  <th className="pb-3 text-center">Precisión</th>
                  <th className="pb-3 text-center">Racha Máx</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pl-2 font-medium text-slate-700">
                      {new Date(session.timestamp).toLocaleDateString()} {' '}
                      <span className="text-xs text-slate-400">
                        {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3.5 text-center font-bold text-slate-600">
                      {session.totalVerbs}
                    </td>
                    <td className="py-3.5 text-center font-black text-indigo-600">
                      {session.score}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black ${
                        session.accuracy >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : session.accuracy >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {session.accuracy}%
                      </span>
                    </td>
                    <td className="py-3.5 text-center font-bold text-amber-600">
                      🔥 {session.highestStreak}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
