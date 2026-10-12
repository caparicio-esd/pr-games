import React, { useState, useRef, useEffect } from 'react';
import { MultiProblem, MultiAttempt, MultiSettings, MultiSessionMode } from '../../types/math/../multiplication';
import { audio } from '../../utils/audio';
import { Flame, Star, Timer, RotateCcw, Check, X, Delete, ArrowRight } from 'lucide-react';

interface MultiGameSessionProps {
  settings: MultiSettings;
  mode: MultiSessionMode;
  onFinish: (attempts: MultiAttempt[], highestStreak: number, score: number) => void;
  onQuit: () => void;
}

export const MultiGameSession: React.FC<MultiGameSessionProps> = ({
  settings,
  mode,
  onFinish,
  onQuit,
}) => {
  // Generate problems generator
  const generateProblem = (idx: number): MultiProblem => {
    const table = settings.selectedTables[Math.floor(Math.random() * settings.selectedTables.length)];
    let factorB: number;

    if (settings.questionMode === 'sequential') {
      factorB = (idx % 12) + 1;
    } else {
      factorB = Math.floor(Math.random() * 12) + 1;
    }

    const result = table * factorB;
    let blankPosition: 'result' | 'factorA' | 'factorB' = 'result';

    if (settings.questionMode === 'missing_factor') {
      blankPosition = Math.random() < 0.5 ? 'factorA' : 'factorB';
    }

    let expectedAnswer = result;
    if (blankPosition === 'factorA') expectedAnswer = table;
    if (blankPosition === 'factorB') expectedAnswer = factorB;

    return {
      id: `mul_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      factorA: table,
      factorB,
      result,
      blankPosition,
      expectedAnswer,
      tableNumber: table,
    };
  };

  const [problems, setProblems] = useState<MultiProblem[]>(() => {
    const count = mode === 'sprint' ? 50 : settings.blockSize;
    return Array.from({ length: count }, (_, i) => generateProblem(i));
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<MultiAttempt[]>([]);
  const [userInput, setUserInput] = useState('');
  
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);

  const problemStartTimeRef = useRef<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentProblem = problems[currentIndex];

  useEffect(() => {
    inputRef.current?.focus();
    problemStartTimeRef.current = Date.now();
  }, [currentIndex]);

  // Sprint timer
  useEffect(() => {
    if (mode !== 'sprint') return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  const handleTimeUp = () => {
    audio.playFanfare();
    onFinish(attempts, highestStreak, score);
  };

  const evaluateAnswer = (val: string) => {
    if (!val.trim()) return;
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) return;

    const elapsed = Date.now() - problemStartTimeRef.current;
    const isCorrect = parsed === currentProblem.expectedAnswer;

    let newStreak = streak;
    let earnedPoints = 0;

    if (isCorrect) {
      newStreak = streak + 1;
      earnedPoints = 1;
      if (newStreak >= 3) {
        earnedPoints += Math.min(newStreak, 4);
      }
      setScore(prev => prev + earnedPoints);
      setStreak(newStreak);
      if (newStreak > highestStreak) {
        setHighestStreak(newStreak);
      }

      if (newStreak >= 5) {
        audio.playStreak();
      } else {
        audio.playCorrect();
      }
      setLastFeedback('correct');
    } else {
      setStreak(0);
      audio.playIncorrect();
      setLastFeedback('wrong');
    }

    const attempt: MultiAttempt = {
      problem: currentProblem,
      userAnswer: parsed,
      isCorrect,
      timeTakenMs: elapsed,
    };

    const newAttempts = [...attempts, attempt];
    setAttempts(newAttempts);

    setTimeout(() => {
      setUserInput('');
      setLastFeedback(null);

      if (mode === 'sprint') {
        if (currentIndex + 5 >= problems.length) {
          const extra = Array.from({ length: 20 }, (_, i) => generateProblem(currentIndex + i + 1));
          setProblems(prev => [...prev, ...extra]);
        }
        setCurrentIndex(prev => prev + 1);
      } else {
        if (currentIndex + 1 < settings.blockSize) {
          setCurrentIndex(prev => prev + 1);
        } else {
          audio.playFanfare();
          onFinish(newAttempts, Math.max(highestStreak, newStreak), score + earnedPoints);
        }
      }
    }, isCorrect ? 150 : 650);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setUserInput(val);

    if (val && parseInt(val, 10) === currentProblem.expectedAnswer) {
      evaluateAnswer(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      evaluateAnswer(userInput);
    }
  };

  const handleKeypadPress = (key: string) => {
    if (key === 'del') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (key === 'ok') {
      evaluateAnswer(userInput);
    } else {
      const nextVal = userInput + key;
      setUserInput(nextVal);
      if (parseInt(nextVal, 10) === currentProblem.expectedAnswer) {
        evaluateAnswer(nextVal);
      }
    }
    inputRef.current?.focus();
  };

  const progressPercent = mode === 'sprint'
    ? Math.round(((60 - timeLeft) / 60) * 100)
    : Math.round(((currentIndex) / settings.blockSize) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Top info bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onQuit}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            title="Salir"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {mode === 'sprint' ? 'Sprint 60s' : `Tabla del ${currentProblem.tableNumber}`}
            </div>
            <div className="text-sm font-extrabold text-slate-700">
              {mode === 'sprint' ? (
                <span className="flex items-center gap-1.5 text-orange-600">
                  <Timer className="w-4 h-4 animate-spin" /> {timeLeft}s restantes
                </span>
              ) : (
                <>Multiplicación {currentIndex + 1} <span className="text-slate-400 font-semibold">de {settings.blockSize}</span></>
              )}
            </div>
          </div>
        </div>

        {/* Streak & Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60">
            <Flame className={`w-5 h-5 ${streak > 0 ? 'text-amber-500 fill-amber-500 animate-wiggle' : 'text-slate-300'}`} />
            <div className="text-xs font-bold text-amber-800">
              Racha: <span className="text-sm font-black">{streak}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-orange-50 px-3.5 py-1.5 rounded-xl border border-orange-200/60">
            <Star className="w-5 h-5 text-orange-500 fill-orange-400" />
            <div className="text-xs font-bold text-orange-800">
              Puntos: <span className="text-sm font-black">{score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/70 h-2.5 rounded-full overflow-hidden mb-6 shadow-inner">
        <div
          className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Card */}
      <div className={`bg-white rounded-3xl p-8 sm:p-12 shadow-xl border transition-all text-center relative overflow-hidden ${
        lastFeedback === 'correct'
          ? 'border-emerald-300 ring-4 ring-emerald-100'
          : lastFeedback === 'wrong'
          ? 'border-rose-300 ring-4 ring-rose-100'
          : 'border-slate-100'
      }`}>
        <div className="inline-block mb-4">
          <span className="text-xs font-black uppercase tracking-wider text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            {settings.questionMode === 'missing_factor' ? 'Factor Misterioso' : `Tabla del ${currentProblem.tableNumber}`}
          </span>
        </div>

        {/* Big Equation */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 my-4 select-none">
          {/* Factor A */}
          {currentProblem.blankPosition === 'factorA' ? (
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="?"
              className="w-24 sm:w-32 h-20 sm:h-24 text-center text-4xl sm:text-6xl font-black rounded-3xl border-4 border-orange-400 bg-orange-50/40 text-orange-950 outline-none"
            />
          ) : (
            <span className="text-5xl sm:text-7xl font-black text-slate-800 tracking-tight">
              {currentProblem.factorA}
            </span>
          )}

          <span className="text-4xl sm:text-6xl font-black text-orange-500">
            ×
          </span>

          {/* Factor B */}
          {currentProblem.blankPosition === 'factorB' ? (
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="?"
              className="w-24 sm:w-32 h-20 sm:h-24 text-center text-4xl sm:text-6xl font-black rounded-3xl border-4 border-orange-400 bg-orange-50/40 text-orange-950 outline-none"
            />
          ) : (
            <span className="text-5xl sm:text-7xl font-black text-slate-800 tracking-tight">
              {currentProblem.factorB}
            </span>
          )}

          <span className="text-4xl sm:text-6xl font-black text-slate-400">
            =
          </span>

          {/* Result */}
          {currentProblem.blankPosition === 'result' ? (
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="?"
                className={`w-28 sm:w-36 h-20 sm:h-24 text-center text-4xl sm:text-6xl font-black rounded-3xl border-4 outline-none transition-all ${
                  lastFeedback === 'correct'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : lastFeedback === 'wrong'
                    ? 'border-rose-500 bg-rose-50 text-rose-800'
                    : 'border-orange-400 focus:border-orange-600 bg-orange-50/40 text-orange-950 shadow-inner'
                }`}
              />

              {lastFeedback === 'correct' && (
                <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-1.5 shadow-md animate-pop">
                  <Check className="w-5 h-5 font-bold" />
                </div>
              )}
              {lastFeedback === 'wrong' && (
                <div className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full p-1.5 shadow-md animate-pop">
                  <X className="w-5 h-5 font-bold" />
                </div>
              )}
            </div>
          ) : (
            <span className="text-5xl sm:text-7xl font-black text-slate-800 tracking-tight">
              {currentProblem.result}
            </span>
          )}
        </div>

        {lastFeedback === 'wrong' && (
          <div className="mt-4 text-sm font-extrabold text-rose-600 animate-pop">
            ¡El resultado era <span className="underline text-lg font-black">{currentProblem.expectedAnswer}</span>!
          </div>
        )}

        <p className="text-xs text-slate-400 mt-4">
          Escribe la respuesta (avanza automáticamente al acertar o pulsa <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">Enter</span>)
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => evaluateAnswer('0')}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all"
          >
            No me acuerdo, pasar ➔
          </button>
        </div>
      </div>

      {/* On-screen keypad */}
      <div className="mt-6 max-w-sm mx-auto bg-white p-3 rounded-3xl border border-slate-100 shadow-sm">
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeypadPress(num)}
              className="py-3.5 bg-slate-50 hover:bg-orange-50 text-slate-800 hover:text-orange-700 font-black text-xl rounded-2xl active:scale-95 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleKeypadPress('del')}
            className="py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-sm"
            title="Borrar"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleKeypadPress('0')}
            className="py-3.5 bg-slate-50 hover:bg-orange-50 text-slate-800 hover:text-orange-700 font-black text-xl rounded-2xl active:scale-95 transition-all shadow-sm"
          >
            0
          </button>
          <button
            onClick={() => handleKeypadPress('ok')}
            className="py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-sm"
            title="Enviar"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
