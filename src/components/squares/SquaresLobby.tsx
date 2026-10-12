import React, { useState } from 'react';
import { SquaresLevel, SquaresSettings, SquaresSessionMode } from '../../types/squares';
import { squaresStorage } from '../../services/squaresStorage';
import { Play, Timer, ArrowLeft, BarChart3, BookOpen, Sparkles } from 'lucide-react';
import { SquaresReferenceModal } from './SquaresReferenceModal';

interface SquaresLobbyProps {
  settings: SquaresSettings;
  onUpdateSettings: (newSettings: SquaresSettings) => void;
  onStartGame: (sessionMode: SquaresSessionMode) => void;
  onOpenStats: () => void;
  onBackToHub: () => void;
}

export const SquaresLobby: React.FC<SquaresLobbyProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
  onOpenStats,
  onBackToHub,
}) => {
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const overview = squaresStorage.getOverview();

  const levels: { id: SquaresLevel; title: string; subtitle: string; icon: string; color: string }[] = [
    {
      id: '2-5',
      title: 'Nivel 1: Del 2 al 5',
      subtitle: '2², 3², 4², 5² (hasta 25)',
      icon: '🌱',
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-950',
    },
    {
      id: '2-10',
      title: 'Nivel 2: Del 2 al 10',
      subtitle: 'Hasta 10² = 100 (muy frecuente en clase)',
      icon: '⚡',
      color: 'border-blue-200 bg-blue-50/50 text-blue-950',
    },
    {
      id: '2-15',
      title: 'Nivel 3: Del 2 al 15',
      subtitle: 'Incluye 11² a 15² (hasta 225)',
      icon: '🔥',
      color: 'border-amber-200 bg-amber-50/50 text-amber-950',
    },
    {
      id: '2-20',
      title: 'Nivel 4: Del 2 al 20',
      subtitle: 'Hasta 20² = 400 (modo experta total)',
      icon: '👑',
      color: 'border-purple-200 bg-purple-50/50 text-purple-950',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-pop">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Suite</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReferenceOpen(true)}
            className="flex items-center gap-1.5 text-xs font-extrabold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl border border-purple-200 transition-all shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Ver Tabla de Cuadrados</span>
          </button>

          <button
            onClick={onOpenStats}
            className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Estadísticas</span>
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-purple-200 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            Cuadrados y Raíces
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3">
            CuadradosPlay Jr.
          </h2>
          <p className="text-purple-100 font-semibold text-base sm:text-lg mb-6">
            Aprende a calcular al instante cuánto es 7², o si ves 49 saber de inmediato que es 7 al cuadrado.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartGame('block')}
              className="px-7 py-4 bg-white text-purple-800 hover:bg-yellow-300 hover:text-purple-950 font-black rounded-2xl shadow-lg transition-all text-base flex items-center gap-2.5 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Empezar ({settings.blockSize} preguntas)</span>
            </button>

            <button
              onClick={() => onStartGame('sprint')}
              className="px-5 py-4 bg-yellow-300 hover:bg-yellow-200 text-purple-950 font-black rounded-2xl shadow-lg transition-all text-sm flex items-center gap-2 active:scale-95"
            >
              <Timer className="w-4 h-4" />
              <span>Sprint (60 seg)</span>
            </button>
          </div>
        </div>

        <div className="absolute right-6 top-6 text-8xl opacity-15 select-none font-black pointer-events-none">
          ²
        </div>
      </div>

      {/* Quick stats ribbon */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-purple-600">
            {overview.totalSolved}
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

      {/* 1. Selector de Nivel (Rangos 2-5, 2-10, 2-15, 2-20) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
          Dificultad (Rango de Números)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {levels.map(lvl => (
            <div
              key={lvl.id}
              onClick={() => onUpdateSettings({ ...settings, level: lvl.id })}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                settings.level === lvl.id
                  ? 'border-purple-600 shadow-md scale-[1.01]'
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

      {/* 2. Selector de Formato de Pregunta */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
        <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
          Tipo de Pregunta (Ida y Vuelta)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onUpdateSettings({ ...settings, questionMode: 'direct' })}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              settings.questionMode === 'direct'
                ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="font-extrabold text-sm text-slate-800">↗️ Directo (n²)</div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Ves el número y calculas su cuadrado: <span className="font-mono font-bold text-slate-700">7² = 49</span>.
            </p>
          </button>

          <button
            onClick={() => onUpdateSettings({ ...settings, questionMode: 'inverse' })}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              settings.questionMode === 'inverse'
                ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="font-extrabold text-sm text-slate-800">↙️ Inverso / Raíz (√)</div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Ves el cuadrado y dices la base: <span className="font-mono font-bold text-slate-700">√49 = 7</span>.
            </p>
          </button>

          <button
            onClick={() => onUpdateSettings({ ...settings, questionMode: 'mixed' })}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              settings.questionMode === 'mixed'
                ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="font-extrabold text-sm text-slate-800">🔀 Mixto (Recomendado)</div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Alterna de ida y vuelta para dominar ambas direcciones.
            </p>
          </button>
        </div>
      </div>

      {/* 3. Tamaño del bloque */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-extrabold text-slate-800">Tamaño de la Ronda</h4>
          <p className="text-xs text-slate-400 font-medium">Preguntas por bloque</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          {[10, 15, 20].map(size => (
            <button
              key={size}
              onClick={() => onUpdateSettings({ ...settings, blockSize: size })}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                settings.blockSize === size
                  ? 'bg-white text-purple-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {size} preguntas
            </button>
          ))}
        </div>
      </div>

      <SquaresReferenceModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />
    </div>
  );
};
