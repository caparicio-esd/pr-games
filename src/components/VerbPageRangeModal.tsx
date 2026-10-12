import React, { useState } from 'react';
import { Verb } from '../types';
import { X, BookOpen, Play, Check, ListOrdered, Shuffle } from 'lucide-react';

interface VerbPageRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  verbs: Verb[];
  onStartStudy: (selectedVerbs: Verb[], title: string) => void;
}

export const VerbPageRangeModal: React.FC<VerbPageRangeModalProps> = ({
  isOpen,
  onClose,
  verbs,
  onStartStudy,
}) => {
  const [tabMode, setTabMode] = useState<'pages' | 'custom'>('pages');
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(20);
  const [inAlphabeticalOrder, setInAlphabeticalOrder] = useState(true);

  if (!isOpen) return null;

  // Calculate pages based on pageSize
  const totalPages = Math.ceil(verbs.length / pageSize);
  const pagesList = Array.from({ length: totalPages }, (_, idx) => {
    const start = idx * pageSize + 1;
    const end = Math.min((idx + 1) * pageSize, verbs.length);
    const startVerb = verbs[start - 1]?.infinitive;
    const endVerb = verbs[end - 1]?.infinitive;
    return {
      pageIndex: idx,
      pageNum: idx + 1,
      start,
      end,
      count: end - start + 1,
      preview: `${startVerb} ➔ ${endVerb}`,
    };
  });

  const handleStart = () => {
    let startIdx = 0;
    let endIdx = 0;
    let title = '';

    if (tabMode === 'pages') {
      const page = pagesList[selectedPageIndex] || pagesList[0];
      startIdx = page.start - 1;
      endIdx = page.end;
      title = `Página ${page.pageNum} (Verbos #${page.start} al #${page.end})`;
    } else {
      const clampedStart = Math.max(1, Math.min(rangeStart, verbs.length));
      const clampedEnd = Math.max(clampedStart, Math.min(rangeEnd, verbs.length));
      startIdx = clampedStart - 1;
      endIdx = clampedEnd;
      title = `Verbos #${clampedStart} al #${clampedEnd}`;
    }

    let slice = verbs.slice(startIdx, endIdx);

    if (!inAlphabeticalOrder) {
      // Shuffle if not in order
      slice = [...slice].sort(() => Math.random() - 0.5);
    }

    onStartStudy(slice, title);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-pop">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">Estudiar por Páginas</h3>
              <p className="text-xs text-slate-400 font-medium">Repasa los verbos en el orden de tu libro escolar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: Por Páginas o Rango Libre */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-black">
          <button
            onClick={() => setTabMode('pages')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              tabMode === 'pages'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📖 Por Páginas ({pageSize} por página)
          </button>

          <button
            onClick={() => setTabMode('custom')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              tabMode === 'custom'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🎯 Rango Libre (#X al #Y)
          </button>
        </div>

        {/* MODE 1: PAGES */}
        {tabMode === 'pages' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Selecciona la página a estudiar:
              </label>

              {/* Page size toggle */}
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                <span>Verbos/página:</span>
                {[15, 20, 25].map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      setPageSize(size);
                      setSelectedPageIndex(0);
                    }}
                    className={`px-1.5 py-0.5 rounded ${
                      pageSize === size ? 'bg-indigo-600 text-white font-black' : 'hover:bg-slate-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {pagesList.map(page => (
                <div
                  key={page.pageIndex}
                  onClick={() => setSelectedPageIndex(page.pageIndex)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPageIndex === page.pageIndex
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-sm scale-[1.01]'
                      : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-sm text-slate-800">
                      Página {page.pageNum}
                    </span>
                    {selectedPageIndex === page.pageIndex && (
                      <Check className="w-4 h-4 text-indigo-600 font-black" />
                    )}
                  </div>
                  <div className="text-xs font-extrabold text-indigo-700">
                    #{page.start} al #{page.end} ({page.count} verbos)
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                    {page.preview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODE 2: CUSTOM RANGE */}
        {tabMode === 'custom' && (
          <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-2">
                Define tu rango de verbos del colegio:
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Desde el verbo #</span>
                  <input
                    type="number"
                    min="1"
                    max={verbs.length}
                    value={rangeStart}
                    onChange={e => setRangeStart(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-black text-center text-lg text-slate-800 outline-none focus:border-indigo-500"
                  />
                  {verbs[rangeStart - 1] && (
                    <span className="text-[11px] text-indigo-600 font-mono block text-center mt-1">
                      ({verbs[rangeStart - 1].infinitive})
                    </span>
                  )}
                </div>

                <div className="text-slate-400 font-bold pt-4">➔</div>

                <div className="flex-1">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Hasta el verbo #</span>
                  <input
                    type="number"
                    min={rangeStart}
                    max={verbs.length}
                    value={rangeEnd}
                    onChange={e => setRangeEnd(Math.max(rangeStart, parseInt(e.target.value) || rangeStart))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-black text-center text-lg text-slate-800 outline-none focus:border-indigo-500"
                  />
                  {verbs[rangeEnd - 1] && (
                    <span className="text-[11px] text-indigo-600 font-mono block text-center mt-1">
                      ({verbs[rangeEnd - 1].infinitive})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-semibold text-center bg-white p-2.5 rounded-xl border border-slate-100">
              Total a practicar: <span className="text-indigo-600 font-black">{Math.max(1, rangeEnd - rangeStart + 1)} verbos</span> (del total de {verbs.length})
            </div>
          </div>
        )}

        {/* Order Preference Toggle */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
            ¿En qué orden quieres que aparezcan?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setInAlphabeticalOrder(true)}
              className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-2.5 ${
                inAlphabeticalOrder
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                  : 'border-slate-100 text-slate-600 hover:border-slate-200'
              }`}
            >
              <ListOrdered className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <div className="text-xs font-black">En orden del libro</div>
                <div className="text-[10px] text-slate-400">#1, #2, #3... correlativos</div>
              </div>
            </button>

            <button
              onClick={() => setInAlphabeticalOrder(false)}
              className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-2.5 ${
                !inAlphabeticalOrder
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                  : 'border-slate-100 text-slate-600 hover:border-slate-200'
              }`}
            >
              <Shuffle className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <div className="text-xs font-black">Salteados</div>
                <div className="text-[10px] text-slate-400">Desordenados para evaluar</div>
              </div>
            </button>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 text-base flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>¡Empezar a Estudiar!</span>
        </button>
      </div>
    </div>
  );
};
