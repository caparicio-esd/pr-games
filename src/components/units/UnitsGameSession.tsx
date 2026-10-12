import React, { useState, useRef, useEffect } from 'react';
import { UnitProblem, UnitAttempt, UnitSettings, UnitSessionMode } from '../../types/units';
import { generateUnitProblem, isAnswerCorrect } from '../../utils/unitsGenerator';
import { audio } from '../../utils/audio';
import { Flame, Star, Timer, RotateCcw, Check, X, Delete, ArrowRight, HelpCircle } from 'lucide-react';
import { UnitsLadderModal } from './UnitsLadderModal';

interface UnitsGameSessionProps {
  settings: UnitSettings;
  mode: UnitSessionMode;
  onFinish: (attempts: UnitAttempt[], highestStreak: number, score: number) => void;
  onQuit: () => void;
}

export const UnitsGameSession: React.FC<UnitsGameSessionProps> = ({
  settings,
  mode,
  onFinish,
  onQuit,
}) => {
  const [problems, setProblems] = useState<UnitProblem[]>(() => {
    const count = mode === 'sprint' ? 50 : settings.blockSize;
    return Array.from({ length: count }, () => generateUnitProblem(settings.level, settings.filter));
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState<UnitAttempt[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [isLadderOpen, setIsLadderOpen] = useState(false);

  // Status for feedback
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showMistakeBanner, setShowMistakeBanner] = useState(false);

  // Sprint timer (60s)
  const [timeLeft, setTimeLeft] = useState(60);
  const startTimeRef = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const currentProblem = problems[currentIndex];

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex, feedbackStatus]);

  // Sprint countdown timer
  useEffect(() => {
    if (mode !== 'sprint') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, attempts, highestStreak, score]);

  const handleTimeUp = () => {
    audio.playFanfare();
    onFinish(attempts, highestStreak, score);
  };

  const submitAnswer = () => {
    if (!currentProblem || feedbackStatus !== 'idle') return;
    if (userAnswer.trim() === '') return;

    const timeTaken = Date.now() - startTimeRef.current;
    const isCorrect = isAnswerCorrect(userAnswer, currentProblem.expectedAnswer);

    const newAttempt: UnitAttempt = {
      problem: currentProblem,
      userAnswer: userAnswer.trim(),
      isCorrect,
      timeTakenMs: timeTaken,
    };

    const newAttempts = [...attempts, newAttempt];
    setAttempts(newAttempts);

    if (isCorrect) {
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      if (nextStreak > highestStreak) {
        setHighestStreak(nextStreak);
      }

      // Bonus points with streak
      const streakMultiplier = Math.min(3, 1 + Math.floor(nextStreak / 3));
      const points = 10 * streakMultiplier;
      setScore(prev => prev + points);

      if (nextStreak > 0 && nextStreak % 5 === 0) {
        audio.playStreak();
      } else {
        audio.playCorrect();
      }

      setFeedbackStatus('correct');

      // Auto-advance
      setTimeout(() => {
        advanceNext(newAttempts, nextStreak > highestStreak ? nextStreak : highestStreak);
      }, 420);
    } else {
      audio.playIncorrect();
      setCurrentStreak(0);
      setFeedbackStatus('wrong');
      setShowMistakeBanner(true);
    }
  };

  const advanceNext = (currentAttemptsList: UnitAttempt[], currentBestStreak: number) => {
    setFeedbackStatus('idle');
    setShowMistakeBanner(false);
    setUserAnswer('');
    startTimeRef.current = Date.now();

    const nextIndex = currentIndex + 1;
    if (mode === 'block' && nextIndex >= settings.blockSize) {
      onFinish(currentAttemptsList, currentBestStreak, score);
    } else {
      // In sprint or if more problems needed, ensure buffer
      if (nextIndex >= problems.length) {
        setProblems(prev => [...prev, generateUnitProblem(settings.level, settings.filter)]);
      }
      setCurrentIndex(nextIndex);
    }
  };

  // Keyboard listener
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showMistakeBanner) {
        advanceNext(attempts, highestStreak);
      } else {
        submitAnswer();
      }
    }
  };

  // Virtual Keypad handlers
  const handleKeypadPress = (val: string) => {
    if (feedbackStatus !== 'idle' && !showMistakeBanner) return;
    if (showMistakeBanner) return;

    if (val === 'backspace') {
      setUserAnswer(prev => prev.slice(0, -1));
    } else if (val === '.' || val === ',') {
      // Allow only one decimal separator
      if (!userAnswer.includes('.') && !userAnswer.includes(',')) {
        setUserAnswer(prev => prev + ',');
      }
    } else {
      if (userAnswer.length < 10) {
        setUserAnswer(prev => prev + val);
      }
    }
  };

  const getMagnitudeBadge = (mag: string) => {
    switch (mag) {
      case 'length': return { label: 'Longitud', icon: '📏', color: 'bg-blue-100 text-blue-800' };
      case 'mass': return { label: 'Masa', icon: '⚖️', color: 'bg-amber-100 text-amber-800' };
      case 'capacity': return { label: 'Capacidad', icon: '🥤', color: 'bg-cyan-100 text-cyan-800' };
      case 'area': return { label: 'Superficie', icon: '🟩', color: 'bg-emerald-100 text-emerald-800' };
      case 'volume': return { label: 'Volumen', icon: '🧊', color: 'bg-indigo-100 text-indigo-800' };
      case 'time': return { label: 'Tiempo', icon: '⏱️', color: 'bg-orange-100 text-orange-800' };
      default: return { label: 'Unidad', icon: '📐', color: 'bg-slate-100 text-slate-800' };
    }
  };

  const badge = currentProblem ? getMagnitudeBadge(currentProblem.magnitude) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-pop">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onQuit}
          className="text-xs font-extrabold text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Salir</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Ladder modal button */}
          <button
            onClick={() => setIsLadderOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-black transition-all active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Chuleta</span>
          </button>

          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{currentStreak}</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-black">
            <Star className="w-4 h-4 fill-teal-400 text-teal-500" />
            <span>{score}</span>
          </div>

          {/* Mode info: Timer or Counter */}
          {mode === 'sprint' ? (
            <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black border ${
              timeLeft <= 10
                ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-black">
              {currentIndex + 1} / {settings.blockSize}
            </div>
          )}
        </div>
      </div>

      {/* Main Question Card */}
      {currentProblem && (
        <div className={`bg-white rounded-3xl p-6 sm:p-10 border-2 transition-all shadow-xl shadow-slate-100 ${
          feedbackStatus === 'correct'
            ? 'border-emerald-400 ring-4 ring-emerald-100'
            : feedbackStatus === 'wrong'
            ? 'border-rose-400 ring-4 ring-rose-100'
            : 'border-slate-100'
        }`}>
          {/* Magnitude indicator */}
          <div className="flex items-center justify-between mb-6">
            {badge && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${badge.color}`}>
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </span>
            )}
            <span className="text-xs font-bold text-slate-400">
              Nivel {settings.level}
            </span>
          </div>

          {/* The Conversion Statement */}
          <div className="text-center space-y-4 my-4">
            <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Convierte a la unidad pedida:
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-3xl sm:text-5xl font-black text-slate-800">
              {/* Origin */}
              <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200 flex items-baseline gap-1.5">
                <span className="text-teal-700">{currentProblem.fromValue}</span>
                <span className="text-xl sm:text-2xl text-slate-600 font-extrabold">{currentProblem.fromUnit}</span>
              </div>

              <span className="text-slate-400 font-light">=</span>

              {/* Destination Input Box */}
              <div className="flex items-baseline gap-2">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={feedbackStatus !== 'idle'}
                    placeholder="?"
                    className={`w-32 sm:w-44 text-center px-3 py-2 bg-white rounded-2xl border-2 font-black text-3xl sm:text-5xl outline-none transition-all ${
                      feedbackStatus === 'correct'
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800'
                        : feedbackStatus === 'wrong'
                        ? 'border-rose-500 bg-rose-50/50 text-rose-800'
                        : 'border-teal-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 text-slate-900'
                    }`}
                  />
                  {feedbackStatus === 'correct' && (
                    <div className="absolute -right-3 -top-3 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md animate-pop">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                  {feedbackStatus === 'wrong' && (
                    <div className="absolute -right-3 -top-3 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md animate-pop">
                      <X className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                <span className="text-xl sm:text-3xl text-teal-700 font-extrabold">
                  {currentProblem.toUnit}
                </span>
              </div>
            </div>
          </div>

          {/* Explanation on Mistake */}
          {showMistakeBanner && (
            <div className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-3 animate-pop">
              <div className="text-sm font-black text-rose-900">
                ¡Casi! La respuesta correcta es:{' '}
                <span className="text-base underline font-black text-emerald-700">
                  {currentProblem.formattedExpected} {currentProblem.toUnit}
                </span>
              </div>
              <p className="text-xs text-rose-800 font-medium">
                💡 <span className="font-bold">Pista:</span> {currentProblem.hintExplanation}
              </p>
              <button
                onClick={() => advanceNext(attempts, highestStreak)}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 mx-auto active:scale-95 transition-all shadow-sm"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Submit Action for Desktop when typing */}
          {!showMistakeBanner && (
            <div className="mt-6 text-center">
              <button
                onClick={submitAnswer}
                disabled={userAnswer.trim() === '' || feedbackStatus !== 'idle'}
                className="px-8 py-3.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-2xl text-sm shadow-md shadow-teal-200 active:scale-95 transition-all"
              >
                Comprobar Respuesta ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* On-Screen Touch Keypad (with comma and backspace) */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm max-w-sm mx-auto">
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeypadPress(num)}
              className="py-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-800 text-xl font-black transition-all active:scale-95"
            >
              {num}
            </button>
          ))}

          {/* Decimal separator ',' */}
          <button
            onClick={() => handleKeypadPress(',')}
            className="py-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-800 text-2xl font-black transition-all active:scale-95"
          >
            ,
          </button>

          {/* Zero */}
          <button
            onClick={() => handleKeypadPress('0')}
            className="py-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-800 text-xl font-black transition-all active:scale-95"
          >
            0
          </button>

          {/* Backspace */}
          <button
            onClick={() => handleKeypadPress('backspace')}
            className="py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 flex items-center justify-center transition-all active:scale-95"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Floating Helper Ladder Modal */}
      <UnitsLadderModal
        isOpen={isLadderOpen}
        onClose={() => setIsLadderOpen(false)}
      />
    </div>
  );
};
