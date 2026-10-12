import React from 'react';
import { mathStorage } from '../../services/mathStorage';
import { ArrowLeft, Play, Zap, Calendar } from 'lucide-react';

interface MathStatsViewProps {
  onBackToLobby: () => void;
  onStartGame: () => void;
}

export const MathStatsView: React.FC<MathStatsViewProps> = ({
  onBackToLobby,
  onStartGame,
}) => {
  const overview = mathStorage.getOverview();
  const sessions = mathStorage.getSessions();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-pop">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToLobby}
          className="flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a MathSprint</span>
        </button>

        <button
          onClick={onStartGame}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-sm text-xs active:scale-95 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Nueva Ronda</span>
        </button>
      </div>

      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span>Tus Récords en Matemáticas</span>
          <Zap className="w-6 h-6 text-yellow-500 fill-yellow-400" />
        </h2>
        <p className="text-slate-500 font-medium text-sm">
          Seguimiento de agilidad y precisión en sumas y restas.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-blue-600">
            {overview.totalSessions}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Partidas
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {overview.totalProblemsSolved}
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
          <div className="text-2xl sm:text-3xl font-black text-purple-600">
            {overview.fastestAvgTimeMs > 0 ? `${(overview.fastestAvgTimeMs / 1000).toFixed(1)}s` : '—'}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Mejor Velocidad
          </div>
        </div>
      </div>

      {/* Accuracy by level */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">
          Dominio por Nivel
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(lvl => {
            const data = overview.accuracyByLevel[lvl as 1 | 2 | 3 | 4];
            const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
            return (
              <div key={lvl} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
                <div className="text-xs font-extrabold text-slate-500 mb-1">Nivel {lvl}</div>
                <div className="text-xl font-black text-slate-800">{pct}%</div>
                <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                  {data.correct} / {data.total} aciertos
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Últimas Sesiones</span>
        </h3>

        {sessions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm font-medium">
            Aún no has jugado ninguna ronda de matemáticas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
                  <th className="pb-3 pl-2">Fecha</th>
                  <th className="pb-3 text-center">Nivel</th>
                  <th className="pb-3 text-center">Aciertos</th>
                  <th className="pb-3 text-center">Precisión</th>
                  <th className="pb-3 text-center">Velocidad</th>
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
                      {s.mode === 'sprint' ? 'Sprint' : `Lvl ${s.level}`}
                    </td>
                    <td className="py-3 text-center font-extrabold text-slate-800 text-xs">
                      {s.correctCount}/{s.totalProblems}
                    </td>
                    <td className="py-3 text-center text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-black ${
                        s.accuracy >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 text-center font-bold text-blue-600 text-xs">
                      {(s.avgTimePerProblemMs / 1000).toFixed(1)}s
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
