import React from 'react';
import { MathLevel, MathSettings, MathGameMode } from '../../types/math';
import { Play, Zap, Timer, ArrowLeft, BarChart3, Plus, Minus, Shuffle } from 'lucide-react';
import { mathStorage } from '../../services/mathStorage';

interface MathLobbyProps {
  settings: MathSettings;
  onUpdateSettings: (newSettings: MathSettings) => void;
  onStartGame: (mode: MathGameMode) => void;
  onOpenStats: () => void;
  onBackToHub: () => void;
}

export const MathLobby: React.FC<MathLobbyProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
  onOpenStats,
  onBackToHub,
}) => {
  const overview = mathStorage.getOverview();

  const levels: { level: MathLevel; title: string; subtitle: string; icon: string; color: string }[] = [
    {
      level: 1,
      title: 'Nivel 1: Iniciación (Hasta 20)',
      subtitle: 'Amigos del 10, dobles y operaciones básicas',
      icon: '🌱',
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
    },
    {
      level: 2,
      title: 'Nivel 2: Intermedio (Hasta 100)',
      subtitle: 'Decenas completas y números de dos cifras sin llevadas',
      icon: '⚡',
      color: 'border-blue-200 bg-blue-50/40 text-blue-900',
    },
    {
      level: 3,
      title: 'Nivel 3: Avanzado (Con Llevadas)',
      subtitle: 'Paso de decena, llevadas y números hasta 100',
      icon: '🔥',
      color: 'border-amber-200 bg-amber-50/40 text-amber-900',
    },
    {
      level: 4,
      title: 'Nivel 4: Experto (Hasta 1000)',
      subtitle: 'Centenas, cálculo multidígito y máxima agilidad',
      icon: '👑',
      color: 'border-purple-200 bg-purple-50/40 text-purple-900',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-pop">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Suite</span>
        </button>

        <button
          onClick={onOpenStats}
          className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-all"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Ver Estadísticas</span>
        </button>
      </div>

      {/* Hero Presentation */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            Entrena tus Automatismos
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3">
            MathSprint Jr.
          </h2>
          <p className="text-blue-100 font-semibold text-base sm:text-lg mb-6">
            Mejora tu rapidez y seguridad mental con sumas y restas automáticas. ¡Supera tu propia velocidad!
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartGame('block')}
              className="px-7 py-4 bg-white text-blue-700 hover:bg-yellow-300 hover:text-blue-950 font-black rounded-2xl shadow-lg transition-all text-base flex items-center gap-2.5 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Ronda de {settings.blockSize} operaciones</span>
            </button>

            <button
              onClick={() => onStartGame('sprint')}
              className="px-5 py-4 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-2xl shadow-lg transition-all text-sm flex items-center gap-2 active:scale-95"
            >
              <Timer className="w-4 h-4" />
              <span>Modo Sprint (60 seg)</span>
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-6 top-6 text-8xl opacity-15 select-none font-black pointer-events-none">
          ±
        </div>
      </div>

      {/* Quick KPI stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-blue-600">
            {overview.totalProblemsSolved}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Aciertos Totales
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-amber-500">
            🔥 {overview.bestStreakAllTime}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Racha Récord
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {overview.fastestAvgTimeMs > 0 ? `${(overview.fastestAvgTimeMs / 1000).toFixed(1)}s` : '—'}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Mejor Velocidad
          </div>
        </div>
      </div>

      {/* 1. Selector de Operaciones */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
          Tipo de Operación
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onUpdateSettings({ ...settings, opType: 'addition' })}
            className={`p-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-2 transition-all ${
              settings.opType === 'addition'
                ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-sm'
                : 'border-slate-100 text-slate-600 hover:border-slate-200'
            }`}
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Solo Sumas</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ ...settings, opType: 'subtraction' })}
            className={`p-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-2 transition-all ${
              settings.opType === 'subtraction'
                ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-sm'
                : 'border-slate-100 text-slate-600 hover:border-slate-200'
            }`}
          >
            <Minus className="w-4 h-4 text-rose-500" />
            <span>Solo Restas</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ ...settings, opType: 'mixed' })}
            className={`p-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-2 transition-all ${
              settings.opType === 'mixed'
                ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-sm'
                : 'border-slate-100 text-slate-600 hover:border-slate-200'
            }`}
          >
            <Shuffle className="w-4 h-4 text-purple-600" />
            <span>Mezcladas (➕ / ➖)</span>
          </button>
        </div>
      </div>

      {/* 2. Selector de Nivel de Dificultad */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
          Elige el Nivel de Complicación
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {levels.map(lvl => (
            <div
              key={lvl.level}
              onClick={() => onUpdateSettings({ ...settings, level: lvl.level })}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                settings.level === lvl.level
                  ? 'border-blue-600 shadow-md scale-[1.01]'
                  : 'border-slate-100 hover:border-slate-200'
              } ${lvl.color}`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{lvl.icon}</span>
                <h4 className="font-extrabold text-sm text-slate-800">{lvl.title}</h4>
              </div>
              <p className="text-xs text-slate-500 font-medium pl-9">
                {lvl.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Tamaño del Bloque */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-extrabold text-slate-800">Tamaño de la Ronda</h4>
          <p className="text-xs text-slate-400 font-medium">Número de operaciones por bloque</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          {[10, 20, 30].map(size => (
            <button
              key={size}
              onClick={() => onUpdateSettings({ ...settings, blockSize: size })}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                settings.blockSize === size
                  ? 'bg-white text-blue-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {size} ops
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
