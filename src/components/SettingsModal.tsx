import React from 'react';
import { UserSettings } from '../types';
import { X, Volume2, Sparkles, Check, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetData,
}) => {
  if (!isOpen) return null;

  const roundSizeOptions = [
    { value: 10, label: '10 verbos (Ronda rápida)' },
    { value: 15, label: '15 verbos' },
    { value: 20, label: '20 verbos (Recomendado)' },
    { value: 25, label: '25 verbos' },
    { value: 30, label: '30 verbos' },
    { value: 0, label: 'Todos los verbos disponibles' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-pop">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <h3 className="text-xl font-black text-slate-800">Ajustes del Juego</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Verbos por ronda */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
            Número de verbos por ronda (Secciones)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {roundSizeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => onUpdateSettings({ ...settings, roundSize: opt.value })}
                className={`p-2.5 rounded-2xl text-xs font-bold border-2 text-left transition-all flex items-center justify-between ${
                  settings.roundSize === opt.value
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <span>{opt.label}</span>
                {settings.roundSize === opt.value && <Check className="w-3.5 h-3.5 text-indigo-600 font-black shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Nivel de dificultad */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
            Nivel de dificultad predeterminado
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'easy', label: 'Básico' },
              { id: 'medium', label: 'Medio' },
              { id: 'hard', label: 'Avanzado' },
            ].map(lvl => (
              <button
                key={lvl.id}
                onClick={() => onUpdateSettings({ ...settings, levelFilter: lvl.id as any })}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border-2 transition-all ${
                  settings.levelFilter === lvl.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Audio & Voice */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
            Sonidos y Pronunciación
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <div>
                <div className="text-xs font-extrabold text-slate-800">Efectos de sonido lúdicos</div>
                <div className="text-[11px] text-slate-400">Sonido de acierto, racha y celebración</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={e => onUpdateSettings({ ...settings, soundEnabled: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded-lg accent-indigo-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-xs font-extrabold text-slate-800">Pronunciación en voz inglesa</div>
                <div className="text-[11px] text-slate-400">Escuchar el verbo automáticamente al corregir</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSpeak}
              onChange={e => onUpdateSettings({ ...settings, autoSpeak: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded-lg accent-purple-600 cursor-pointer"
            />
          </label>
        </div>

        {/* Reset data */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              if (window.confirm('¿Seguro que quieres borrar todas las estadísticas y reiniciar los puntos a 0?')) {
                onResetData();
                onClose();
              }
            }}
            className="w-full py-2.5 px-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-100 flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reiniciar estadísticas y puntuación</span>
          </button>
        </div>

        {/* Done button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-100 text-sm transition-all active:scale-95"
        >
          Guardar y Cerrar
        </button>
      </div>
    </div>
  );
};
