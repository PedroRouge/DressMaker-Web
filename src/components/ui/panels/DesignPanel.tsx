// src/components/ui/panels/DesignPanel.tsx
import React, { useState } from 'react';
import { useGameStore, DesignChoice } from '../../../store/useGameStore';
import { HelpCircle, Check, ArrowRight, ArrowLeft, Lock, Heart } from 'lucide-react';

interface CutCard {
  id: DesignChoice['cut'];
  label: string;
  tags: string[];
  repRequired?: number;
}

const CUTS: CutCard[] = [
  { id: 'entallado', label: 'Corpiño entallado', tags: ['glamuroso', 'romántico'] },
  { id: 'recto', label: 'Corpiño recto', tags: ['minimalista', 'profesional'] },
  { id: 'peplum', label: 'Corpiño con peplum', tags: ['vintage', 'elegante'] },
  { id: 'imperio', label: 'Corpiño imperio', tags: ['romántico', 'boho'], repRequired: 15 }
];

const SKIRT_LENGTHS: { id: DesignChoice['skirtLength']; label: string; tags: string[] }[] = [
  { id: 'corta', label: 'Falda Corta Mini', tags: ['moderno', 'fresco'] },
  { id: 'midi', label: 'Falda Midi Tubo', tags: ['vintage', 'romántico'] },
  { id: 'larga', label: 'Falda Larga Vuelo', tags: ['gala', 'glamuroso'] }
];

const NECKLINES: { id: DesignChoice['neckline']; label: string }[] = [
  { id: 'redondo', label: 'Redondo' },
  { id: 'cuadrado', label: 'Cuadrado' },
  { id: 'enV', label: 'En V' },
  { id: 'corazon', label: 'Corazón' },
  { id: 'barco', label: 'Barco' }
];

export const DesignPanel: React.FC = () => {
  const stars = useGameStore((s) => s.stars);
  const design = useGameStore((s) => s.design);
  const currentOrder = useGameStore((s) => s.currentOrder);
  const setCut = useGameStore((s) => s.setCut);
  const setSkirtLength = useGameStore((s) => s.setSkirtLength);
  const setNeckline = useGameStore((s) => s.setNeckline);
  const nextPhase = useGameStore((s) => s.nextPhase);
  const prevPhase = useGameStore((s) => s.prevPhase);

  const [activeTab, setActiveTab] = useState<'corpino' | 'falda' | 'escote'>('corpino');

  return (
    <div className="flex flex-col gap-4 bg-[#311b2b]/95 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-right duration-300 select-none">
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e8618c] flex items-center justify-center text-white text-base font-bold shadow-md shadow-pink-500/20">
            🌸
          </div>
          <h2 className="text-xl font-extrabold text-white">Bocetar el diseño</h2>
        </div>
        <button
          className="text-[#9c7891] hover:text-white transition-colors"
          title="Elige cada pieza del vestido para adaptarlo a los deseos del cliente"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      <p className="text-[11px] text-[#c49db9] leading-relaxed">
        Toca una carta y el maniquí cambia al instante. Las etiquetas encendidas son lo que quiere el cliente; las piezas bloqueadas se abren con la reputación.
      </p>

      {/* Tabs secundarias: Corpiño / Falda / Escote */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('corpino')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all ${
            activeTab === 'corpino'
              ? 'bg-[#e8618c] text-white shadow-md shadow-pink-500/20'
              : 'bg-[#3f2237] text-[#c49db9] hover:text-white'
          }`}
        >
          👗 Corpiño
        </button>
        <button
          onClick={() => setActiveTab('falda')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all ${
            activeTab === 'falda'
              ? 'bg-[#e8618c] text-white shadow-md shadow-pink-500/20'
              : 'bg-[#3f2237] text-[#c49db9] hover:text-white'
          }`}
        >
          👗 Largo Falda
        </button>
        <button
          onClick={() => setActiveTab('escote')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all ${
            activeTab === 'escote'
              ? 'bg-[#e8618c] text-white shadow-md shadow-pink-500/20'
              : 'bg-[#3f2237] text-[#c49db9] hover:text-white'
          }`}
        >
          🪞 Escote
        </button>
      </div>

      {/* CONTENIDO SEGÚN LA PESTAÑA */}
      {activeTab === 'corpino' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#d3b4cb] block">Corte del Corpiño:</label>
          <div className="grid grid-cols-2 gap-2.5">
            {CUTS.map((cut) => {
              const isSelected = design.cut === cut.id;
              const isLocked = cut.repRequired && stars < cut.repRequired;

              return (
                <button
                  key={cut.id}
                  disabled={Boolean(isLocked)}
                  onClick={() => !isLocked && setCut(cut.id, cut.tags)}
                  className={`relative flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                    isLocked
                      ? 'border-white/5 bg-[#2d1828]/50 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'border-[#e8618c] bg-[#e8618c]/15 shadow-md shadow-pink-500/20'
                      : 'border-white/5 bg-[#3f2237] hover:border-white/20'
                  }`}
                >
                  {/* Badge de seleccionado o candado */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#e8618c] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  {isLocked && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] text-[#f6c344]">
                      <Lock className="w-3 h-3" />
                      <span>{cut.repRequired}⭐</span>
                    </div>
                  )}

                  <span className="text-xs font-bold text-white mb-2 pr-5">{cut.label}</span>

                  {/* Etiquetas de estilo */}
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {cut.tags.map((tag) => {
                      const matchesClient = currentOrder.requiredTags.includes(tag);
                      return (
                        <span
                          key={tag}
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${
                            matchesClient
                              ? 'bg-[#e8618c] text-white shadow-xs'
                              : 'bg-black/30 text-[#c49db9]'
                          }`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'falda' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#d3b4cb] block">Largo y Silueta de Falda:</label>
          <div className="grid grid-cols-3 gap-2">
            {SKIRT_LENGTHS.map((skirt) => {
              const isSelected = design.skirtLength === skirt.id;
              return (
                <button
                  key={skirt.id}
                  onClick={() => setSkirtLength(skirt.id, skirt.tags)}
                  className={`flex flex-col p-2.5 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'border-[#e8618c] bg-[#e8618c]/15 shadow-md shadow-pink-500/20'
                      : 'border-white/5 bg-[#3f2237] hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-bold text-white mb-1">{skirt.label}</span>
                  <div className="flex flex-wrap justify-center gap-1 mt-auto">
                    {skirt.tags.map((t) => (
                      <span
                        key={t}
                        className={`text-[8px] px-1 py-0.5 rounded ${
                          currentOrder.requiredTags.includes(t)
                            ? 'bg-[#e8618c] text-white font-bold'
                            : 'bg-black/20 text-[#c49db9]'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'escote' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#d3b4cb] block">Estilo de Escote:</label>
          <div className="grid grid-cols-3 gap-2">
            {NECKLINES.map((neck) => {
              const isSelected = design.neckline === neck.id;
              return (
                <button
                  key={neck.id}
                  onClick={() => setNeckline(neck.id)}
                  className={`py-2 px-2 rounded-2xl border text-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-[#e8618c] bg-[#e8618c]/20 text-white'
                      : 'border-white/5 bg-[#3f2237] text-[#c49db9] hover:border-white/20'
                  }`}
                >
                  {neck.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recordatorio del cliente */}
      <div className="p-2.5 rounded-xl bg-[#261321] border border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#f6c344] font-bold text-[11px]">
          <Heart className="w-3.5 h-3.5 text-[#e8618c]" />
          <span>El cliente quiere:</span>
        </div>
        <div className="flex gap-1.5">
          {currentOrder.requiredTags.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-[#e8618c]/20 text-[#e8618c] text-[10px] font-bold">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Botones de Navegación */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={prevPhase}
          className="p-3.5 rounded-2xl bg-[#3f2237] hover:bg-[#4d2a44] text-[#c49db9] hover:text-white transition-all flex items-center justify-center border border-white/5"
          title="Volver a medir"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextPhase}
          className="flex-1 py-3.5 rounded-2xl bg-[#f6c344] hover:bg-[#ffd152] text-[#261321] font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 active:scale-95 transition-all"
        >
          <span>Siguiente: Elegir Tela</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DesignPanel;
