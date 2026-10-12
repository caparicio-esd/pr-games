import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already in standalone / installed mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(isStandaloneMode);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isStandalone || isDismissed) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setIsHelpOpen(true);
    }
  };

  return (
    <>
      {/* Banner in Hub */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/80 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-pop">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shrink-0 shadow-md shadow-indigo-200">
            📱
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="font-black text-sm text-slate-800">
                ¡Juega como una App en tu iPad o Móvil!
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Offline
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Instálala en la pantalla de inicio para jugar a pantalla completa y sin conexión a internet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-200 active:scale-95 transition-all"
          >
            {deferredPrompt ? <Download className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            <span>{deferredPrompt ? 'Instalar App' : 'Cómo Instalarla'}</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white flex items-center justify-center transition-colors"
            title="Ocultar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS & General Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                  📲
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    Añadir EduPlay Jr. a tu Pantalla
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Funciona como app nativa en iPad, iPhone y Android
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Steps for iOS / iPad */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase text-indigo-700 tracking-wider">
                Instrucciones para iPad o iPhone (Safari):
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  1
                </span>
                <div className="text-xs text-slate-700 font-medium leading-relaxed">
                  Pulsa el botón <strong>Compartir</strong> <Share className="inline w-3.5 h-3.5 text-indigo-600 mx-1" /> (el icono cuadrado con flecha arriba) en la barra de Safari.
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  2
                </span>
                <div className="text-xs text-slate-700 font-medium leading-relaxed">
                  Baja en el menú y selecciona <strong>"Añadir a pantalla de inicio"</strong> <PlusSquare className="inline w-3.5 h-3.5 text-indigo-600 mx-1" />.
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  3
                </span>
                <div className="text-xs text-slate-700 font-medium leading-relaxed">
                  Pulsa <strong>"Añadir"</strong> arriba a la derecha. ¡Aparecerá el icono en tu pantalla y podrás jugar incluso sin Wi-Fi! 🎉
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs active:scale-95 transition-all shadow-md shadow-indigo-200"
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
