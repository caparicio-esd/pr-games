import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SquaresSessionSummary } from '../../types/squares';
import { audio } from '../../utils/audio';
import { Star, Flame, CheckCircle, Zap, RotateCcw, ArrowRight, Home } from 'lucide-react';

interface SquaresSummaryProps {
  summary: SquaresSessionSummary;
  onPlayAgain: () => void;
  onViewStats: () => void;
  onBackToHub: () => void;
}

export const SquaresSummary: React.FC<SquaresSummaryProps> = ({
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
        <span className="inline-block px-3.5 py-1 bg-purple-50 text-purple-700 text-xs font-black rounded-full uppercase tracking-wider mb-2 border border-purple-100">
          {summary.sessionMode === 'sprint' ? 'Fin del Sprint (60s)' : `Ronda de Cuadrados (${summary.level})`}
        </span>
        <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          {summary.accuracy >= 90
            ? '¡Genio de los Cuadrados!'
            : summary.accuracy >= 70
            ? '¡Excelente Trabajo!'
            : '¡Buen Intento!'}
        </h2>
        <p className="text-slate-600 font-semibold text-sm sm:text-base">
          {summary.accuracy >= 90
            ? '¡Dominas las potencias y raíces con una rapidez asombrosa!'
            : 'Con cada intento los números te resultarán cada vez más automáticos.'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-purple-50 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <Star className="w-5 h-5 fill-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-950">
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

        <div className="bg-white p-4 rounded-3xl border border-indigo-50 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-950">
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
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-lg shadow-purple-200 active:scale-95 transition-all text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>¡Jugar Otra Ronda!</span>
        </button>

        <button
          onClick={onViewStats}
          className="flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-2xl border border-slate-200 shadow-sm transition-all text-sm"
        >
          <span>Ver Mi Progreso</span>
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
            Cuadrados a repasar ({mistakes.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {mistakes.map((attempt, idx) => (
              <div key={idx} className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 text-center">
                <div className="text-sm font-black text-slate-800">
                  {attempt.problem.type === 'direct' ? (
                    <>
                      <span>{attempt.problem.base}² = </span>
                      <span className="text-emerald-600 underline font-extrabold">{attempt.problem.square}</span>
                    </>
                  ) : (
                    <>
                      <span>√{attempt.problem.square} = </span>
                      <span className="text-emerald-600 underline font-extrabold">{attempt.problem.base}</span>
                    </>
                  )}
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
