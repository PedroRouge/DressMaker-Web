// src/App.tsx
import React, { useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { GameScene } from './components/3d/GameScene';

// Paneles de UI
import { OrderPanel } from './components/ui/panels/OrderPanel';
import { MeasurePanel } from './components/ui/panels/MeasurePanel';
import { DesignPanel } from './components/ui/panels/DesignPanel';
import { FabricPanel } from './components/ui/panels/FabricPanel';
import { CutPanel } from './components/ui/panels/CutPanel';
import { SewingMinigame } from './components/ui/panels/SewingMinigame';
import { DeliveryPanel } from './components/ui/panels/DeliveryPanel';

import { Coins, Star, HelpCircle, Eye, EyeOff, Maximize, RotateCcw } from 'lucide-react';

export const App: React.FC = () => {
  const phase = useGameStore((s) => s.phase);
  const coins = useGameStore((s) => s.coins);
  const stars = useGameStore((s) => s.stars);
  const setPhase = useGameStore((s) => s.setPhase);
  const activeMeasurePart = useGameStore((s) => s.activeMeasurePart);
  const tempMeasureValue = useGameStore((s) => s.tempMeasureValue);

  const [hideUI, setHideUI] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const PHASES_LIST = [
    { id: 'MEASURE', label: 'Medir', icon: '📏' },
    { id: 'DESIGN', label: 'Diseñar', icon: '🌸' },
    { id: 'FABRIC', label: 'Telas', icon: '🧵' },
    { id: 'CUT', label: 'Cortar', icon: '✂️' },
    { id: 'SEW', label: 'Coser', icon: '🪡' },
    { id: 'DELIVERY', label: 'Entregar', icon: '🎁' }
  ] as const;

  const partNames = {
    bust: 'Pecho',
    waist: 'Cintura',
    hips: 'Cadera'
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#261321] text-[#f7eef5] select-none flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* =========================================================================
          BARRA SUPERIOR (NAVBAR IDÉNTICA A DRESSMAKER)
         ========================================================================= */}
      <header className="z-30 w-full flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Pastilla de Fases del Juego (Izquierda) */}
        <div className="flex items-center gap-1 sm:gap-2 bg-[#311b2b]/95 border border-white/10 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
          {PHASES_LIST.map((p, idx) => {
            const isActive = phase === p.id;
            return (
              <React.Fragment key={p.id}>
                <button
                  onClick={() => setPhase(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                    isActive
                      ? 'bg-[#e8618c] text-white shadow-md shadow-pink-500/30 scale-105'
                      : 'text-[#9c7891] hover:text-[#d3b4cb]'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span className={isActive ? 'inline' : 'hidden md:inline'}>{p.label}</span>
                </button>
                {idx < PHASES_LIST.length - 1 && (
                  <span className="text-[#59344f] text-[10px] hidden sm:inline">··</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Monedas, Reputación y Botones de Acción (Derecha) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Contador de Monedas y Estrellas */}
          <div className="flex items-center gap-3 bg-[#311b2b]/95 border border-white/10 px-4 py-1.5 rounded-full shadow-md text-xs font-black">
            <div className="flex items-center gap-1.5 text-[#f6c344]">
              <Coins className="w-4 h-4 fill-[#f6c344]" />
              <span>{coins}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#e8618c]">
              <Star className="w-4 h-4 fill-[#e8618c]" />
              <span>{stars}</span>
            </div>
          </div>

          {/* Ocultar / Mostrar UI */}
          <button
            onClick={() => setHideUI(!hideUI)}
            title={hideUI ? 'Mostrar Interfaz' : 'Ocultar Interfaz para capturas'}
            className="w-8 h-8 rounded-full bg-[#311b2b] border border-white/10 flex items-center justify-center text-xs text-[#c49db9] hover:text-white hover:bg-[#3f2238] transition-colors shadow"
          >
            {hideUI ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Ayuda del Juego */}
          <button
            onClick={() => setShowHelpModal(true)}
            title="Guía de Costura"
            className="w-8 h-8 rounded-full bg-[#311b2b] border border-white/10 flex items-center justify-center text-xs text-[#c49db9] hover:text-white hover:bg-[#3f2238] transition-colors shadow"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          CONTENIDO PRINCIPAL: MOTOR 3D (IZQUIERDA) + PANEL DE FASE (DERECHA)
         ========================================================================= */}
      <main className="relative flex-1 w-full h-full flex flex-col lg:flex-row overflow-hidden">
        {/* MITAD IZQUIERDA / FONDO: CANVAS 3D INTERACTIVO CON MANIQUÍ */}
        <div className="relative flex-1 w-full h-full">
          <GameScene />

          {/* Tooltip flotante interactivo de medidas (idéntico a la Imagen 1) */}
          {phase === 'MEASURE' && !hideUI && (
            <div className="absolute top-[42%] left-[58%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
              <div className="bg-[#311b2b]/95 border border-white/15 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-200">
                <span className="text-[11px] font-bold text-[#c49db9] uppercase tracking-wider">
                  {partNames[activeMeasurePart]}
                </span>
                <span className="text-xl font-black text-white">
                  {tempMeasureValue.toFixed(1).replace('.', ',')} cm
                </span>
                <span className="text-[10px] text-[#f6c344] font-medium flex items-center gap-1 mt-0.5">
                  ↕ Busca el contorno exacto
                </span>
              </div>
            </div>
          )}

          {/* Pie de página sutil como en el juego original */}
          <div className="absolute bottom-3 left-4 text-[10px] text-[#805f77] pointer-events-none">
            Guardado en este navegador
          </div>
        </div>

        {/* MITAD DERECHA: PANEL MODULAR CONDICIONAL SEGÚN FASE */}
        {!hideUI && (
          <aside className="z-20 w-full lg:w-auto p-4 sm:p-6 flex items-center justify-center lg:justify-end">
            {phase === 'START' && <OrderPanel />}
            {phase === 'MEASURE' && <MeasurePanel />}
            {phase === 'DESIGN' && <DesignPanel />}
            {phase === 'FABRIC' && <FabricPanel />}
            {phase === 'CUT' && <CutPanel />}
            {phase === 'SEW' && <SewingMinigame />}
            {phase === 'DELIVERY' && <DeliveryPanel />}
          </aside>
        )}
      </main>

      {/* =========================================================================
          MODAL DE AYUDA / CÓMO JUGAR
         ========================================================================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#311b2b] border border-white/15 p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>👗</span>
                <span>Cómo Jugar a DressMaker</span>
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-[#c49db9] hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#d3b4cb]">
              <p>
                <strong>1. Medir:</strong> Ajusta el contorno de pecho, cintura y cadera con la cinta métrica en el maniquí.
              </p>
              <p>
                <strong>2. Diseñar:</strong> Selecciona el corpiño, escote y falda adaptándote a las etiquetas solicitadas por el cliente.
              </p>
              <p>
                <strong>3. Telas:</strong> Compra la tela que mejor encaje con el pedido para maximizar tus propinas.
              </p>
              <p>
                <strong>4. Cortar y Coser:</strong> Recorta el patrón y consigue puntadas perfectas en el minijuego de costura.
              </p>
              <p>
                <strong>5. Entregar:</strong> ¡Recibe tus monedas 🪙 y gana estrellas de reputación ⭐!
              </p>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#e8618c] text-white font-bold text-xs uppercase"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
