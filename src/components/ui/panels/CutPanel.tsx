// src/components/ui/panels/CutPanel.tsx
import React, { useState } from 'react';
import { useGameStore } from '../../../store/useGameStore';
import { Scissors, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const CutPanel: React.FC = () => {
  const cutProgress = useGameStore((s) => s.cutProgress);
  const setCutProgress = useGameStore((s) => s.setCutProgress);
  const selectedFabric = useGameStore((s) => s.selectedFabric);
  const nextPhase = useGameStore((s) => s.nextPhase);
  const prevPhase = useGameStore((s) => s.prevPhase);

  const [isCutting, setIsCutting] = useState(false);

  const handleCutClick = () => {
    setIsCutting(true);
    setCutProgress(Math.min(100, cutProgress + 15));
    setTimeout(() => setIsCutting(false), 200);
  };

  const isCompleted = cutProgress >= 100;

  return (
    <div className="flex flex-col gap-4 bg-[#311b2b]/95 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-right duration-300 select-none">
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e8618c] flex items-center justify-center text-white text-base font-bold shadow-md shadow-pink-500/20">
            ✂️
          </div>
          <h2 className="text-xl font-extrabold text-white">Cortar Patrón</h2>
        </div>
        <span className="text-xs font-bold text-[#f6c344] bg-[#261321] px-2.5 py-1 rounded-full border border-white/5">
          {cutProgress}% cortado
        </span>
      </div>

      <p className="text-[11px] text-[#c49db9]">
        Presiona las tijeras repetidamente para recortar con precisión las piezas del patrón sobre la tela seleccionada ({selectedFabric.name}).
      </p>

      {/* Mesa de corte interactiva 2D */}
      <div className="relative h-48 rounded-2xl border-2 border-dashed border-white/20 p-4 flex flex-col items-center justify-center overflow-hidden bg-[#261321]">
        {/* Capa de tela que se corta */}
        <div
          className="absolute inset-2 rounded-xl transition-all duration-300 opacity-80"
          style={{
            backgroundColor: selectedFabric.color,
            clipPath: `inset(0 ${100 - cutProgress}% 0 0)`
          }}
        />

        {/* Silueta del patrón punteado */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-24 h-16 border-2 border-dashed border-white/70 rounded-lg flex items-center justify-center">
            <span className="text-[10px] font-bold text-white uppercase drop-shadow">
              Patrón Corpiño
            </span>
          </div>

          <button
            onClick={handleCutClick}
            disabled={isCompleted}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg transition-all ${
              isCompleted
                ? 'bg-emerald-500 text-white cursor-default'
                : 'bg-[#e8618c] hover:bg-[#f3739c] text-white active:scale-95'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Corte Terminado!</span>
              </>
            ) : (
              <>
                <Scissors className={`w-4 h-4 ${isCutting ? 'rotate-45' : ''} transition-transform`} />
                <span>Cortar Tela (+15%)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="space-y-1">
        <div className="h-2.5 w-full bg-[#261321] rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#e8618c] to-[#f6c344] rounded-full transition-all duration-300"
            style={{ width: `${cutProgress}%` }}
          />
        </div>
      </div>

      {/* Botones de Navegación */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={prevPhase}
          className="p-3.5 rounded-2xl bg-[#3f2237] hover:bg-[#4d2a44] text-[#c49db9] hover:text-white transition-all flex items-center justify-center border border-white/5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextPhase}
          disabled={!isCompleted}
          className={`flex-1 py-3.5 rounded-2xl font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all ${
            isCompleted
              ? 'bg-[#f6c344] hover:bg-[#ffd152] text-[#261321] shadow-xl shadow-amber-400/20 active:scale-95 cursor-pointer'
              : 'bg-[#4a2e43] text-[#805f77] cursor-not-allowed opacity-50'
          }`}
        >
          <span>Siguiente: Coser Prenda</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CutPanel;
