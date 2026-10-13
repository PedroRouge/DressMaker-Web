// src/components/ui/panels/OrderPanel.tsx
import React from 'react';
import { useGameStore } from '../../../store/useGameStore';
import { Sparkles, Coins, Star, Clock, Heart, CheckCircle2 } from 'lucide-react';

export const OrderPanel: React.FC = () => {
  const currentOrder = useGameStore((s) => s.currentOrder);
  const nextPhase = useGameStore((s) => s.nextPhase);
  const coins = useGameStore((s) => s.coins);

  return (
    <div className="flex flex-col gap-5 bg-[#311b2b]/95 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-right duration-300">
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#e8618c]/20 text-[#e8618c]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#e8618c]">
              Nuevo Encargo
            </span>
            <h2 className="text-xl font-extrabold text-white">Ficha de Cliente</h2>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-amber-400/20 text-[#f6c344] font-bold text-xs flex items-center gap-1 border border-amber-400/30">
          <span>{currentOrder.occasion}</span>
        </div>
      </div>

      {/* Perfil del Cliente */}
      <div className="flex items-center gap-4 bg-[#3f2237] p-4 rounded-2xl border border-white/5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#e8618c] to-[#f6c344] flex items-center justify-center text-3xl shadow-lg shadow-pink-500/20">
          {currentOrder.avatar}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{currentOrder.clientName}</h3>
          <p className="text-xs text-[#d3b4cb] mt-0.5 line-clamp-2">
            "{currentOrder.description}"
          </p>
        </div>
      </div>

      {/* Preferencias & Requisitos de Estilo */}
      <div>
        <label className="text-xs font-bold text-[#d3b4cb] block mb-2 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-[#e8618c]" />
          Requisitos de Estilo Deseados:
        </label>
        <div className="flex flex-wrap gap-2">
          {currentOrder.requiredTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-xl bg-[#e8618c]/20 text-[#e8618c] border border-[#e8618c]/40 text-xs font-bold capitalize flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Recompensas & Presupuesto */}
      <div className="grid grid-cols-2 gap-3 bg-[#3f2237]/60 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-[#f6c344]">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#9c7891] block uppercase font-bold">Pago Acordado</span>
            <span className="text-base font-extrabold text-white">+{currentOrder.budget} monedas</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-[#e8618c]">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#9c7891] block uppercase font-bold">Reputación</span>
            <span className="text-base font-extrabold text-white">+{currentOrder.rewardStars} estrellas</span>
          </div>
        </div>
      </div>

      {/* Botón de Aceptar Encargo */}
      <button
        onClick={nextPhase}
        className="w-full py-3.5 bg-gradient-to-r from-[#e8618c] via-[#ec749a] to-[#f6c344] text-[#261321] font-black rounded-2xl shadow-xl shadow-pink-500/25 hover:opacity-95 active:scale-95 transition-all text-sm tracking-wide uppercase flex items-center justify-center gap-2"
      >
        <span>Aceptar Encargo y Medir</span>
        <span>→</span>
      </button>
    </div>
  );
};

export default OrderPanel;
