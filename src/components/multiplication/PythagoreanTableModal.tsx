import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface PythagoreanTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythagoreanTableModal: React.FC<PythagoreanTableModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-pop">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <div>
              <h3 className="text-lg font-black text-slate-800">Tabla Pitagórica (1 al 12)</h3>
              <p className="text-xs text-slate-400 font-medium">Toca cualquier número para ver su multiplicación</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected preview banner */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-center">
          {hoveredCell ? (
            <div className="text-lg font-black text-amber-900 animate-pop">
              {hoveredCell.r} × {hoveredCell.c} = <span className="underline text-amber-600 text-xl">{hoveredCell.r * hoveredCell.c}</span>
              {hoveredCell.r === hoveredCell.c && (
                <span className="text-xs ml-2 bg-amber-200 px-2 py-0.5 rounded-full font-bold">¡Cuadrado perfecto!</span>
              )}
            </div>
          ) : (
            <div className="text-xs font-bold text-amber-700 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Pasa el cursor o pulsa en una casilla para ver el cálculo</span>
            </div>
          )}
        </div>

        {/* The 12x12 Table Grid */}
        <div className="overflow-x-auto pb-2">
          <table className="w-full border-collapse text-center select-none text-[11px] sm:text-xs">
            <thead>
              <tr>
                <th className="p-1 sm:p-1.5 bg-slate-100 font-black text-slate-400 rounded-tl-xl">×</th>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(c => (
                  <th
                    key={c}
                    className={`p-1 sm:p-1.5 font-black transition-colors ${
                      hoveredCell?.c === c ? 'bg-amber-200 text-amber-950 font-black' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }, (_, rIdx) => {
                const r = rIdx + 1;
                return (
                  <tr key={r}>
                    <th
                      className={`p-1 sm:p-1.5 font-black transition-colors ${
                        hoveredCell?.r === r ? 'bg-amber-200 text-amber-950 font-black' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r}
                    </th>
                    {Array.from({ length: 12 }, (_, cIdx) => {
                      const c = cIdx + 1;
                      const val = r * c;
                      const isSquare = r === c;
                      const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                      const isRowCol = hoveredCell?.r === r || hoveredCell?.c === c;

                      return (
                        <td
                          key={c}
                          onMouseEnter={() => setHoveredCell({ r, c })}
                          onClick={() => setHoveredCell({ r, c })}
                          className={`p-1 sm:p-1.5 cursor-pointer font-bold border border-slate-100 transition-all ${
                            isHovered
                              ? 'bg-amber-500 text-white font-black scale-110 shadow-md z-10 rounded'
                              : isRowCol
                              ? 'bg-amber-100/60 text-amber-900'
                              : isSquare
                              ? 'bg-yellow-100/70 text-amber-950 font-black'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
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
