import React from 'react';
import { unitsStorage } from '../../services/unitsStorage';
import { ArrowLeft, Play, Sparkles, Calendar } from 'lucide-react';
import { UnitMagnitude } from '../../types/units';

interface UnitsStatsViewProps {
  onBackToLobby: () => void;
  onStartGame: () => void;
}

export const UnitsStatsView: React.FC<UnitsStatsViewProps> = ({
  onBackToLobby,
  onStartGame,
}) => {
  const overview = unitsStorage.getOverview();
  const sessions = unitsStorage.getSessions();

  const magnitudeMeta: Record<UnitMagnitude, { name: string; icon: string; color: string }> = {
    length: { name: 'Longitud (m)', icon: '📏', color: 'bg-blue-600' },
    mass: { name: 'Masa (g, kg, t)', icon: '⚖️', color: 'bg-amber-600' },
    capacity: { name: 'Capacidad (l)', icon: '🥤', color: 'bg-cyan-600' },
    area: { name: 'Superficie (m²)', icon: '🟩', color: 'bg-emerald-600' },
    volume: { name: 'Volumen (m³)', icon: '🧊', color: 'bg-indigo-600' },
    time: { name: 'Tiempo (s, min, h)', icon: '⏱️', color: 'bg-orange-600' },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-pop">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToLobby}
          className="flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Unidades</span>
        </button>

        <button
          onClick={onStartGame}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-xl shadow-sm text-xs active:scale-95 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Nueva Ronda</span>
        </button>
      </div>

      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span>Dominio de Conversión de Unidades</span>
          <Sparkles className="w-6 h-6 text-teal-500 fill-teal-400" />
        </h2>
        <p className="text-slate-500 font-medium text-sm">
          Comprueba tu nivel de retención y agilidad por cada tipo de magnitud.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-teal-600">
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
          <div className="text-2xl sm:text-3xl font-black text-cyan-600">
            {overview.fastestAvgTimeMs > 0 ? `${(overview.fastestAvgTimeMs / 1000).toFixed(1)}s` : '—'}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Mejor Velocidad
          </div>
        </div>
      </div>

      {/* Magnitudes Mastery Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">
          Nivel de Dominio por Magnitud
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(Object.keys(magnitudeMeta) as UnitMagnitude[]).map(mag => {
            const meta = magnitudeMeta[mag];
            const data = overview.masteryByMagnitude[mag] || { total: 0, correct: 0, percent: 0 };
            const pct = data.percent;
            const isMastered = pct >= 85 && data.total >= 5;

            return (
              <div
                key={mag}
                className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{meta.icon}</span>
                    <span className="font-black text-sm text-slate-800">{meta.name}</span>
                  </div>
                  <span className="text-xs">
                    {isMastered ? '👑' : pct >= 70 ? '⭐' : '🌱'}
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct >= 85
                        ? meta.color
                        : pct >= 60
                        ? 'bg-amber-500'
                        : pct > 0
                        ? 'bg-teal-400'
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
          <span>Últimas Sesiones de Conversión</span>
        </h3>

        {sessions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm font-medium">
            Aún no has jugado ninguna ronda de conversión de unidades.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
                  <th className="pb-3 pl-2">Fecha</th>
                  <th className="pb-3 text-center">Nivel</th>
                  <th className="pb-3 text-center">Filtro</th>
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
                      Nivel {s.level}
                    </td>
                    <td className="py-3 text-center font-bold text-slate-600 text-xs">
                      {s.filter === 'all' ? 'Todas' : s.filter}
                    </td>
                    <td className="py-3 text-center font-extrabold text-slate-800 text-xs">
                      {s.correctCount}/{s.totalProblems}
                    </td>
                    <td className="py-3 text-center text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-black ${
                        s.accuracy >= 80 ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
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
