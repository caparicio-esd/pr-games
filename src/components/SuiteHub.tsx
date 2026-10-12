import React from 'react';
import { Sparkles, ArrowRight, Zap, Trophy, Flame } from 'lucide-react';
import { storage } from '../services/storage';
import { mathStorage } from '../services/mathStorage';
import { multiStorage } from '../services/multiplicationStorage';
import { squaresStorage } from '../services/squaresStorage';

interface SuiteHubProps {
  onSelectGame: (game: 'verbs' | 'math' | 'multi' | 'squares') => void;
}

export const SuiteHub: React.FC<SuiteHubProps> = ({ onSelectGame }) => {
  const verbSessions = storage.getSessions();
  const verbStats = storage.getVerbStats();
  const mathOverview = mathStorage.getOverview();
  const multiOverview = multiStorage.getOverview();
  const squaresOverview = squaresStorage.getOverview();

  const verbsMastered = Object.values(verbStats).filter(
    s => (s.timesFlawless >= 2 && s.timesFailed === 0) || s.timesFlawless >= 3
  ).length;

  // Tables mastered (percent >= 85 and total >= 5)
  const tablesMasteredCount = Object.values(multiOverview.masteryByTable).filter(
    t => t.percent >= 85 && t.total >= 5
  ).length;

  // Squares mastered (percent >= 85 and total >= 5)
  const squaresMasteredCount = Object.values(squaresOverview.masteryByNumber).filter(
    s => s.percent >= 85 && s.total >= 5
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 animate-pop">
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

      {/* Game Selection Cards Grid (4 Games) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* GAME 1: VerbMaster Jr. */}
        <div
          onClick={() => onSelectGame('verbs')}
          className="group relative bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-100 hover:border-indigo-400 shadow-xl shadow-slate-100 hover:shadow-indigo-100/70 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                🇬🇧
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                Inglés
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
              VerbMaster Jr.
            </h2>
            <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed mb-5">
              Repasa los verbos irregulares con sus 3 formas (*Presente*, *Pasado* y *Participio*). Con voz nativa y bloques de 20.
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mb-5">
              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600">
                <Trophy className="w-3 h-3 text-amber-500" />
                {verbsMastered} dominados
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                {verbSessions.length} rondas
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
              Jugar a los verbos
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* GAME 2: MathSprint Jr. */}
        <div
          onClick={() => onSelectGame('math')}
          className="group relative bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-100 hover:border-blue-400 shadow-xl shadow-slate-100 hover:shadow-blue-100/70 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-3xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                🔢
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                Sumas y Restas
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
              MathSprint Jr.
            </h2>
            <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed mb-5">
              Cálculo mental rápido de sumas y restas con 4 niveles de dificultad para ganar velocidad y fijar automatismos.
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mb-5">
              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600">
                <Flame className="w-3 h-3 text-amber-500" />
                Racha: {mathOverview.bestStreakAllTime}
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600">
                <Zap className="w-3 h-3 text-blue-500" />
                {mathOverview.totalProblemsSolved} aciertos
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              Entrenar cálculo
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-200 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* GAME 3: MultiTablas Jr. */}
        <div
          onClick={() => onSelectGame('multi')}
          className="group relative bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-100 hover:border-orange-400 shadow-xl shadow-slate-100 hover:shadow-orange-100/70 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                ✖️
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-100">
                Multiplicación
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">
              MultiTablas Jr.
            </h2>
            <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed mb-5">
              Aprende y domina las tablas del 1 al 12 en orden, aleatorias o con el "Factor Misterioso". Incluye tabla pitagórica.
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mb-5">
              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600">
                <Trophy className="w-3 h-3 text-amber-500" />
                {tablesMasteredCount} de 12 dominadas
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600">
                <Flame className="w-3 h-3 text-orange-500" />
                Racha: {multiOverview.bestStreakAllTime}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-orange-600">
              Jugar a las tablas
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-600 group-hover:bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-200 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* GAME 4: CuadradosPlay Jr. */}
        <div
          onClick={() => onSelectGame('squares')}
          className="group relative bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-100 hover:border-purple-400 shadow-xl shadow-slate-100 hover:shadow-purple-100/70 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 flex items-center justify-center text-3xl shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                📐
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                Potencias y Raíces
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
              CuadradosPlay Jr.
            </h2>
            <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed mb-5">
              Aprende los cuadrados perfectos del 2 al 20 (del 4 al 400). Modos directo, raíz cuadrada e inverso por dificultad.
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mb-5">
              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600">
                <Trophy className="w-3 h-3 text-amber-500" />
                {squaresMasteredCount} de 19 dominados
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600">
                <Flame className="w-3 h-3 text-purple-500" />
                Racha: {squaresOverview.bestStreakAllTime}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-purple-600">
              Jugar a los cuadrados
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-600 group-hover:bg-purple-500 text-white flex items-center justify-center shadow-md shadow-purple-200 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

