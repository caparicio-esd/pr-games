import React from 'react';
import { Sparkles, ArrowRight, Zap, Trophy, Flame } from 'lucide-react';
import { storage } from '../services/storage';
import { mathStorage } from '../services/mathStorage';

interface SuiteHubProps {
  onSelectGame: (game: 'verbs' | 'math') => void;
}

export const SuiteHub: React.FC<SuiteHubProps> = ({ onSelectGame }) => {
  const verbSessions = storage.getSessions();
  const verbStats = storage.getVerbStats();
  const mathOverview = mathStorage.getOverview();

  const verbsMastered = Object.values(verbStats).filter(
    s => (s.timesFlawless >= 2 && s.timesFailed === 0) || s.timesFlawless >= 3
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 animate-pop">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm text-xs font-black text-indigo-700 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          Suite Educativa Infantil
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-800">
          ¿A qué jugamos hoy?
        </h1>
        <p className="text-slate-500 font-semibold text-base sm:text-lg max-w-xl mx-auto">
          Elige una aventura para entrenar tu cerebro, mejorar tus automatismos y conseguir nuevas medallas.
        </p>
      </div>

      {/* Game Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GAME 1: VerbMaster Jr. */}
        <div
          onClick={() => onSelectGame('verbs')}
          className="group relative bg-white rounded-3xl p-7 border-2 border-slate-100 hover:border-indigo-400 shadow-xl shadow-slate-100 hover:shadow-indigo-100/70 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          {/* Card header banner */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              🇬🇧
            </div>
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
              Inglés
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
              VerbMaster Jr.
            </h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
              Repasa los verbos irregulares con sus 3 formas (*Presente*, *Pasado* y *Participio*). Con pronunciación nativa y bloques de 20.
            </p>

            {/* Quick stats tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-600">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                {verbsMastered} verbos dominados
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-600">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                {verbSessions.length} rondas jugadas
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
              Jugar a los verbos
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 group-hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* GAME 2: MathSprint Jr. */}
        <div
          onClick={() => onSelectGame('math')}
          className="group relative bg-white rounded-3xl p-7 border-2 border-slate-100 hover:border-blue-400 shadow-xl shadow-slate-100 hover:shadow-blue-100/70 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          {/* Card header banner */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-3xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              🔢
            </div>
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
              Matemáticas
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
              MathSprint Jr.
            </h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
              Cálculo mental rápido de sumas y restas con 4 niveles de dificultad para ganar velocidad y fijar automatismos.
            </p>

            {/* Quick stats tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-600">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Racha máx: {mathOverview.bestStreakAllTime}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-600">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                {mathOverview.totalProblemsSolved} operaciones acertadas
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              Entrenar cálculo
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-600 group-hover:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-200 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
