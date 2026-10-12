import { useState, useEffect } from 'react';
import { VERBS_DATA } from './data/verbs';
import { Verb, VerbAttempt, RoundSessionSummary, UserSettings, Achievement } from './types';
import { MathSettings, MathGameMode, MathAttempt, MathSessionSummary } from './types/math';
import { storage } from './services/storage';
import { mathStorage } from './services/mathStorage';
import { audio } from './utils/audio';

// Hub
import { SuiteHub } from './components/SuiteHub';

// Verbs Game Components
import { Header } from './components/Header';
import { GameSession } from './components/GameSession';
import { RoundSummary } from './components/RoundSummary';
import { StatsView } from './components/StatsView';
import { DictionaryView } from './components/DictionaryView';
import { SettingsModal } from './components/SettingsModal';
import { Play, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

// Math Game Components
import { MathLobby } from './components/math/MathLobby';
import { MathGameSession } from './components/math/MathGameSession';
import { MathSummary } from './components/math/MathSummary';
import { MathStatsView } from './components/math/MathStatsView';

export function App() {
  // Global suite navigation: 'hub' (landing page) | 'verbs' | 'math'
  const [activeGame, setActiveGame] = useState<'hub' | 'verbs' | 'math'>('hub');

  // ==========================================
  // VERBS GAME STATE
  // ==========================================
  const [verbTab, setVerbTab] = useState<'game' | 'weak' | 'dict' | 'stats'>('game');
  const [verbSettings, setVerbSettings] = useState<UserSettings>(() => storage.getSettings());
  const [verbSessions, setVerbSessions] = useState<RoundSessionSummary[]>(() => storage.getSessions());
  const [verbStats, setVerbStats] = useState(() => storage.getVerbStats());
  const [verbAchievements, setVerbAchievements] = useState<Achievement[]>(() => storage.getAchievements());
  const [isVerbSettingsOpen, setIsVerbSettingsOpen] = useState(false);

  const [activeRoundVerbs, setActiveRoundVerbs] = useState<Verb[] | null>(null);
  const [activeRoundTitle, setActiveRoundTitle] = useState('Ronda de Verbos');
  const [completedVerbSummary, setCompletedVerbSummary] = useState<RoundSessionSummary | null>(null);

  // ==========================================
  // MATH GAME STATE
  // ==========================================
  const [mathSettings, setMathSettings] = useState<MathSettings>(() => mathStorage.getSettings());
  const [isMathActive, setIsMathActive] = useState(false);
  const [mathMode, setMathMode] = useState<MathGameMode>('block');
  const [mathSummary, setMathSummary] = useState<MathSessionSummary | null>(null);
  const [isMathStatsOpen, setIsMathStatsOpen] = useState(false);

  // Sync sound setting
  useEffect(() => {
    audio.setSoundEnabled(verbSettings.soundEnabled);
  }, [verbSettings.soundEnabled]);

  const difficultVerbIds = storage.getDifficultVerbIds();

  // Helper shuffle
  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Start Verb round
  const startVerbRound = (customVerbs?: Verb[], customTitle?: string) => {
    let pool: Verb[];
    if (customVerbs && customVerbs.length > 0) {
      pool = customVerbs;
    } else {
      let filtered = VERBS_DATA;
      if (verbSettings.levelFilter !== 'all') {
        filtered = VERBS_DATA.filter(v => v.level === verbSettings.levelFilter);
      }
      pool = filtered;
    }

    const shuffled = shuffle(pool);
    const count = verbSettings.roundSize > 0 ? Math.min(verbSettings.roundSize, shuffled.length) : shuffled.length;
    const selected = shuffled.slice(0, count);

    setActiveRoundTitle(customTitle || `Ronda de ${selected.length} Verbos`);
    setActiveRoundVerbs(selected);
    setCompletedVerbSummary(null);
    setVerbTab('game');
  };

  const startPracticingDifficultVerbs = (idsToPractice?: string[]) => {
    const targetIds = idsToPractice || difficultVerbIds;
    const targetVerbs = VERBS_DATA.filter(v => targetIds.includes(v.id));

    if (targetVerbs.length === 0) {
      alert('¡Excelente noticia! No tienes ningún verbo con fallos pendiente.');
      return;
    }

    startVerbRound(targetVerbs, `Refuerzo de ${targetVerbs.length} Verbos Difíciles`);
  };

  const handleFinishVerbRound = (attempts: VerbAttempt[], highestStreak: number, score: number) => {
    const total = attempts.length;
    const perfectCount = attempts.filter(a => a.allCorrect).length;
    const accuracy = total > 0 ? Math.round((perfectCount / total) * 100) : 0;
    const maxScore = total * 3;

    const summary: RoundSessionSummary = {
      id: 'session_' + Date.now(),
      timestamp: Date.now(),
      totalVerbs: total,
      score,
      maxScore,
      accuracy,
      perfectVerbsCount: perfectCount,
      highestStreak,
      attempts,
    };

    storage.saveSession(summary);
    setVerbSessions(storage.getSessions());
    setVerbStats(storage.getVerbStats());
    setVerbAchievements(storage.getAchievements());

    setCompletedVerbSummary(summary);
    setActiveRoundVerbs(null);
  };

  // ==========================================
  // MATH HANDLERS
  // ==========================================
  const handleStartMath = (mode: MathGameMode) => {
    setMathMode(mode);
    setIsMathActive(true);
    setMathSummary(null);
    setIsMathStatsOpen(false);
  };

  const handleFinishMath = (attempts: MathAttempt[], highestStreak: number, score: number) => {
    const total = attempts.length;
    const correctCount = attempts.filter(a => a.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const totalTimeMs = attempts.reduce((sum, a) => sum + a.timeTakenMs, 0);
    const avgTimePerProblemMs = total > 0 ? Math.round(totalTimeMs / total) : 0;

    const summary: MathSessionSummary = {
      id: 'math_' + Date.now(),
      timestamp: Date.now(),
      level: mathSettings.level,
      opType: mathSettings.opType,
      mode: mathMode,
      totalProblems: total,
      correctCount,
      accuracy,
      score,
      highestStreak,
      avgTimePerProblemMs,
      attempts,
    };

    mathStorage.saveSession(summary);
    setMathSummary(summary);
    setIsMathActive(false);
  };

  const handleUpdateMathSettings = (newSettings: MathSettings) => {
    setMathSettings(newSettings);
    mathStorage.saveSettings(newSettings);
  };

  const totalVerbScore = verbSessions.reduce((sum, s) => sum + s.score, 0);
  const totalVerbMastered = Object.values(verbStats).filter(
    s => (s.timesFlawless >= 2 && s.timesFailed === 0) || s.timesFlawless >= 3
  ).length;

  return (
    <div className="min-h-screen flex flex-col font-['Nunito',sans-serif]">
      {/* 1. SUITE LANDING PAGE */}
      {activeGame === 'hub' && (
        <SuiteHub
          onSelectGame={game => {
            setActiveGame(game);
            if (game === 'verbs') {
              setCompletedVerbSummary(null);
              setActiveRoundVerbs(null);
            } else if (game === 'math') {
              setIsMathActive(false);
              setMathSummary(null);
              setIsMathStatsOpen(false);
            }
          }}
        />
      )}

      {/* 2. VERBS GAME VIEW */}
      {activeGame === 'verbs' && (
        <>
          <Header
            currentTab={verbTab}
            onSelectTab={tab => {
              if (tab === 'weak') {
                startPracticingDifficultVerbs();
              } else {
                setVerbTab(tab);
              }
            }}
            onOpenSettings={() => setIsVerbSettingsOpen(true)}
            difficultCount={difficultVerbIds.length}
            soundEnabled={verbSettings.soundEnabled}
            onToggleSound={() => {
              const updated = { ...verbSettings, soundEnabled: !verbSettings.soundEnabled };
              setVerbSettings(updated);
              storage.saveSettings(updated);
            }}
            onBackToHub={() => setActiveGame('hub')}
          />

          <main className="flex-1 pb-16">
            {verbTab === 'game' && (
              <>
                {/* Active round */}
                {activeRoundVerbs && (
                  <GameSession
                    verbs={activeRoundVerbs}
                    settings={verbSettings}
                    sessionTitle={activeRoundTitle}
                    onFinishRound={handleFinishVerbRound}
                    onQuit={() => {
                      if (window.confirm('¿Salir de la ronda?')) {
                        setActiveRoundVerbs(null);
                      }
                    }}
                  />
                )}

                {/* Round summary */}
                {!activeRoundVerbs && completedVerbSummary && (
                  <RoundSummary
                    summary={completedVerbSummary}
                    onPlayAgain={() => startVerbRound()}
                    onPracticeMistakes={mistakes => {
                      const mistakeVerbs = mistakes.map(a => a.verb);
                      startVerbRound(mistakeVerbs, `Repaso de ${mistakeVerbs.length} Fallos`);
                    }}
                    onViewStats={() => {
                      setCompletedVerbSummary(null);
                      setVerbTab('stats');
                    }}
                  />
                )}

                {/* Lobby */}
                {!activeRoundVerbs && !completedVerbSummary && (
                  <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-pop">
                    {/* Hero Greeting */}
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                      <div className="relative z-10 max-w-xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-4">
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          ¡Aprende Jugando!
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3">
                          Domina los Verbos Irregulares
                        </h2>
                        <p className="text-indigo-100 font-semibold text-base sm:text-lg mb-6">
                          Rellena el presente, pasado y participio en cada tarjeta. ¡Acumula puntos, supera tu racha y desbloquea medallas!
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => startVerbRound()}
                            className="px-7 py-4 bg-white text-indigo-700 hover:bg-yellow-300 hover:text-indigo-950 font-black rounded-2xl shadow-lg transition-all text-base flex items-center gap-2.5 active:scale-95"
                          >
                            <Play className="w-5 h-5 fill-current" />
                            <span>¡Empezar Ronda ({verbSettings.roundSize > 0 ? `${verbSettings.roundSize} verbos` : 'Todos'})!</span>
                          </button>

                          {difficultVerbIds.length > 0 && (
                            <button
                              onClick={() => startPracticingDifficultVerbs()}
                              className="px-5 py-4 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-2xl shadow-lg transition-all text-sm flex items-center gap-2 active:scale-95"
                            >
                              <AlertCircle className="w-4 h-4" />
                              <span>Repasar {difficultVerbIds.length} Fallos</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="absolute right-10 top-8 text-8xl opacity-15 select-none font-black pointer-events-none">
                        ⚡
                      </div>
                    </div>

                    {/* Stats ribbon */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <div className="text-2xl sm:text-3xl font-black text-indigo-600">
                          {verbSessions.length}
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                          Rondas Jugadas
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <div className="text-2xl sm:text-3xl font-black text-amber-500">
                          {totalVerbScore}
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                          Puntos Ganados
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                          {totalVerbMastered}
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                          Verbos Dominados
                        </div>
                      </div>
                    </div>

                    {/* Levels shortcuts */}
                    <div className="space-y-3">
                      <h3 className="text-base font-extrabold text-slate-700 uppercase tracking-wider">
                        Modos Rápidos por Nivel
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div
                          onClick={() => {
                            const easy = VERBS_DATA.filter(v => v.level === 'easy');
                            startVerbRound(easy, 'Nivel Básico (Esenciales)');
                          }}
                          className="p-4 bg-white rounded-3xl border border-slate-100 hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all group"
                        >
                          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-3">
                            🌱
                          </div>
                          <h4 className="font-extrabold text-slate-800 text-sm">Nivel Básico</h4>
                          <p className="text-xs text-slate-400 font-medium mt-1">Los verbos más usados y frecuentes en clase.</p>
                        </div>

                        <div
                          onClick={() => {
                            const med = VERBS_DATA.filter(v => v.level === 'medium');
                            startVerbRound(med, 'Nivel Intermedio');
                          }}
                          className="p-4 bg-white rounded-3xl border border-slate-100 hover:border-amber-300 hover:shadow-md cursor-pointer transition-all group"
                        >
                          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black mb-3">
                            ⚡
                          </div>
                          <h4 className="font-extrabold text-slate-800 text-sm">Nivel Intermedio</h4>
                          <p className="text-xs text-slate-400 font-medium mt-1">Verbos muy comunes con formas interesantes.</p>
                        </div>

                        <div
                          onClick={() => {
                            const hard = VERBS_DATA.filter(v => v.level === 'hard');
                            startVerbRound(hard, 'Nivel Avanzado');
                          }}
                          className="p-4 bg-white rounded-3xl border border-slate-100 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all group"
                        >
                          <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black mb-3">
                            👑
                          </div>
                          <h4 className="font-extrabold text-slate-800 text-sm">Nivel Avanzado</h4>
                          <p className="text-xs text-slate-400 font-medium mt-1">Verbos irregulares especiales para expertas.</p>
                        </div>
                      </div>
                    </div>

                    {/* Dictionary shortcut */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                        <div>
                          <div className="text-xs font-extrabold text-slate-800">¿Quieres consultar los verbos antes de jugar?</div>
                          <div className="text-[11px] text-slate-400 font-medium">Revisa el diccionario con audio y ejemplos</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setVerbTab('dict')}
                        className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-all"
                      >
                        Abrir Diccionario ➔
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {verbTab === 'dict' && (
              <DictionaryView verbs={VERBS_DATA} />
            )}

            {verbTab === 'stats' && (
              <StatsView
                sessions={verbSessions}
                verbStats={verbStats}
                achievements={verbAchievements}
                allVerbs={VERBS_DATA}
                onPracticeDifficult={ids => startPracticingDifficultVerbs(ids)}
                onStartNewRound={() => {
                  setVerbTab('game');
                  startVerbRound();
                }}
              />
            )}
          </main>

          <SettingsModal
            isOpen={isVerbSettingsOpen}
            onClose={() => setIsVerbSettingsOpen(false)}
            settings={verbSettings}
            onUpdateSettings={s => {
              setVerbSettings(s);
              storage.saveSettings(s);
            }}
            onResetData={() => {
              storage.resetAllData();
              setVerbSessions([]);
              setVerbStats({});
              setVerbAchievements(storage.getAchievements());
            }}
          />
        </>
      )}

      {/* 3. MATH GAME VIEW */}
      {activeGame === 'math' && (
        <main className="flex-1 pb-16">
          {isMathActive ? (
            <MathGameSession
              settings={mathSettings}
              mode={mathMode}
              onFinish={handleFinishMath}
              onQuit={() => {
                if (window.confirm('¿Salir del juego de cálculo mental?')) {
                  setIsMathActive(false);
                }
              }}
            />
          ) : mathSummary ? (
            <MathSummary
              summary={mathSummary}
              onPlayAgain={() => handleStartMath(mathMode)}
              onViewStats={() => {
                setMathSummary(null);
                setIsMathStatsOpen(true);
              }}
              onBackToHub={() => setActiveGame('hub')}
            />
          ) : isMathStatsOpen ? (
            <MathStatsView
              onBackToLobby={() => setIsMathStatsOpen(false)}
              onStartGame={() => handleStartMath('block')}
            />
          ) : (
            <MathLobby
              settings={mathSettings}
              onUpdateSettings={handleUpdateMathSettings}
              onStartGame={handleStartMath}
              onOpenStats={() => setIsMathStatsOpen(true)}
              onBackToHub={() => setActiveGame('hub')}
            />
          )}
        </main>
      )}
    </div>
  );
}

export default App;
