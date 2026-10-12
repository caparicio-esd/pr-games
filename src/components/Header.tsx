import React from 'react';
import { Sparkles, Gamepad2, Award, BookOpen, Settings, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { audio } from '../utils/audio';

interface HeaderProps {
  currentTab: 'game' | 'weak' | 'dict' | 'stats';
  onSelectTab: (tab: 'game' | 'weak' | 'dict' | 'stats') => void;
  onOpenSettings: () => void;
  difficultCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  difficultCount,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-indigo-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => onSelectTab('game')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              VerbMaster Jr.
            </h1>
            <p className="text-xs text-slate-500 font-semibold">Repaso de Verbos Irregulares</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl text-sm font-bold">
          <button
            onClick={() => onSelectTab('game')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
              currentTab === 'game'
                ? 'bg-white text-indigo-600 shadow-sm scale-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Jugar</span>
          </button>

          <button
            onClick={() => onSelectTab('weak')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all relative ${
              currentTab === 'weak'
                ? 'bg-white text-amber-600 shadow-sm scale-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Reforzar</span>
            {difficultCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-bounce">
                {difficultCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('dict')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
              currentTab === 'dict'
                ? 'bg-white text-blue-600 shadow-sm scale-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Diccionario</span>
          </button>

          <button
            onClick={() => onSelectTab('stats')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
              currentTab === 'stats'
                ? 'bg-white text-emerald-600 shadow-sm scale-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Progreso</span>
          </button>
        </nav>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) {
                audio.playCorrect();
              }
            }}
            title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-indigo-500" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          <button
            onClick={onOpenSettings}
            title="Configuración"
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
