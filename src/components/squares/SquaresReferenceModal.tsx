import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface SquaresReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SquaresReferenceModal: React.FC<SquaresReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const squares = Array.from({ length: 19 }, (_, i) => {
    const n = i + 2; // 2 to 20
    const sq = n * n;
    return {
      n,
      sq,
      tier: n <= 5 ? '2-5' : n <= 10 ? '2-10' : n <= 15 ? '2-15' : '2-20',
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-pop">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📐</span>
            <div>
              <h3 className="text-lg font-black text-slate-800">Tabla de Cuadrados Perfectos (2 al 20)</h3>
              <p className="text-xs text-slate-400 font-medium">Repasa los cuadrados y sus raíces antes de jugar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-200/80 rounded-2xl p-3 text-center text-xs font-bold text-purple-900 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Un cuadrado perfecto es el resultado de multiplicar un número entero por sí mismo (ej. 7 × 7 = 49).</span>
        </div>

        {/* Grid of squares */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {squares.map(item => (
            <div
              key={item.n}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                item.tier === '2-5'
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : item.tier === '2-10'
                  ? 'border-blue-200 bg-blue-50/50'
                  : item.tier === '2-15'
                  ? 'border-amber-200 bg-amber-50/50'
                  : 'border-purple-200 bg-purple-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl font-black text-slate-800">
                  {item.n}² = <span className="underline font-black text-purple-700">{item.sq}</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {item.n}×{item.n}
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 font-mono mt-1 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                <span>√{item.sq} = {item.n}</span>
                <span className="text-[10px] text-slate-400 font-sans">{item.tier}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-xs transition-colors"
        >
          Cerrar Tabla
        </button>
      </div>
    </div>
  );
};
