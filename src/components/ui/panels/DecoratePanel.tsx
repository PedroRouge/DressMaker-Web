// src/components/ui/panels/DecoratePanel.tsx
import React from 'react';
import { useGameStore } from '../../../store/useGameStore';
import { Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';

export const DecoratePanel: React.FC = () => {
  const decorations = useGameStore((s) => s.decorations);
  const toggleDecoration = useGameStore((s) => s.toggleDecoration);
  const nextPhase = useGameStore((s) => s.nextPhase);
  const prevPhase = useGameStore((s) => s.prevPhase);

  const ACCESSORIES = [
    { key: 'buttons', label: 'Botones de Nácar', desc: 'Fila de 4 botones perlados frontales', icon: '⚪' },
    { key: 'bow', label: 'Lazo de Satén', desc: 'Lazo rosa en la cintura entallada', icon: '🎀' },
    { key: 'lace', label: 'Encaje Floral', desc: 'Guipur blanco en el dobladillo', icon: '🪡' },
    { key: 'brooch', label: 'Broche Dorado', desc: 'Joya de oro en el escote', icon: '✨' }
  ] as const;

  return (
    <div className="flex flex-col gap-4 bg-[#311b2b]/95 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-right duration-300 select-none">
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e8618c] flex items-center justify-center text-white text-base font-bold shadow-md shadow-pink-500/20">
            🪄
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Detalles & Accesorios</h2>
          </div>
        </div>
        <span className="text-xs font-bold text-[#f6c344] bg-[#261321] px-3 py-1 rounded-full border border-white/5">
          Toque Final
        </span>
      </div>

      <p className="text-[11px] text-[#c49db9]">
        El vestido ha sido ensamblado en el maniquí. Elige los adornos de alta costura para darle el toque distintivo antes de la entrega final.
      </p>

      {/* Grid de accesorios */}
      <div className="grid grid-cols-2 gap-2.5">
        {ACCESSORIES.map((acc) => {
          const isSelected = decorations[acc.key];
          return (
            <button
              key={acc.key}
              onClick={() => toggleDecoration(acc.key)}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-[#e8618c] bg-[#e8618c]/20 shadow-md shadow-pink-500/20'
                  : 'border-white/5 bg-[#3f2237] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{acc.icon}</span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    isSelected ? 'bg-[#e8618c] text-white' : 'bg-black/30 text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>
              <span className="text-xs font-bold text-white block">{acc.label}</span>
              <span className="text-[10px] text-[#c49db9] mt-0.5 line-clamp-2">{acc.desc}</span>
            </button>
          );
        })}
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
          className="flex-1 py-3.5 rounded-2xl bg-[#f6c344] hover:bg-[#ffd152] text-[#261321] font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
        >
          <span>Finalizar y Entregar Vestido</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DecoratePanel;
