// src/components/ui/panels/FabricPanel.tsx
import React, { useState } from 'react';
import { useGameStore, FABRICS, FabricItem } from '../../../store/useGameStore';
import { Sparkles, ArrowRight, ArrowLeft, Coins, Check } from 'lucide-react';

export const FabricPanel: React.FC = () => {
  const selectedFabric = useGameStore((s) => s.selectedFabric);
  const coins = useGameStore((s) => s.coins);
  const currentOrder = useGameStore((s) => s.currentOrder);
  const selectFabric = useGameStore((s) => s.selectFabric);
  const nextPhase = useGameStore((s) => s.nextPhase);
  const prevPhase = useGameStore((s) => s.prevPhase);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelect = (fabric: FabricItem) => {
    if (selectedFabric.id === fabric.id) return;
    const ok = selectFabric(fabric);
    if (!ok) {
      setErrorMsg(`¡Necesitas ${fabric.price} monedas!`);
      setTimeout(() => setErrorMsg(null), 2500);
    } else {
      setErrorMsg(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-[#311b2b]/95 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-right duration-300 select-none">
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e8618c] flex items-center justify-center text-white text-base font-bold shadow-md shadow-pink-500/20">
            🧵
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Selección de Telas</h2>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#261321] border border-white/5 text-xs font-bold text-[#f6c344]">
          <Coins className="w-3.5 h-3.5" />
          <span>{coins}</span>
        </div>
      </div>

      <p className="text-[11px] text-[#c49db9]">
        Escoge el tejido ideal para confeccionar la prenda. Cada tela aporta textura y propiedades únicas a la prenda final.
      </p>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs text-center font-bold animate-shake">
          {errorMsg}
        </div>
      )}

      {/* Grid de telas */}
      <div className="grid grid-cols-2 gap-2.5">
        {FABRICS.map((fabric) => {
          const isSelected = selectedFabric.id === fabric.id;
          const canAfford = coins >= fabric.price || isSelected;
          const matchesClient = currentOrder.requiredTags.includes(fabric.tag);

          return (
            <button
              key={fabric.id}
              disabled={!canAfford && !isSelected}
              onClick={() => handleSelect(fabric)}
              className={`relative flex flex-col p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-[#e8618c] bg-[#e8618c]/15 shadow-md shadow-pink-500/20 ring-2 ring-[#e8618c]/30'
                  : canAfford
                  ? 'border-white/5 bg-[#3f2237] hover:border-white/20'
                  : 'border-white/5 bg-[#261321] opacity-40 cursor-not-allowed'
              }`}
            >
              {/* Muestra circular de color de tela con textura */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white/20 shadow-md flex items-center justify-center"
                  style={{ backgroundColor: fabric.color }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow" />}
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#f6c344]">
                  {fabric.price > 0 ? (
                    <>
                      <span>{fabric.price}</span>
                      <Coins className="w-3 h-3" />
                    </>
                  ) : (
                    <span className="text-emerald-400 text-[10px]">Gratis</span>
                  )}
                </div>
              </div>

              <span className="text-xs font-bold text-white mb-1">{fabric.name}</span>

              {/* Tag de la tela */}
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-md self-start font-semibold ${
                  matchesClient
                    ? 'bg-[#e8618c] text-white'
                    : 'bg-black/30 text-[#c49db9]'
                }`}
              >
                {fabric.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Botones de Navegación */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={prevPhase}
          className="p-3.5 rounded-2xl bg-[#3f2237] hover:bg-[#4d2a44] text-[#c49db9] hover:text-white transition-all flex items-center justify-center border border-white/5"
          title="Volver al diseño"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextPhase}
          className="flex-1 py-3.5 rounded-2xl bg-[#f6c344] hover:bg-[#ffd152] text-[#261321] font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 active:scale-95 transition-all"
        >
          <span>Siguiente: Cortar Patrón</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FabricPanel;
