import React, { useState } from 'react';
import { Verb, VerbLevel } from '../types';
import { audio } from '../utils/audio';
import { Search, Volume2, BookOpen, Sparkles } from 'lucide-react';

interface DictionaryViewProps {
  verbs: Verb[];
  onPracticeVerb?: (verb: Verb) => void;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({ verbs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | VerbLevel>('all');

  const filteredVerbs = verbs.filter(verb => {
    const matchesLevel = selectedLevel === 'all' || verb.level === selectedLevel;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesLevel;

    const matchesSearch =
      verb.spanish.toLowerCase().includes(term) ||
      verb.infinitive.toLowerCase().includes(term) ||
      verb.pastSimple.toLowerCase().includes(term) ||
      verb.pastParticiple.toLowerCase().includes(term);

    return matchesLevel && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>Diccionario de Verbos</span>
            <BookOpen className="w-6 h-6 text-indigo-500" />
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            Consulta y escucha todas las formas de los verbos irregulares.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-400 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          Total: <span className="text-indigo-600 font-black">{verbs.length}</span> verbos
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por español o inglés (ej. cantar, sing, ate)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm font-semibold outline-none transition-all"
          />
        </div>

        {/* Level filter tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold w-full sm:w-auto justify-center">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedLevel === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Todos ({verbs.length})
          </button>
          <button
            onClick={() => setSelectedLevel('easy')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedLevel === 'easy' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Básico
          </button>
          <button
            onClick={() => setSelectedLevel('medium')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedLevel === 'medium' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Intermedio
          </button>
          <button
            onClick={() => setSelectedLevel('hard')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedLevel === 'hard' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Avanzado
          </button>
        </div>
      </div>

      {/* Verbs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredVerbs.map(verb => (
          <div
            key={verb.id}
            className="bg-white p-4 rounded-3xl border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-extrabold text-slate-800">
                  {verb.spanish}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    verb.level === 'easy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : verb.level === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {verb.level === 'easy' ? 'Básico' : verb.level === 'medium' ? 'Intermedio' : 'Avanzado'}
                  </span>
                  <button
                    onClick={() => audio.speakVerb(verb.infinitive, verb.pastSimple, verb.pastParticiple)}
                    title="Escuchar pronunciación completa"
                    className="p-1.5 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3 Forms Badges */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-50 text-center">
                <div className="bg-slate-50 rounded-xl p-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Presente</div>
                  <div className="font-extrabold text-indigo-700 text-sm mt-0.5">{verb.infinitive}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Pasado</div>
                  <div className="font-extrabold text-purple-700 text-sm mt-0.5">{verb.pastSimple}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Participio</div>
                  <div className="font-extrabold text-pink-700 text-sm mt-0.5">{verb.pastParticiple}</div>
                </div>
              </div>
            </div>

            {/* Example sentence */}
            {verb.example && (
              <div className="mt-3 text-xs text-slate-600 italic bg-slate-50/60 p-2.5 rounded-xl">
                "{verb.example}"
                {verb.exampleEs && (
                  <div className="text-[11px] text-slate-400 not-italic mt-0.5">{verb.exampleEs}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredVerbs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
          <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-600">No encontramos ningún verbo con "{searchTerm}"</p>
          <p className="text-xs text-slate-400 mt-1">Prueba a escribir otra palabra o cambiar el filtro de nivel.</p>
        </div>
      )}
    </div>
  );
};
