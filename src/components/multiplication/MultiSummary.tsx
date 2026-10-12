import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MultiSessionSummary } from '../../types/multiplication';
import { audio } from '../../utils/audio';
import { Star, Flame, CheckCircle, Zap, RotateCcw, ArrowRight, Home } from 'lucide-react';

interface MultiSummaryProps {
  summary: MultiSessionSummary;
  onPlayAgain: () => void;
  onViewStats: () => void;
  onBackToHub: () => void;
}

export const MultiSummary: React.FC<MultiSummaryProps> = ({
  summary,
  onPlayAgain,
  onViewStats,
  onBackToHub,
}) => {
  const mistakes = summary.attempts.filter(a => !a.isCorrect);
  const avgSeconds = (summary.avgTimeMs / 1000).toFixed(1);

  useEffect(() => {
    if (summary.accuracy >= 70) {
      audio.playFanfare();
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 }
      });
    }
  }, [summary.accuracy]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-pop">
      {/* Title */}
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-black rounded-full uppercase tracking-wider mb-2">
          {summary.sessionMode === 'sprint' ? 'Fin del Sprint (60s)' : `Ronda de Multiplicación`}
        </span>
        <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
          {summary.accuracy >= 90 ? '¡Genio de las Tablas!' : summary.accuracy >= 70 ? '¡Muy Buen Trabajo!' : '¡Sigue Practicando!'}
        </h2>
        <p className="text-slate-600 font-semibold text-sm sm:text-base">
          {summary.accuracy >= 90
            ? '¡Dominas la multiplicación con una rapidez increíble!'
            : 'Cada práctica consolida las tablas en tu memoria a largo plazo.'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-orange-50 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
            <Star className="w-5 h-5 fill-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-orange-950">
            {summary.score}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Puntos
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-50 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950">
            {summary.accuracy}%
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Precisión
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-amber-50 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-950">
            {summary.highestStreak}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Racha Máx
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-purple-50 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-950">
            {avgSeconds}s
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Velocidad Med.
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onPlayAgain}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-all text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>¡Jugar Otra Ronda!</span>
        </button>

        <button
          onClick={onViewStats}
          className="flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-2xl border border-slate-200 shadow-sm transition-all text-sm"
        >
          <span>Ver Progreso de Tablas</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onBackToHub}
          className="flex items-center gap-2 px-4 py-3.5 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Menú Principal</span>
        </button>
      </div>

      {/* Review mistakes */}
      {mistakes.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 mb-3">
            Multiplicaciones a repasar ({mistakes.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {mistakes.map((attempt, idx) => (
              <div key={idx} className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 text-center">
                <div className="text-sm font-black text-slate-800">
                  {attempt.problem.factorA} × {attempt.problem.factorB} = <span className="text-emerald-600 underline font-extrabold">{attempt.problem.result}</span>
                </div>
                <div className="text-[11px] text-rose-600 font-semibold mt-0.5">
                  Tu respuesta: {attempt.userAnswer ?? '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
