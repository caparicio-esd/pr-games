import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UnitSessionSummary } from '../../types/units';
import { audio } from '../../utils/audio';
import { Star, Flame, CheckCircle, Zap, RotateCcw, ArrowRight, Home } from 'lucide-react';

interface UnitsSummaryProps {
  summary: UnitSessionSummary;
  onPlayAgain: () => void;
  onViewStats: () => void;
  onBackToHub: () => void;
}

export const UnitsSummary: React.FC<UnitsSummaryProps> = ({
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
        <span className="inline-block px-3.5 py-1 bg-teal-50 text-teal-800 text-xs font-black rounded-full uppercase tracking-wider mb-2 border border-teal-200">
          {summary.sessionMode === 'sprint' ? 'Fin del Sprint (60s)' : `Ronda de Unidades (Nivel ${summary.level})`}
        </span>
        <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          {summary.accuracy >= 90
            ? '¡Genio de las Unidades!'
            : summary.accuracy >= 70
            ? '¡Gran Dominio!'
            : '¡Buen Entrenamiento!'}
        </h2>
        <p className="text-slate-600 font-semibold text-sm sm:text-base">
          {summary.accuracy >= 90
            ? '¡Mueves la coma y aplicas las escalas con una soltura fantástica!'
            : 'Cada práctica en la escalera métrica te dará más reflejos en clase.'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-teal-50 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
            <Star className="w-5 h-5 fill-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-950">
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

        <div className="bg-white p-4 rounded-3xl border border-cyan-50 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-950">
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
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-teal-200 active:scale-95 transition-all text-sm"
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
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-slate-800">
            Conversiones a repasar ({mistakes.length})
          </h3>
          <div className="space-y-2.5">
            {mistakes.map((attempt, idx) => (
              <div key={idx} className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-black text-slate-800">
                    <span>{attempt.problem.fromValue} {attempt.problem.fromUnit} = </span>
                    <span className="text-emerald-700 underline font-black">{attempt.problem.formattedExpected} {attempt.problem.toUnit}</span>
                  </div>
                  <div className="text-xs text-rose-700 font-semibold mt-0.5">
                    Tu respuesta: <span className="line-through">{attempt.userAnswer ?? '—'}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-white/80 px-3 py-1.5 rounded-xl border border-rose-200/50 max-w-sm">
                  💡 {attempt.problem.hintExplanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
