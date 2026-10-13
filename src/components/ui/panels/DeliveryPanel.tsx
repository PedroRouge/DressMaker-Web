// src/components/ui/panels/DeliveryPanel.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../../store/useGameStore';
import { Trophy, Star, Coins, Sparkles, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';

export const DeliveryPanel: React.FC = () => {
  const currentOrder = useGameStore((s) => s.currentOrder);
  const design = useGameStore((s) => s.design);
  const selectedFabric = useGameStore((s) => s.selectedFabric);
  const measureAccuracy = useGameStore((s) => s.measureAccuracy);
  const cutAccuracy = useGameStore((s) => s.cutAccuracy);
  const sewingAccuracy = useGameStore((s) => s.sewingAccuracy);
  const addCoins = useGameStore((s) => s.addCoins);
  const addStars = useGameStore((s) => s.addStars);
  const resetGame = useGameStore((s) => s.resetGame);

  // Cálculo de recompensas basadas en precisión real
  const { matchedTags, precisionBonus, totalCoins, earnedStars } = useMemo(() => {
    const combinedTags = [...design.tags, selectedFabric.tag];
    const matches = currentOrder.requiredTags.filter((t) => combinedTags.includes(t));

    // Promedio de precisión general de la confección
    const avgPrecision = Math.round((measureAccuracy + cutAccuracy + sewingAccuracy) / 3);
    const bonus = Math.floor(avgPrecision * 0.5) + matches.length * 25;
    const total = currentOrder.budget + bonus;

    let starsAwarded = currentOrder.rewardStars;
    if (avgPrecision >= 90 && matches.length >= currentOrder.requiredTags.length) {
      starsAwarded += 1; // Estrella extra por excelencia
    }

    return {
      matchedTags: matches,
      precisionBonus: bonus,
      totalCoins: total,
      earnedStars: starsAwarded
    };
  }, [currentOrder, design, selectedFabric, measureAccuracy, cutAccuracy, sewingAccuracy]);

  const handleFinish = () => {
    addCoins(totalCoins);
    addStars(earnedStars);
    resetGame();
  };

  return (
    <div className="flex flex-col gap-4 bg-[#311b2b]/95 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-right duration-300 select-none">
      {/* Encabezado */}
      <div className="flex items-center gap-3 pb-2 border-b border-white/10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f6c344] to-[#e8618c] flex items-center justify-center text-xl shadow-lg shadow-amber-400/25">
          🏆
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#f6c344]">
            ¡Entrega de Alta Costura!
          </span>
          <h2 className="text-xl font-extrabold text-white">Evaluación Final</h2>
        </div>
      </div>

      {/* Reacción del Cliente */}
      <div className="bg-[#3f2237] p-4 rounded-2xl border border-white/5 flex items-center gap-3.5">
        <div className="text-4xl">{currentOrder.avatar}</div>
        <div>
          <h3 className="text-sm font-bold text-white">{currentOrder.clientName}</h3>
          <p className="text-xs text-[#d3b4cb] mt-1 leading-relaxed italic">
            "¡El calce es impecable y la tela elegida refleja exactamente lo que imaginé para la gala! Tienes un talento excepcional."
          </p>
        </div>
      </div>

      {/* Desglose de Precisión en las 3 fases clave */}
      <div className="bg-[#261321] p-3.5 rounded-2xl border border-white/5 space-y-2">
        <span className="text-xs font-bold text-[#c49db9] block">Desglose de Calidad Técnica:</span>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-black/20 border border-white/5">
            <span className="text-[10px] text-[#9c7891] block">Medición</span>
            <span className="text-sm font-extrabold text-white">{measureAccuracy}%</span>
          </div>
          <div className="p-2 rounded-xl bg-black/20 border border-white/5">
            <span className="text-[10px] text-[#9c7891] block">Corte 2D</span>
            <span className="text-sm font-extrabold text-white">{cutAccuracy}%</span>
          </div>
          <div className="p-2 rounded-xl bg-black/20 border border-white/5">
            <span className="text-[10px] text-[#9c7891] block">Costura 3D</span>
            <span className="text-sm font-extrabold text-white">{sewingAccuracy}%</span>
          </div>
        </div>
      </div>

      {/* Resumen de Recompensas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-400/10 border border-amber-400/20 p-3.5 rounded-2xl flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[#f6c344] font-black text-xl mb-0.5">
            <Coins className="w-5 h-5 fill-[#f6c344]" />
            <span>+{totalCoins}</span>
          </div>
          <span className="text-[10px] text-[#c49db9] font-semibold text-center">
            Base ({currentOrder.budget}) + Bonus ({precisionBonus})
          </span>
        </div>

        <div className="bg-pink-500/10 border border-pink-500/20 p-3.5 rounded-2xl flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[#e8618c] font-black text-xl mb-0.5">
            <Star className="w-5 h-5 fill-[#e8618c]" />
            <span>+{earnedStars}</span>
          </div>
          <span className="text-[10px] text-[#c49db9] font-semibold text-center">
            Reputación Obtenida
          </span>
        </div>
      </div>

      {/* Botón de reiniciar y atender al siguiente cliente */}
      <button
        onClick={handleFinish}
        className="w-full py-3.5 bg-gradient-to-r from-[#e8618c] via-[#ec749a] to-[#f6c344] text-[#261321] font-black rounded-2xl shadow-xl shadow-pink-500/25 hover:opacity-95 active:scale-95 transition-all text-sm tracking-wide uppercase flex items-center justify-center gap-2 mt-1 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4 stroke-[2.5]" />
        <span>Cobrar y Atender Siguiente Cliente</span>
      </button>
    </div>
  );
};

export default DeliveryPanel;
