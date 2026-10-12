import React, { useState, useRef, useEffect } from 'react';
import { Verb, VerbAttempt, UserSettings } from '../types';
import { VERBS_DATA } from '../data/verbs';
import { audio } from '../utils/audio';
import { Volume2, Lightbulb, ArrowRight, Check, X, Flame, Star, HelpCircle, RotateCcw } from 'lucide-react';

interface GameSessionProps {
  verbs: Verb[];
  settings: UserSettings;
  onFinishRound: (attempts: VerbAttempt[], highestStreak: number, score: number) => void;
  onQuit: () => void;
  sessionTitle?: string;
}

export const GameSession: React.FC<GameSessionProps> = ({
  verbs,
  settings,
  onFinishRound,
  onQuit,
  sessionTitle = 'Ronda de Verbos',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<VerbAttempt[]>([]);
  
  // Current inputs
  const [infinitiveInput, setInfinitiveInput] = useState('');
  const [pastSimpleInput, setPastSimpleInput] = useState('');
  const [pastParticipleInput, setPastParticipleInput] = useState('');
  
  // State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [lastPointsEarned, setLastPointsEarned] = useState<number | null>(null);

  // Input refs for automatic focus & Enter navigation
  const infinitiveRef = useRef<HTMLInputElement>(null);
  const pastSimpleRef = useRef<HTMLInputElement>(null);
  const pastParticipleRef = useRef<HTMLInputElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const currentVerb = verbs[currentIndex];

  // Focus the first input whenever current verb changes
  useEffect(() => {
    setInfinitiveInput('');
    setPastSimpleInput('');
    setPastParticipleInput('');
    setIsSubmitted(false);
    setHintUsed(false);
    setLastPointsEarned(null);

    // Timeout to ensure DOM is ready
    setTimeout(() => {
      infinitiveRef.current?.focus();
    }, 50);
  }, [currentIndex]);

  const cleanText = (str: string) => str.trim().toLowerCase();

  const isFormCorrect = (input: string, correct: string, alts?: string[]) => {
    const clean = cleanText(input);
    if (!clean) return false;
    if (clean === cleanText(correct)) return true;
    if (alts && alts.some(alt => cleanText(alt) === clean)) return true;
    return false;
  };

  const handleCheck = () => {
    if (isSubmitted) return;

    const infCorrect = isFormCorrect(infinitiveInput, currentVerb.infinitive, currentVerb.infinitiveAlts);
    const pastCorrect = isFormCorrect(pastSimpleInput, currentVerb.pastSimple, currentVerb.pastSimpleAlts);
    const partCorrect = isFormCorrect(pastParticipleInput, currentVerb.pastParticiple, currentVerb.pastParticipleAlts);

    const correctCount = (infCorrect ? 1 : 0) + (pastCorrect ? 1 : 0) + (partCorrect ? 1 : 0);
    const allCorrect = correctCount === 3;

    // Scoring: 1 pt per correct form + streak bonus if all 3 correct
    let points = correctCount;
    let nextStreak = currentStreak;

    if (allCorrect) {
      nextStreak = currentStreak + 1;
      if (nextStreak >= 3) {
        points += Math.min(nextStreak, 5); // bonus streak
      }
      if (nextStreak > highestStreak) {
        setHighestStreak(nextStreak);
      }
      setCurrentStreak(nextStreak);

      if (nextStreak >= 5) {
        audio.playStreak();
      } else {
        audio.playCorrect();
      }
    } else {
      setCurrentStreak(0);
      if (correctCount > 0) {
        audio.playPartial();
      } else {
        audio.playIncorrect();
      }
    }

    setLastPointsEarned(points);
    setTotalScore(prev => prev + points);

    const attempt: VerbAttempt = {
      verbId: currentVerb.id,
      verb: currentVerb,
      userInfinitive: infinitiveInput,
      userPastSimple: pastSimpleInput,
      userPastParticiple: pastParticipleInput,
      infinitiveCorrect: infCorrect,
      pastSimpleCorrect: pastCorrect,
      pastParticipleCorrect: partCorrect,
      allCorrect,
      pointsEarned: points,
    };

    setAttempts(prev => [...prev, attempt]);
    setIsSubmitted(true);

    // Speak audio if autoSpeak is active
    if (settings.autoSpeak) {
      setTimeout(() => {
        audio.speakVerb(currentVerb.infinitive, currentVerb.pastSimple, currentVerb.pastParticiple);
      }, 150);
    }

    // Move focus to next button
    setTimeout(() => {
      nextBtnRef.current?.focus();
    }, 100);
  };

  const handleNext = () => {
    if (currentIndex + 1 < verbs.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finished all verbs in the session
      const finalHighestStreak = Math.max(highestStreak, currentStreak);
      onFinishRound(attempts, finalHighestStreak, totalScore);
    }
  };

  const handleGiveUp = () => {
    // Fill in wrong if empty so she sees correct answers
    setIsSubmitted(true);
    setCurrentStreak(0);
    audio.playIncorrect();

    const attempt: VerbAttempt = {
      verbId: currentVerb.id,
      verb: currentVerb,
      userInfinitive: infinitiveInput,
      userPastSimple: pastSimpleInput,
      userPastParticiple: pastParticipleInput,
      infinitiveCorrect: false,
      pastSimpleCorrect: false,
      pastParticipleCorrect: false,
      allCorrect: false,
      pointsEarned: 0,
    };

    setAttempts(prev => [...prev, attempt]);
    setLastPointsEarned(0);

    if (settings.autoSpeak) {
      audio.speakVerb(currentVerb.infinitive, currentVerb.pastSimple, currentVerb.pastParticiple);
    }

    setTimeout(() => {
      nextBtnRef.current?.focus();
    }, 100);
  };

  const handleUseHint = () => {
    setHintUsed(true);
    if (!infinitiveInput) {
      setInfinitiveInput(currentVerb.infinitive.slice(0, 1));
    }
    if (!pastSimpleInput) {
      setPastSimpleInput(currentVerb.pastSimple.slice(0, 1));
    }
    if (!pastParticipleInput) {
      setPastParticipleInput(currentVerb.pastParticiple.slice(0, 1));
    }
    infinitiveRef.current?.focus();
  };

  const handleSpeak = () => {
    audio.speakVerb(currentVerb.infinitive, currentVerb.pastSimple, currentVerb.pastParticiple);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, field: 'inf' | 'past' | 'part') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'inf') {
        pastSimpleRef.current?.focus();
      } else if (field === 'past') {
        pastParticipleRef.current?.focus();
      } else if (field === 'part') {
        handleCheck();
      }
    }
  };

  const progressPercent = Math.round(((currentIndex) / verbs.length) * 100);

  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'easy':
        return <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Básico</span>;
      case 'medium':
        return <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Intermedio</span>;
      case 'hard':
        return <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Avanzado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Bar: Progress, Score & Streak */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onQuit}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            title="Salir de la ronda"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {sessionTitle}
            </div>
            <div className="text-sm font-extrabold text-slate-700">
              Verbo {currentIndex + 1} <span className="text-slate-400 font-semibold">de {verbs.length}</span>
            </div>
          </div>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60">
            <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'text-amber-500 fill-amber-500 animate-wiggle' : 'text-slate-300'}`} />
            <div className="text-xs font-bold text-amber-800">
              Racha: <span className="text-sm font-black">{currentStreak}</span>
            </div>
          </div>

          {/* Points Counter */}
          <div className="flex items-center gap-1.5 bg-indigo-50 px-3.5 py-1.5 rounded-xl border border-indigo-200/60">
            <Star className="w-5 h-5 text-indigo-500 fill-indigo-400" />
            <div className="text-xs font-bold text-indigo-800">
              Puntos: <span className="text-sm font-black">{totalScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/70 h-2.5 rounded-full overflow-hidden mb-6 shadow-inner">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Verb Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-100/40 border border-indigo-50/80 relative overflow-hidden transition-all">
        {/* Floating points alert */}
        {lastPointsEarned !== null && (
          <div className="absolute top-4 right-4 animate-pop">
            <span className={`text-sm font-black px-3 py-1.5 rounded-full shadow-sm ${
              lastPointsEarned > 0 
                ? 'bg-emerald-500 text-white' 
                : 'bg-rose-500 text-white'
            }`}>
              {lastPointsEarned > 0 ? `+${lastPointsEarned} pts!` : '0 pts'}
            </span>
          </div>
        )}

        {/* Spanish Word Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              #{VERBS_DATA.findIndex(v => v.id === currentVerb.id) + 1}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-3 py-0.5 rounded-full">
              Significado en Español
            </span>
            {getDifficultyBadge(currentVerb.level)}
          </div>

          <div className="flex items-center justify-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
              {currentVerb.spanish}
            </h2>
            <button
              onClick={handleSpeak}
              title="Escuchar pronunciación"
              className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1">Escribe las 3 formas en inglés:</p>
        </div>

        {/* The 3 Blanks Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* 1. Presente / Infinitivo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              1. Presente (Infinitive)
            </label>
            <div className="relative">
              <input
                ref={infinitiveRef}
                type="text"
                autoComplete="off"
                spellCheck="false"
                disabled={isSubmitted}
                value={infinitiveInput}
                onChange={e => setInfinitiveInput(e.target.value)}
                onKeyDown={e => handleKeyDown(e, 'inf')}
                placeholder="ej. sing"
                className={`w-full px-4 py-3 rounded-2xl text-lg font-bold border-2 transition-all outline-none ${
                  isSubmitted
                    ? isFormCorrect(infinitiveInput, currentVerb.infinitive, currentVerb.infinitiveAlts)
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900'
                      : 'border-rose-400 bg-rose-50/50 text-rose-900'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-slate-50/40 text-slate-800'
                }`}
              />
              {isSubmitted && (
                <div className="absolute right-3 top-3.5">
                  {isFormCorrect(infinitiveInput, currentVerb.infinitive, currentVerb.infinitiveAlts) ? (
                    <Check className="w-5 h-5 text-emerald-600 font-bold" />
                  ) : (
                    <X className="w-5 h-5 text-rose-500 font-bold" />
                  )}
                </div>
              )}
            </div>
            {isSubmitted && !isFormCorrect(infinitiveInput, currentVerb.infinitive, currentVerb.infinitiveAlts) && (
              <div className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                Correcto: <span className="underline">{currentVerb.infinitive}</span>
              </div>
            )}
          </div>

          {/* 2. Pasado Simple */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              2. Pasado (Past Simple)
            </label>
            <div className="relative">
              <input
                ref={pastSimpleRef}
                type="text"
                autoComplete="off"
                spellCheck="false"
                disabled={isSubmitted}
                value={pastSimpleInput}
                onChange={e => setPastSimpleInput(e.target.value)}
                onKeyDown={e => handleKeyDown(e, 'past')}
                placeholder="ej. sang"
                className={`w-full px-4 py-3 rounded-2xl text-lg font-bold border-2 transition-all outline-none ${
                  isSubmitted
                    ? isFormCorrect(pastSimpleInput, currentVerb.pastSimple, currentVerb.pastSimpleAlts)
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900'
                      : 'border-rose-400 bg-rose-50/50 text-rose-900'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-slate-50/40 text-slate-800'
                }`}
              />
              {isSubmitted && (
                <div className="absolute right-3 top-3.5">
                  {isFormCorrect(pastSimpleInput, currentVerb.pastSimple, currentVerb.pastSimpleAlts) ? (
                    <Check className="w-5 h-5 text-emerald-600 font-bold" />
                  ) : (
                    <X className="w-5 h-5 text-rose-500 font-bold" />
                  )}
                </div>
              )}
            </div>
            {isSubmitted && !isFormCorrect(pastSimpleInput, currentVerb.pastSimple, currentVerb.pastSimpleAlts) && (
              <div className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                Correcto: <span className="underline">{currentVerb.pastSimple}</span>
              </div>
            )}
          </div>

          {/* 3. Participio Pasado */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              3. Participio (Past Participle)
            </label>
            <div className="relative">
              <input
                ref={pastParticipleRef}
                type="text"
                autoComplete="off"
                spellCheck="false"
                disabled={isSubmitted}
                value={pastParticipleInput}
                onChange={e => setPastParticipleInput(e.target.value)}
                onKeyDown={e => handleKeyDown(e, 'part')}
                placeholder="ej. sung"
                className={`w-full px-4 py-3 rounded-2xl text-lg font-bold border-2 transition-all outline-none ${
                  isSubmitted
                    ? isFormCorrect(pastParticipleInput, currentVerb.pastParticiple, currentVerb.pastParticipleAlts)
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900'
                      : 'border-rose-400 bg-rose-50/50 text-rose-900'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-slate-50/40 text-slate-800'
                }`}
              />
              {isSubmitted && (
                <div className="absolute right-3 top-3.5">
                  {isFormCorrect(pastParticipleInput, currentVerb.pastParticiple, currentVerb.pastParticipleAlts) ? (
                    <Check className="w-5 h-5 text-emerald-600 font-bold" />
                  ) : (
                    <X className="w-5 h-5 text-rose-500 font-bold" />
                  )}
                </div>
              )}
            </div>
            {isSubmitted && !isFormCorrect(pastParticipleInput, currentVerb.pastParticiple, currentVerb.pastParticipleAlts) && (
              <div className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                Correcto: <span className="underline">{currentVerb.pastParticiple}</span>
              </div>
            )}
          </div>
        </div>

        {/* Example sentence when submitted */}
        {isSubmitted && currentVerb.example && (
          <div className="mb-6 bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-sm animate-pop">
            <div className="text-xs font-bold uppercase text-indigo-700 tracking-wider mb-1 flex items-center gap-1.5">
              <span>Ejemplo de uso</span>
            </div>
            <p className="font-semibold text-slate-800 italic">"{currentVerb.example}"</p>
            {currentVerb.exampleEs && (
              <p className="text-xs text-slate-500 mt-0.5">{currentVerb.exampleEs}</p>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {!isSubmitted ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUseHint}
                  disabled={hintUsed}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all disabled:opacity-50"
                  title="Muestra la primera letra de cada forma"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>{hintUsed ? 'Pista activa' : 'Dame una pista'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleGiveUp}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                  title="Mostrar respuestas"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>No me acuerdo</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCheck}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all text-sm flex items-center gap-2"
              >
                <span>Comprobar</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">Enter</span>
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                onClick={handleSpeak}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2.5 rounded-xl transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Repetir audio</span>
              </button>

              <button
                ref={nextBtnRef}
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all text-sm flex items-center gap-2 ml-auto"
              >
                <span>{currentIndex + 1 < verbs.length ? 'Siguiente Verbo' : 'Ver Resultados'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
