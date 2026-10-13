// src/components/ui/panels/SewingMachine.tsx
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../../store/useGameStore';
import { ArrowRight, ArrowLeft, Play, Pause, Keyboard, MousePointer, Sparkles } from 'lucide-react';

export const SewingMachine: React.FC = () => {
  const sewingMode = useGameStore((s) => s.sewingMode);
  const sewingLineProgress = useGameStore((s) => s.sewingLineProgress);
  const sewingDeviance = useGameStore((s) => s.sewingDeviance);
  const sewingAccuracy = useGameStore((s) => s.sewingAccuracy);
  const setSewingMode = useGameStore((s) => s.setSewingMode);
  const advanceSewing = useGameStore((s) => s.advanceSewing);
  const nextPhase = useGameStore((s) => s.nextPhase);
  const prevPhase = useGameStore((s) => s.prevPhase);

  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const isCompleted = sewingLineProgress >= 100;

  // Ejecución en Modo Automático
  useEffect(() => {
    if (sewingMode !== 'auto' || !isAutoPlaying || isCompleted) return;

    const interval = setInterval(() => {
      advanceSewing(0);
    }, 120);

    return () => clearInterval(interval);
  }, [sewingMode, isAutoPlaying, isCompleted, advanceSewing]);

  return (
    <div className="flex flex-col gap-4 bg-[#311b2b]/95 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-right duration-300 select-none">
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e8618c] flex items-center justify-center text-white text-base font-bold shadow-md shadow-pink-500/20">
            🪡
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Máquina de Coser</h2>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#261321] border border-white/5 text-xs font-bold text-[#f6c344]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{sewingAccuracy}% Precisión</span>
        </div>
      </div>

      {/* SELECTOR DE MODO: AUTOMÁTICO VS MANUAL */}
      <div className="grid grid-cols-2 gap-2 bg-[#261321] p-1.5 rounded-2xl border border-white/5">
        <button
          onClick={() => {
            setSewingMode('manual');
            setIsAutoPlaying(false);
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            sewingMode === 'manual'
              ? 'bg-[#e8618c] text-white shadow-md'
              : 'text-[#c49db9] hover:text-white'
          }`}
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Manual (Teclado)</span>
        </button>

        <button
          onClick={() => setSewingMode('auto')}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            sewingMode === 'auto'
              ? 'bg-[#e8618c] text-white shadow-md'
              : 'text-[#c49db9] hover:text-white'
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span>Automático (1-Click)</span>
        </button>
      </div>

      {/* CONTROLES E INSTRUCCIONES SEGÚN EL MODO */}
      {sewingMode === 'manual' ? (
        <div className="bg-[#3f2237] p-4 rounded-2xl border border-white/5 space-y-2.5">
          <span className="text-xs font-bold text-white block">Controles Manuales de Sastre:</span>
          <div className="flex items-center gap-2 text-xs text-[#d3b4cb]">
            <kbd className="px-2 py-1 bg-black/40 border border-white/20 rounded font-mono text-[10px] text-white">
              ESPACIO
            </kbd>
            <span>Mantén presionado para pisar el pedal y avanzar la tela.</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#d3b4cb]">
            <kbd className="px-2 py-1 bg-black/40 border border-white/20 rounded font-mono text-[10px] text-white">
              ← / →
            </kbd>
            <span>Guía la tela sobre la línea punteada para no perder precisión.</span>
          </div>

          {/* Indicador visual de centrado */}
          <div className="pt-2">
            <div className="flex justify-between text-[10px] text-[#c49db9] font-bold mb-1">
              <span>Izquierda</span>
              <span className="text-emerald-400">Pespunte Central</span>
              <span>Derecha</span>
            </div>
            <div className="h-2 w-full bg-[#261321] rounded-full relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 w-3 bg-[#e8618c] rounded-full transition-all duration-75"
                style={{ left: `calc(50% + ${sewingDeviance * 4}% - 6px)` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#3f2237] p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-3">
          <span className="text-xs font-bold text-white">Costura Asistida Automática</span>
          <p className="text-[11px] text-[#c49db9] text-center">
            La máquina coserá las costuras siguiendo el patrón a velocidad constante.
          </p>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            disabled={isCompleted}
            className={`px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase flex items-center gap-2 shadow-lg transition-all ${
              isCompleted
                ? 'bg-emerald-500 text-white cursor-default'
                : 'bg-[#e8618c] text-white hover:bg-[#f3739c] active:scale-95'
            }`}
          >
            {isCompleted ? (
              <span>✓ Costura Lista</span>
            ) : isAutoPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar Motor</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Iniciar Costura Automática</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* BARRA DE PROGRESO DE COSTURA */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-bold text-[#c49db9]">
          <span>Costura ensamblada:</span>
          <span className="text-[#f6c344]">{sewingLineProgress}%</span>
        </div>
        <div className="h-2.5 w-full bg-[#261321] rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#e8618c] to-[#f6c344] rounded-full transition-all duration-150"
            style={{ width: `${sewingLineProgress}%` }}
          />
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <div className="flex gap-2 pt-1">
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
          <span>Siguiente: Decorar en Maniquí</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SewingMachine;
