import React, { useState } from 'react';
import { MultiSettings, MultiSessionMode } from '../../types/multiplication';
import { multiStorage } from '../../services/multiplicationStorage';
import { Play, Timer, ArrowLeft, BarChart3, Grid, Sparkles, Check } from 'lucide-react';
import { PythagoreanTableModal } from './PythagoreanTableModal';

interface MultiLobbyProps {
  settings: MultiSettings;
  onUpdateSettings: (newSettings: MultiSettings) => void;
  onStartGame: (sessionMode: MultiSessionMode) => void;
  onOpenStats: () => void;
  onBackToHub: () => void;
}

export const MultiLobby: React.FC<MultiLobbyProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
  onOpenStats,
  onBackToHub,
}) => {
  const [isPythagoreanOpen, setIsPythagoreanOpen] = useState(false);
  const overview = multiStorage.getOverview();

  const toggleTable = (num: number) => {
    let next: number[];
    if (settings.selectedTables.includes(num)) {
      if (settings.selectedTables.length === 1) return; // Keep at least one
      next = settings.selectedTables.filter(t => t !== num);
    } else {
      next = [...settings.selectedTables, num].sort((a, b) => a - b);
    }
    onUpdateSettings({ ...settings, selectedTables: next });
  };

  const selectPreset = (tables: number[]) => {
    onUpdateSettings({ ...settings, selectedTables: tables });
  };

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
            onClick={() => setIsPythagoreanOpen(true)}
            className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl border border-amber-200 transition-all shadow-sm"
          >
            <Grid className="w-4 h-4 text-amber-600" />
            <span>Tabla Pitagórica</span>
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
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-amber-200 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            Tablas del 1 al 12
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3">
            MultiTablas Jr.
          </h2>
          <p className="text-amber-100 font-semibold text-base sm:text-lg mb-6">
            Aprende y automatiza las tablas de multiplicar. ¡Elige tus tablas y conviértete en una maestra del cálculo!
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartGame('block')}
              className="px-7 py-4 bg-white text-orange-700 hover:bg-yellow-300 hover:text-orange-950 font-black rounded-2xl shadow-lg transition-all text-base flex items-center gap-2.5 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Empezar ({settings.blockSize} preguntas)</span>
            </button>

            <button
              onClick={() => onStartGame('sprint')}
              className="px-5 py-4 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black rounded-2xl shadow-lg transition-all text-sm flex items-center gap-2 active:scale-95"
            >
              <Timer className="w-4 h-4" />
              <span>Sprint (60 seg)</span>
            </button>
          </div>
        </div>

        <div className="absolute right-6 top-6 text-8xl opacity-15 select-none font-black pointer-events-none">
          ✕
        </div>
      </div>

      {/* 1. Selector de Tablas (1 al 12) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Elige qué tablas practicar
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Pulsa en cada número para activarlo o desactivarlo
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-extrabold">
            <button
              onClick={() => selectPreset([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            >
              Todas (1-12)
            </button>
            <button
              onClick={() => selectPreset([1, 2, 3, 4, 5])}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            >
              Básicas (1-5)
            </button>
            <button
              onClick={() => selectPreset([6, 7, 8, 9, 12])}
              className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-900 transition-colors"
            >
              Difíciles (6, 7, 8, 9, 12)
            </button>
          </div>
        </div>

        {/* 12 Table Pills Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(num => {
            const isSelected = settings.selectedTables.includes(num);
            const mastery = overview.masteryByTable[num]?.percent ?? 0;

            return (
              <button
                key={num}
                onClick={() => toggleTable(num)}
                className={`py-3 px-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-center relative ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/70 shadow-sm scale-100'
                    : 'border-slate-100 bg-slate-50/60 opacity-60 hover:opacity-100'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 bg-orange-500 text-white rounded-full p-0.5">
                    <Check className="w-2.5 h-2.5 font-bold" />
                  </div>
                )}
                <span className="text-xl font-black text-slate-800">
                  ×{num}
                </span>
                <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                  Tabla del {num}
                </span>
                {mastery > 0 && (
                  <span className={`text-[9px] font-extrabold px-1.5 rounded-full mt-1 ${
                    mastery >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {mastery}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Selector de Modo de Pregunta */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
        <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
          Formato de Entrenamiento
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onUpdateSettings({ ...settings, questionMode: 'standard' })}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              settings.questionMode === 'standard'
                ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="font-extrabold text-sm text-slate-800">🔀 Clásico Aleatorio</div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Preguntas como <span className="font-mono font-bold text-slate-600">7 × 8 = ?</span> en orden variado para fijar reflejos.
            </p>
          </button>

          <button
            onClick={() => onUpdateSettings({ ...settings, questionMode: 'sequential' })}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              settings.questionMode === 'sequential'
                ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="font-extrabold text-sm text-slate-800">🔢 En Orden (1 al 12)</div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Recorre la tabla de forma ordenada para memorizarla paso a paso.
            </p>
          </button>

          <button
            onClick={() => onUpdateSettings({ ...settings, questionMode: 'missing_factor' })}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              settings.questionMode === 'missing_factor'
                ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="font-extrabold text-sm text-slate-800">❓ Factor Misterioso</div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Preguntas inversas como <span className="font-mono font-bold text-slate-600">7 × ? = 56</span>. ¡Prepara para la división!
            </p>
          </button>
        </div>
      </div>

      {/* 3. Tamaño del bloque */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-extrabold text-slate-800">Tamaño de la Ronda</h4>
          <p className="text-xs text-slate-400 font-medium">Número de multiplicaciones por partida</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          {[10, 15, 20, 24].map(size => (
            <button
              key={size}
              onClick={() => onUpdateSettings({ ...settings, blockSize: size })}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                settings.blockSize === size
                  ? 'bg-white text-orange-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {size} ops
            </button>
          ))}
        </div>
      </div>

      {/* Modal Tabla Pitagórica */}
      <PythagoreanTableModal
        isOpen={isPythagoreanOpen}
        onClose={() => setIsPythagoreanOpen(false)}
      />
    </div>
  );
};
