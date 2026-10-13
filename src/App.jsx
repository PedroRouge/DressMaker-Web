import React from 'react';
import Header from './components/ui/Header.jsx';
import Footer from './components/ui/Footer.jsx';
import CanvasScene from './components/CanvasScene.jsx';
import DressControls from './components/ui/DressControls.jsx';
import { useGameStore } from './store/useGameStore.js';

export default function App() {
  const loading = useGameStore((s) => s.loading);
  const initialize = useGameStore((s) => s.initialize);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-pink-500 selection:text-white">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 items-stretch justify-center">
        {loading ? (
          <div className="flex-1 flex items-center justify-center min-h-[500px]">
            <div className="text-center animate-pulse space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin mx-auto" />
              <p className="text-lg font-medium text-pink-300">Preparando Atelier 3D...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Visor 3D Interactivo */}
            <div className="flex-1 min-h-[480px] lg:min-h-[620px] flex">
              <CanvasScene />
            </div>

            {/* Panel de Herramientas y Controles de Moda */}
            <div className="flex justify-center items-start">
              <DressControls />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
