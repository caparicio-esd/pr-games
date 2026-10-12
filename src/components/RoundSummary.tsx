import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RoundSessionSummary, VerbAttempt } from '../types';
import { audio } from '../utils/audio';
import { Trophy, Flame, Star, CheckCircle, RotateCcw, AlertTriangle, ArrowRight, Volume2, Sparkles } from 'lucide-react';

interface RoundSummaryProps {
  summary: RoundSessionSummary;
  onPlayAgain: () => void;
  onPracticeMistakes: (mistakeAttempts: VerbAttempt[]) => void;
  onViewStats: () => void;
}

export const RoundSummary: React.FC<RoundSummaryProps> = ({
  summary,
  onPlayAgain,
  onPracticeMistakes,
  onViewStats,
}) => {
  const mistakes = summary.attempts.filter(a => !a.allCorrect);

  useEffect(() => {
    if (summary.accuracy >= 65) {
      audio.playFanfare();
      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Extra burst if accuracy is 100%
      if (summary.accuracy === 100) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 400);
      }
    }
  }, [summary.accuracy]);

  const getPraiseMessage = () => {
    if (summary.accuracy === 100) {
      return {
        title: '¡Puntuación Perfecta!',
        subtitle: '¡Eres una superheroína de los verbos en inglés! 🌟',
        color: 'from-amber-400 to-yellow-500',
        badge: '👑 MATRÍCULA DE HONOR'
      };
    }
    if (summary.accuracy >= 85) {
      return {
        title: '¡Espectacular Trabajo!',
        subtitle: '¡Casi perfecto! Tienes un nivel increíble. 🚀',
        color: 'from-emerald-400 to-teal-500',
        badge: '🎉 SOBRESALIENTE'
      };
    }
    if (summary.accuracy >= 70) {
      return {
        title: '¡Muy Bien Hecho!',
        subtitle: '¡Estás dominando la mayoría de los verbos! Sigue así. 👏',
        color: 'from-indigo-400 to-purple-500',
        badge: '⭐ NOTABLE'
      };
    }
    return {
      title: '¡Buen Intento!',
      subtitle: 'La práctica hace al maestro. Repasa tus fallos y lo conseguirás. 💪',
      color: 'from-blue-400 to-indigo-500',
      badge: '🌱 EN PROGRESO'
    };
  };

  const praise = getPraiseMessage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {praise.badge}
        </div>
        <h2 className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${praise.color} bg-clip-text text-transparent mb-2`}>
          {praise.title}
        </h2>
        <p className="text-slate-600 font-semibold text-base sm:text-lg">
          {praise.subtitle}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="bg-white p-4 rounded-3xl border border-indigo-50 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
            <Star className="w-5 h-5 fill-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-950">
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
            Mejor Racha
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-purple-50 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-950">
            {summary.perfectVerbsCount} <span className="text-sm text-slate-400 font-semibold">/ {summary.totalVerbs}</span>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Perfectos
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <button
          onClick={onPlayAgain}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>¡Jugar Otra Ronda!</span>
        </button>

        {mistakes.length > 0 && (
          <button
            onClick={() => onPracticeMistakes(mistakes)}
            className="flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-extrabold rounded-2xl shadow-lg shadow-amber-200 active:scale-95 transition-all text-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Repasar {mistakes.length} Fallo{mistakes.length > 1 ? 's' : ''}</span>
          </button>
        )}

        <button
          onClick={onViewStats}
          className="flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-2xl border border-slate-200 shadow-sm transition-all text-sm"
        >
          <span>Ver Mis Estadísticas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Breakdown list of this session */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center justify-between">
          <span>Resumen de la ronda</span>
          <span className="text-xs font-bold text-slate-400">{summary.attempts.length} verbos</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {summary.attempts.map((attempt, index) => {
            const v = attempt.verb;
            return (
              <div key={index} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    attempt.allCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {attempt.allCorrect ? '✓' : '✗'}
                  </span>
                  <div>
                    <div className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                      <span>{v.spanish}</span>
                      <button
                        onClick={() => audio.speakVerb(v.infinitive, v.pastSimple, v.pastParticiple)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                        title="Escuchar"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {!attempt.allCorrect && (
                      <div className="text-xs text-slate-400 font-medium">
                        Tu respuesta: {attempt.userInfinitive || '—'} / {attempt.userPastSimple || '—'} / {attempt.userPastParticiple || '—'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs font-bold sm:text-right">
                  <span className={`px-2 py-1 rounded-lg ${attempt.infinitiveCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700 font-black'}`}>
                    {v.infinitive}
                  </span>
                  <span className="text-slate-300">/</span>
                  <span className={`px-2 py-1 rounded-lg ${attempt.pastSimpleCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700 font-black'}`}>
                    {v.pastSimple}
                  </span>
                  <span className="text-slate-300">/</span>
                  <span className={`px-2 py-1 rounded-lg ${attempt.pastParticipleCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700 font-black'}`}>
                    {v.pastParticiple}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
