import React, { useState } from 'react';
import { UnitLevel, UnitMagnitudeFilter, UnitSettings, UnitSessionMode } from '../../types/units';
import { unitsStorage } from '../../services/unitsStorage';
import { Play, Timer, ArrowLeft, BarChart3, HelpCircle, Sparkles } from 'lucide-react';
import { UnitsLadderModal } from './UnitsLadderModal';

interface UnitsLobbyProps {
  settings: UnitSettings;
  onUpdateSettings: (newSettings: UnitSettings) => void;
  onStartGame: (sessionMode: UnitSessionMode) => void;
  onOpenStats: () => void;
  onBackToHub: () => void;
}

export const UnitsLobby: React.FC<UnitsLobbyProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
  onOpenStats,
  onBackToHub,
}) => {
  const [isLadderOpen, setIsLadderOpen] = useState(false);
  const overview = unitsStorage.getOverview();

  const levels: { id: UnitLevel; title: string; subtitle: string; icon: string; color: string }[] = [
    {
      id: '1',
      title: 'Nivel 1: Básico / Cotidiano',
      subtitle: 'km ↔ m, kg ↔ g, l ↔ ml, h ↔ min (muy frecuente)',
      icon: '🌱',
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-950',
    },
    {
      id: '2',
      title: 'Nivel 2: Escalera Completa',
      subtitle: 'Las 7 unidades de m, g y l (kilo a mili, mover la coma)',
      icon: '⚡',
      color: 'border-blue-200 bg-blue-50/50 text-blue-950',
    },
    {
      id: '3',
      title: 'Nivel 3: Superficie y Volumen',
      subtitle: 'm² (saltos de 100), m³ (saltos de 1.000) y regla 1 dm³ = 1 l',
      icon: '🔥',
      color: 'border-purple-200 bg-purple-50/50 text-purple-950',
    },
    {
      id: '4',
      title: 'Nivel 4: Experta Total',
      subtitle: 'Todas las magnitudes mezcladas + tiempo avanzado',
      icon: '👑',
      color: 'border-amber-200 bg-amber-50/50 text-amber-950',
    },
  ];

  const magnitudeFilters: { id: UnitMagnitudeFilter; label: string; icon: string }[] = [
    { id: 'all', label: 'Todas las magnitudes', icon: '✨' },
    { id: 'length', label: 'Longitud (m)', icon: '📏' },
    { id: 'mass', label: 'Masa (g, kg, t)', icon: '⚖️' },
    { id: 'capacity', label: 'Capacidad (l)', icon: '🥤' },
    { id: 'area', label: 'Superficie (m²)', icon: '🟩' },
    { id: 'volume', label: 'Volumen (m³)', icon: '🧊' },
    { id: 'time', label: 'Tiempo (s, min, h)', icon: '⏱️' },
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
          <span>🏠 Menú Principal</span>
        </button>

        <button
          onClick={onOpenStats}
          className="flex items-center gap-2 text-xs font-extrabold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-xl border border-teal-200 shadow-sm transition-all active:scale-95"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Ver Mi Progreso</span>
        </button>
      </div>

      {/* Hero Greeting */}
      <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-teal-200 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            ¡Automatismos de Física y Matemáticas!
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3">
            UnidadesPlay Jr.
          </h2>
          <p className="text-teal-50 font-semibold text-base sm:text-lg mb-6">
            Aprende a pasar de una unidad a otra sin dudar: mueve la coma con la escalera métrica, multiplica o divide y domina el tiempo.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartGame('block')}
              className="px-7 py-4 bg-white text-teal-900 hover:bg-yellow-300 hover:text-teal-950 font-black rounded-2xl shadow-lg transition-all text-base flex items-center gap-2.5 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>¡Empezar Ronda ({settings.blockSize} preguntas)!</span>
            </button>

            <button
              onClick={() => onStartGame('sprint')}
              className="px-6 py-4 bg-teal-800/80 hover:bg-teal-800 text-white font-black rounded-2xl shadow-lg border border-teal-400/40 transition-all text-sm flex items-center gap-2 active:scale-95"
            >
              <Timer className="w-4 h-4 text-yellow-300" />
              <span>⏱️ Sprint 60s</span>
            </button>

            <button
              onClick={() => setIsLadderOpen(true)}
              className="px-5 py-4 bg-white/20 hover:bg-white/30 text-white font-black rounded-2xl backdrop-blur-md border border-white/30 transition-all text-sm flex items-center gap-2 active:scale-95"
            >
              <HelpCircle className="w-4 h-4 text-white" />
              <span>🪜 Chuleta de la Escalera</span>
            </button>
          </div>
        </div>

        <div className="absolute right-8 top-8 text-8xl opacity-15 select-none font-black pointer-events-none">
          📐
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-teal-600">
            {overview.totalSessions}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Partidas
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {overview.totalSolved}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Aciertos
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
      </div>

      {/* Level Selection */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
            1. Elige el Nivel de Dificultad
          </h3>
          <span className="text-xs font-bold text-teal-600">
            Seleccionado: Nivel {settings.level}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {levels.map(lvl => {
            const isSelected = settings.level === lvl.id;
            return (
              <div
                key={lvl.id}
                onClick={() => onUpdateSettings({ ...settings, level: lvl.id })}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? `${lvl.color} border-current shadow-md ring-2 ring-teal-500/20`
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="text-3xl shrink-0 mt-0.5">{lvl.icon}</div>
                <div>
                  <div className="font-black text-sm text-slate-800">{lvl.title}</div>
                  <div className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    {lvl.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Magnitude Filter */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
            2. Magnitud a Practicar
          </h3>
          <span className="text-xs text-slate-400 font-bold">
            ¿Quieres practicar solo una hoy?
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {magnitudeFilters.map(f => {
            const isSelected = settings.filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onUpdateSettings({ ...settings, filter: f.id })}
                className={`p-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all border ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{f.icon}</span>
                <span className="truncate">{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Round Size (Block mode) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
          3. Longitud de la Ronda
        </h3>

        <div className="flex gap-3">
          {[10, 15, 20].map(size => {
            const isSelected = settings.blockSize === size;
            return (
              <button
                key={size}
                onClick={() => onUpdateSettings({ ...settings, blockSize: size })}
                className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all border ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {size} preguntas
              </button>
            );
          })}
        </div>
      </div>

      {/* Reference Ladder Modal */}
      <UnitsLadderModal
        isOpen={isLadderOpen}
        onClose={() => setIsLadderOpen(false)}
      />
    </div>
  );
};
