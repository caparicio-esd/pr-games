import React, { useState } from 'react';
import { X, ArrowDown, ArrowUp, Sparkles } from 'lucide-react';

interface UnitsLadderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnitsLadderModal: React.FC<UnitsLadderModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'metric' | 'area' | 'volume' | 'time'>('metric');

  if (!isOpen) return null;

  const metricSteps = [
    { prefix: 'kilo-', symbol: 'k', example: 'km / kg / kl', desc: '1.000 unidades', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { prefix: 'hecto-', symbol: 'h', example: 'hm / hg / hl', desc: '100 unidades', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { prefix: 'deca-', symbol: 'da', example: 'dam / dag / dal', desc: '10 unidades', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { prefix: 'UNIDAD', symbol: 'base', example: 'metro (m) / gramo (g) / litro (l)', desc: '1 unidad base', color: 'bg-emerald-200 text-emerald-950 border-emerald-300 font-black scale-105' },
    { prefix: 'deci-', symbol: 'd', example: 'dm / dg / dl', desc: '0,1 unidades', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    { prefix: 'centi-', symbol: 'c', example: 'cm / cg / cl', desc: '0,01 unidades', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { prefix: 'mili-', symbol: 'm', example: 'mm / mg / ml', desc: '0,001 unidades', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl">
              🪜
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">
                La Gran Escalera de Conversión
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                La chuleta interactiva para no dudar nunca al mover la coma
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveTab('metric')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'metric'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            📏 Longitud, Masa y Capacidad (m, g, l)
          </button>

          <button
            onClick={() => setActiveTab('area')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'area'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🟩 Superficie (m²)
          </button>

          <button
            onClick={() => setActiveTab('volume')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'volume'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🧊 Volumen (m³) y Capacidad (l)
          </button>

          <button
            onClick={() => setActiveTab('time')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'time'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            ⏱️ Tiempo (s, min, h, d)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* TAB 1: METRIC LINEAR (m, g, l) */}
          {activeTab === 'metric' && (
            <div className="space-y-6">
              {/* Rule Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ArrowDown className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black text-emerald-900 uppercase">Al bajar escalones</div>
                    <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                      Multiplica por 10 en cada salto (mueve la coma hacia la derecha 👉)
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                    <ArrowUp className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black text-sky-900 uppercase">Al subir escalones</div>
                    <div className="text-xs text-sky-700 font-semibold mt-0.5">
                      Divide entre 10 en cada salto (mueve la coma hacia la izquierda 👈)
                    </div>
                  </div>
                </div>
              </div>

              {/* Ladder visual */}
              <div className="space-y-2 max-w-lg mx-auto">
                {metricSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-2xl border ${step.color} shadow-sm transition-transform hover:scale-[1.02]`}
                    style={{ marginLeft: `${idx * 16}px` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-white/70 flex items-center justify-center text-xs font-black">
                        {7 - idx}
                      </span>
                      <span className="font-black text-sm uppercase tracking-wide">
                        {step.prefix}
                      </span>
                      <span className="text-xs opacity-75">({step.example})</span>
                    </div>
                    <span className="text-xs font-bold opacity-80">
                      {step.desc}
                    </span>
                  </div>
                ))}
              </div>

              {/* Special Note: Tonelada */}
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-start gap-3 text-xs text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black">La Tonelada (t):</span> Se usa para pesos muy grandes. Recuerda siempre que{' '}
                  <span className="font-extrabold underline">1 tonelada (t) = 1.000 kg</span>.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AREA (m²) */}
          {activeTab === 'area' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">¡El secreto del exponente 2!</span>
                <p className="text-sm font-semibold text-emerald-950 mt-1">
                  En superficie hay 2 dimensiones (largo × ancho). Por eso, <span className="underline font-black">cada escalón vale por dos ceros (100)</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-emerald-100/50 rounded-2xl border border-emerald-200">
                  <div className="text-xs font-black text-emerald-900">⬇️ Bajar 1 escalón</div>
                  <div className="text-lg font-black text-emerald-800 mt-1">× 100</div>
                  <div className="text-xs text-emerald-700 font-semibold mt-0.5">Añade 2 ceros o mueve la coma 2 lugares 👉</div>
                </div>

                <div className="p-4 bg-sky-100/50 rounded-2xl border border-sky-200">
                  <div className="text-xs font-black text-sky-900">⬆️ Subir 1 escalón</div>
                  <div className="text-lg font-black text-sky-800 mt-1">÷ 100</div>
                  <div className="text-xs text-sky-700 font-semibold mt-0.5">Quita 2 ceros o mueve la coma 2 lugares 👈</div>
                </div>
              </div>

              {/* Area Ladder */}
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-2">
                <div className="font-black text-xs text-slate-500 uppercase tracking-wider mb-2 text-center">
                  Escalones de Superficie
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-black text-slate-800">
                  <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-200">km²</span>
                  <span className="text-slate-400">↔</span>
                  <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-200">hm² (ha)</span>
                  <span className="text-slate-400">↔</span>
                  <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-200">dam²</span>
                  <span className="text-slate-400">↔</span>
                  <span className="px-3 py-1.5 bg-emerald-200 rounded-xl border border-emerald-300 text-emerald-950 font-black">m² (base)</span>
                  <span className="text-slate-400">↔</span>
                  <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-200">dm²</span>
                  <span className="text-slate-400">↔</span>
                  <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-200">cm²</span>
                  <span className="text-slate-400">↔</span>
                  <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-200">mm²</span>
                </div>
              </div>

              {/* Hectárea tip */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-xs text-amber-900">
                <span className="font-black">La Hectárea (ha):</span> Es exactamente igual a 1 hm² (10.000 m²). Se usa comúnmente para medir campos de fútbol, bosques y fincas.
              </div>
            </div>
          )}

          {/* TAB 3: VOLUME (m³) AND CAPACITY */}
          {activeTab === 'volume' && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
                <span className="text-xs font-black uppercase text-indigo-800 tracking-wider">¡El secreto del exponente 3!</span>
                <p className="text-sm font-semibold text-indigo-950 mt-1">
                  En volumen hay 3 dimensiones (largo × ancho × alto). Por eso, <span className="underline font-black">cada escalón vale por tres ceros (1.000)</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-indigo-100/50 rounded-2xl border border-indigo-200">
                  <div className="text-xs font-black text-indigo-900">⬇️ Bajar 1 escalón</div>
                  <div className="text-lg font-black text-indigo-800 mt-1">× 1.000</div>
                  <div className="text-xs text-indigo-700 font-semibold mt-0.5">Añade 3 ceros o mueve la coma 3 lugares 👉</div>
                </div>

                <div className="p-4 bg-purple-100/50 rounded-2xl border border-purple-200">
                  <div className="text-xs font-black text-purple-900">⬆️ Subir 1 escalón</div>
                  <div className="text-lg font-black text-purple-800 mt-1">÷ 1.000</div>
                  <div className="text-xs text-purple-700 font-semibold mt-0.5">Quita 3 ceros o mueve la coma 3 lugares 👈</div>
                </div>
              </div>

              {/* Gold rules bridges */}
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 p-5 rounded-3xl border border-amber-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <span className="text-sm font-black text-amber-950 uppercase tracking-wider">
                    Las 3 Reglas de Oro (Volumen ↔ Capacidad)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-sm">
                    <div className="text-xs text-slate-500 font-bold">Un tetrabrik de leche:</div>
                    <div className="text-lg font-black text-amber-900 mt-1">1 dm³ = 1 litro</div>
                  </div>

                  <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-sm">
                    <div className="text-xs text-slate-500 font-bold">Un dado de parchís:</div>
                    <div className="text-lg font-black text-amber-900 mt-1">1 cm³ = 1 ml</div>
                  </div>

                  <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-sm">
                    <div className="text-xs text-slate-500 font-bold">Un depósito gigante:</div>
                    <div className="text-lg font-black text-amber-900 mt-1">1 m³ = 1.000 l</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TIME */}
          {activeTab === 'time' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                <span className="text-xs font-black uppercase text-amber-800 tracking-wider">El Sistema Sexagesimal</span>
                <p className="text-sm font-semibold text-amber-950 mt-1">
                  En el tiempo no contamos de 10 en 10, sino en grupos de 60 y 24.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-2xl mb-1">⏳</div>
                  <div className="text-sm font-black text-slate-800">1 minuto</div>
                  <div className="text-xs font-bold text-amber-600 mt-0.5">= 60 segundos</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-2xl mb-1">⏰</div>
                  <div className="text-sm font-black text-slate-800">1 hora</div>
                  <div className="text-xs font-bold text-amber-600 mt-0.5">= 60 minutos (3.600 s)</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-2xl mb-1">☀️</div>
                  <div className="text-sm font-black text-slate-800">1 día</div>
                  <div className="text-xs font-bold text-amber-600 mt-0.5">= 24 horas</div>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
                  Fracciones de hora muy habituales en clase
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-extrabold text-slate-800">Media hora (0,5 h)</span>
                    <div className="text-emerald-600 font-black mt-0.5">30 min</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-extrabold text-slate-800">Cuarto de hora (0,25 h)</span>
                    <div className="text-emerald-600 font-black mt-0.5">15 min</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-extrabold text-slate-800">Tres cuartos (0,75 h)</span>
                    <div className="text-emerald-600 font-black mt-0.5">45 min</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-extrabold text-slate-800">Hora y media (1,5 h)</span>
                    <div className="text-emerald-600 font-black mt-0.5">90 min</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-xl shadow-sm text-xs active:scale-95 transition-all"
          >
            ¡Entendido, a jugar!
          </button>
        </div>
      </div>
    </div>
  );
};
