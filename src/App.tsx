import { useState, useEffect } from 'react';
import { VERBS_DATA } from './data/verbs';
import { Verb, VerbAttempt, RoundSessionSummary, UserSettings, Achievement } from './types';
import { storage } from './services/storage';
import { audio } from './utils/audio';
import { Header } from './components/Header';
import { GameSession } from './components/GameSession';
import { RoundSummary } from './components/RoundSummary';
import { StatsView } from './components/StatsView';
import { DictionaryView } from './components/DictionaryView';
import { SettingsModal } from './components/SettingsModal';
import { Play, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'weak' | 'dict' | 'stats'>('game');
  const [settings, setSettings] = useState<UserSettings>(() => storage.getSettings());
  const [sessions, setSessions] = useState<RoundSessionSummary[]>(() => storage.getSessions());
  const [verbStats, setVerbStats] = useState(() => storage.getVerbStats());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storage.getAchievements());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active game session state
  const [activeRoundVerbs, setActiveRoundVerbs] = useState<Verb[] | null>(null);
  const [activeRoundTitle, setActiveRoundTitle] = useState('Ronda de Verbos');
  const [completedSummary, setCompletedSummary] = useState<RoundSessionSummary | null>(null);

  // Update audio manager whenever soundEnabled changes
  useEffect(() => {
    audio.setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const difficultVerbIds = storage.getDifficultVerbIds();

  // Helper to shuffle an array
  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Start a new round
  const startRound = (customVerbs?: Verb[], customTitle?: string) => {
    let pool: Verb[];

    if (customVerbs && customVerbs.length > 0) {
      pool = customVerbs;
    } else {
      let filtered = VERBS_DATA;
      if (settings.levelFilter !== 'all') {
        filtered = VERBS_DATA.filter(v => v.level === settings.levelFilter);
      }
      pool = filtered;
    }

    const shuffled = shuffle(pool);
    const count = settings.roundSize > 0 ? Math.min(settings.roundSize, shuffled.length) : shuffled.length;
    const selected = shuffled.slice(0, count);

    const title = customTitle || `Ronda de ${selected.length} Verbos`;

    setActiveRoundTitle(title);
    setActiveRoundVerbs(selected);
    setCompletedSummary(null);
    setActiveTab('game');
  };

  // Start practicing mistakes / difficult verbs
  const startPracticingDifficult = (idsToPractice?: string[]) => {
    const targetIds = idsToPractice || difficultVerbIds;
    const targetVerbs = VERBS_DATA.filter(v => targetIds.includes(v.id));

    if (targetVerbs.length === 0) {
      alert('¡Excelente noticia! No tienes ningún verbo con fallos pendiente.');
      return;
    }

    startRound(targetVerbs, `Refuerzo de ${targetVerbs.length} Verbos Difíciles`);
  };

  // Handle round completion
  const handleFinishRound = (attempts: VerbAttempt[], highestStreak: number, score: number) => {
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

    // Save to storage
    storage.saveSession(summary);

    // Refresh state from storage
    setSessions(storage.getSessions());
    setVerbStats(storage.getVerbStats());
    setAchievements(storage.getAchievements());

    setCompletedSummary(summary);
    setActiveRoundVerbs(null);
  };

  const handleQuitRound = () => {
    if (window.confirm('¿Seguro que quieres salir de la ronda actual?')) {
      setActiveRoundVerbs(null);
      setCompletedSummary(null);
    }
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const handleResetData = () => {
    storage.resetAllData();
    setSessions([]);
    setVerbStats({});
    setAchievements(storage.getAchievements());
  };

  // Global calculations for welcome screen
  const totalScoreAllTime = sessions.reduce((sum, s) => sum + s.score, 0);
  const totalMastered = Object.values(verbStats).filter(
    s => (s.timesFlawless >= 2 && s.timesFailed === 0) || s.timesFlawless >= 3
  ).length;

  return (
    <div className="min-h-screen flex flex-col font-['Nunito',sans-serif]">
      {/* Navigation Header */}
      <Header
        currentTab={activeTab}
        onSelectTab={tab => {
          if (tab === 'weak') {
            startPracticingDifficult();
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        difficultCount={difficultVerbIds.length}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => handleUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'game' && (
          <>
            {/* If in active game */}
            {activeRoundVerbs && (
              <GameSession
                verbs={activeRoundVerbs}
                settings={settings}
                sessionTitle={activeRoundTitle}
                onFinishRound={handleFinishRound}
                onQuit={handleQuitRound}
              />
            )}

            {/* If round finished summary */}
            {!activeRoundVerbs && completedSummary && (
              <RoundSummary
                summary={completedSummary}
                onPlayAgain={() => startRound()}
                onPracticeMistakes={mistakeAttempts => {
                  const mistakeVerbs = mistakeAttempts.map(a => a.verb);
                  startRound(mistakeVerbs, `Repaso de ${mistakeVerbs.length} Fallos`);
                }}
                onViewStats={() => {
                  setCompletedSummary(null);
                  setActiveTab('stats');
                }}
              />
            )}

            {/* If idle / Welcome lobby */}
            {!activeRoundVerbs && !completedSummary && (
              <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 animate-pop">
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
                        onClick={() => startRound()}
                        className="px-7 py-4 bg-white text-indigo-700 hover:bg-yellow-300 hover:text-indigo-950 font-black rounded-2xl shadow-lg transition-all text-base flex items-center gap-2.5 active:scale-95"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        <span>¡Empezar Ronda ({settings.roundSize > 0 ? `${settings.roundSize} verbos` : 'Todos'})!</span>
                      </button>

                      {difficultVerbIds.length > 0 && (
                        <button
                          onClick={() => startPracticingDifficult()}
                          className="px-5 py-4 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-2xl shadow-lg transition-all text-sm flex items-center gap-2 active:scale-95"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>Repasar {difficultVerbIds.length} Fallos</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Decorative background shapes */}
                  <div className="absolute -right-8 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute right-10 top-8 text-8xl opacity-15 select-none font-black pointer-events-none">
                    ⚡
                  </div>
                </div>

                {/* Quick stats ribbon */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
                    <div className="text-2xl sm:text-3xl font-black text-indigo-600">
                      {sessions.length}
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Rondas Jugadas
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
                    <div className="text-2xl sm:text-3xl font-black text-amber-500">
                      {totalScoreAllTime}
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Puntos Ganados
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                      {totalMastered}
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Verbos Dominados
                    </div>
                  </div>
                </div>

                {/* Game Modes Cards */}
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-slate-700 uppercase tracking-wider">
                    Modos Rápidos de Entrenamiento
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                      onClick={() => {
                        const easyVerbs = VERBS_DATA.filter(v => v.level === 'easy');
                        startRound(easyVerbs, 'Nivel Básico (Esenciales)');
                      }}
                      className="p-4 bg-white rounded-3xl border border-slate-100 hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-3 group-hover:scale-110 transition-transform">
                        🌱
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm">Nivel Básico</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        Los verbos más usados y frecuentes en clase.
                      </p>
                    </div>

                    <div
                      onClick={() => {
                        const medVerbs = VERBS_DATA.filter(v => v.level === 'medium');
                        startRound(medVerbs, 'Nivel Intermedio');
                      }}
                      className="p-4 bg-white rounded-3xl border border-slate-100 hover:border-amber-300 hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black mb-3 group-hover:scale-110 transition-transform">
                        ⚡
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm">Nivel Intermedio</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        Verbos muy comunes con formas interesantes.
                      </p>
                    </div>

                    <div
                      onClick={() => {
                        const hardVerbs = VERBS_DATA.filter(v => v.level === 'hard');
                        startRound(hardVerbs, 'Nivel Avanzado');
                      }}
                      className="p-4 bg-white rounded-3xl border border-slate-100 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black mb-3 group-hover:scale-110 transition-transform">
                        👑
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm">Nivel Avanzado</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        Verbos irregulares especiales para auténticas expertas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">¿Quieres consultar los verbos antes de jugar?</div>
                      <div className="text-[11px] text-slate-400 font-medium">Revisa el diccionario con audio y ejemplos</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('dict')}
                    className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-all"
                  >
                    Abrir Diccionario ➔
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Dictionary Tab */}
        {activeTab === 'dict' && (
          <DictionaryView verbs={VERBS_DATA} />
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <StatsView
            sessions={sessions}
            verbStats={verbStats}
            achievements={achievements}
            allVerbs={VERBS_DATA}
            onPracticeDifficult={ids => startPracticingDifficult(ids)}
            onStartNewRound={() => {
              setActiveTab('game');
              startRound();
            }}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetData={handleResetData}
      />
    </div>
  );
}

export default App;
