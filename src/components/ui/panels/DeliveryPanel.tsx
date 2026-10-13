// src/components/ui/panels/DeliveryPanel.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../../store/useGameStore';
import { Trophy, Star, Coins, Sparkles, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';

export const DeliveryPanel: React.FC = () => {
  const currentOrder = useGameStore((s) => s.currentOrder);
  const design = useGameStore((s) => s.design);
  const selectedFabric = useGameStore((s) => s.selectedFabric);
  const sewingScore = useGameStore((s) => s.sewingScore);
  const addCoins = useGameStore((s) => s.addCoins);
  const addStars = useGameStore((s) => s.addStars);
  const resetGame = useGameStore((s) => s.resetGame);

  // Cálculo de coincidencia y puntuación
  const { matchedTags, bonusCoins, totalCoins, earnedStars } = useMemo(() => {
    const combinedTags = [...design.tags, selectedFabric.tag];
    const matches = currentOrder.requiredTags.filter((t) => combinedTags.includes(t));

    // Propina por buena costura y satisfacción
    const tip = Math.floor(sewingScore * 0.4) + matches.length * 20;
    const total = currentOrder.budget + tip;
    const starsEarned = currentOrder.rewardStars + (matches.length >= 2 ? 1 : 0);

    return {
      matchedTags: matches,
      bonusCoins: tip,
      totalCoins: total,
      earnedStars: starsEarned
    };
  }, [currentOrder, design, selectedFabric, sewingScore]);

  const handleFinish = () => {
    addCoins(totalCoins);
    addStars(earnedStars);
    resetGame();
  };

  return (
    <div className="flex flex-col gap-4 bg-[#311b2b]/95 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-right duration-300 select-none">
      {/* Encabezado con corona/trofeo */}
      <div className="flex items-center gap-3 pb-2 border-b border-white/10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f6c344] to-[#e8618c] flex items-center justify-center text-xl shadow-lg shadow-amber-400/25">
          🎁
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#f6c344]">
            ¡Vestido Confeccionado!
          </span>
          <h2 className="text-xl font-extrabold text-white">Evaluación del Cliente</h2>
        </div>
      </div>

      {/* Reacción del Cliente */}
      <div className="bg-[#3f2237] p-4 rounded-2xl border border-white/5 flex items-center gap-3.5">
        <div className="text-4xl">{currentOrder.avatar}</div>
        <div>
          <h3 className="text-sm font-bold text-white">{currentOrder.clientName}</h3>
          <p className="text-xs text-[#d3b4cb] mt-1 leading-relaxed italic">
            "¡Ha quedado maravilloso! La caída de la tela y el acabado son justo lo que necesitaba para mi evento."
          </p>
        </div>
      </div>

      {/* Compatibilidad de Estilo */}
      <div className="space-y-1.5 bg-[#261321] p-3 rounded-2xl border border-white/5">
        <div className="flex items-center justify-between text-xs font-bold text-[#c49db9]">
          <span className="flex items-center gap-1 text-[#f6c344]">
            <Heart className="w-3.5 h-3.5 text-[#e8618c]" />
            Coincidencia de Deseos:
          </span>
          <span className="text-emerald-400">
            {matchedTags.length} de {currentOrder.requiredTags.length} logrados
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {currentOrder.requiredTags.map((t) => {
            const isMatched = matchedTags.includes(t);
            return (
              <span
                key={t}
                className={`text-[10px] px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 ${
                  isMatched
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-[#8b6582]'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {t}
              </span>
            );
          })}
        </div>
      </div>

      {/* Resumen de Recompensas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-400/10 border border-amber-400/20 p-3.5 rounded-2xl flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[#f6c344] font-black text-xl mb-0.5">
            <Coins className="w-5 h-5" />
            <span>+{totalCoins}</span>
          </div>
          <span className="text-[10px] text-[#c49db9] font-semibold text-center">
            Pago base ({currentOrder.budget}) + Propina ({bonusCoins})
          </span>
        </div>

        <div className="bg-pink-500/10 border border-pink-500/20 p-3.5 rounded-2xl flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[#e8618c] font-black text-xl mb-0.5">
            <Star className="w-5 h-5" />
            <span>+{earnedStars}</span>
          </div>
          <span className="text-[10px] text-[#c49db9] font-semibold text-center">
            Puntos de Reputación
          </span>
        </div>
      </div>

      {/* Botón de reiniciar y atender al siguiente cliente */}
      <button
        onClick={handleFinish}
        className="w-full py-3.5 bg-gradient-to-r from-[#e8618c] via-[#ec749a] to-[#f6c344] text-[#261321] font-black rounded-2xl shadow-xl shadow-pink-500/25 hover:opacity-95 active:scale-95 transition-all text-sm tracking-wide uppercase flex items-center justify-center gap-2 mt-1"
      >
        <RotateCcw className="w-4 h-4 stroke-[2.5]" />
        <span>Cobrar y Atender Siguiente Cliente</span>
      </button>
    </div>
  );
};

export default DeliveryPanel;
