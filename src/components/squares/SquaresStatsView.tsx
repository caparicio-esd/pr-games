import React from 'react';
import { squaresStorage } from '../../services/squaresStorage';
import { ArrowLeft, Play, Sparkles, Calendar } from 'lucide-react';

interface SquaresStatsViewProps {
  onBackToLobby: () => void;
  onStartGame: () => void;
}

export const SquaresStatsView: React.FC<SquaresStatsViewProps> = ({
  onBackToLobby,
  onStartGame,
}) => {
  const overview = squaresStorage.getOverview();
  const sessions = squaresStorage.getSessions();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-pop">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToLobby}
          className="flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Cuadrados</span>
        </button>

        <button
          onClick={onStartGame}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl shadow-sm text-xs active:scale-95 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Nueva Ronda</span>
        </button>
      </div>

      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span>Dominio de Cuadrados (2² al 20²)</span>
          <Sparkles className="w-6 h-6 text-purple-500 fill-purple-400" />
        </h2>
        <p className="text-slate-500 font-medium text-sm">
          Comprueba tu nivel de retención y rapidez con las potencias y raíces de cada número.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-purple-600">
            {overview.totalSessions}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Partidas
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {overview.totalSolved}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Aciertos
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-amber-500">
            🔥 {overview.bestStreakAllTime}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Racha Récord
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-indigo-600">
            {overview.fastestAvgTimeMs > 0 ? `${(overview.fastestAvgTimeMs / 1000).toFixed(1)}s` : '—'}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Mejor Velocidad
          </div>
        </div>
      </div>

      {/* 2 to 20 Mastery Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">
          Nivel de Dominio por Número (2 al 20)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 19 }, (_, i) => i + 2).map(num => {
            const data = overview.masteryByNumber[num] || { total: 0, correct: 0, percent: 0 };
            const pct = data.percent;
            const square = num * num;
            const isMastered = pct >= 85 && data.total >= 5;

            return (
              <div
                key={num}
                className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-base text-slate-800">
                      {num}² = {square}
                    </span>
                  </div>
                  <span className="text-xs">
                    {isMastered ? '👑' : pct >= 70 ? '⭐' : '🌱'}
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct >= 85
                        ? 'bg-purple-600'
                        : pct >= 60
                        ? 'bg-indigo-500'
                        : pct > 0
                        ? 'bg-amber-400'
                        : 'bg-slate-300'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>{pct}% dominado</span>
                  <span className="text-[10px] text-slate-400">({data.correct}/{data.total})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent history */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Últimas Sesiones de Cuadrados</span>
        </h3>

        {sessions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm font-medium">
            Aún no has jugado ninguna ronda de cuadrados perfectos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
                  <th className="pb-3 pl-2">Fecha</th>
                  <th className="pb-3 text-center">Nivel</th>
                  <th className="pb-3 text-center">Modo</th>
                  <th className="pb-3 text-center">Aciertos</th>
                  <th className="pb-3 text-center">Precisión</th>
                  <th className="pb-3 text-center">Racha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.slice(0, 10).map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-3 pl-2 text-slate-600 font-medium text-xs">
                      {new Date(s.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-center font-bold text-slate-700 text-xs">
                      {s.level}
                    </td>
                    <td className="py-3 text-center font-bold text-slate-600 text-xs">
                      {s.questionMode === 'direct' ? 'Directo' : s.questionMode === 'inverse' ? 'Raíz' : 'Mixto'}
                    </td>
                    <td className="py-3 text-center font-extrabold text-slate-800 text-xs">
                      {s.correctCount}/{s.totalProblems}
                    </td>
                    <td className="py-3 text-center text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-black ${
                        s.accuracy >= 80 ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 text-center font-bold text-amber-600 text-xs">
                      🔥 {s.highestStreak}
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
