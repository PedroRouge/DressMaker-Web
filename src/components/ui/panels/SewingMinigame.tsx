// src/components/ui/panels/SewingMinigame.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../../store/useGameStore';
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const SewingMinigame: React.FC = () => {
  const sewingScore = useGameStore((s) => s.sewingScore);
  const sewingStitches = useGameStore((s) => s.sewingStitches);
  const addStitch = useGameStore((s) => s.addStitch);
  const selectedFabric = useGameStore((s) => s.selectedFabric);
  const nextPhase = useGameStore((s) => s.nextPhase);
  const prevPhase = useGameStore((s) => s.prevPhase);

  const [needlePos, setNeedlePos] = useState(50);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  const REQUIRED_STITCHES = 8;
  const isFinished = sewingStitches >= REQUIRED_STITCHES;

  // Oscilación constante de la aguja de costura
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setNeedlePos((prev) => {
        let next = prev + direction * 2.8;
        if (next >= 92) {
          setDirection(-1);
          next = 92;
        } else if (next <= 8) {
          setDirection(1);
          next = 8;
        }
        return next;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [direction, isFinished]);

  // Al presionar la puntada (espacio o click)
  const handleStitch = () => {
    if (isFinished) return;

    // Zona verde de precisión: 40% a 60%
    if (needlePos >= 42 && needlePos <= 58) {
      addStitch('PERFECT');
      setFeedback('¡PUNTADA PERFECTA! ✨');
    } else if (needlePos >= 28 && needlePos <= 72) {
      addStitch('GOOD');
      setFeedback('¡Buena Puntada! 👍');
    } else {
      addStitch('MISS');
      setFeedback('Desvío de aguja ⚠️');
    }

    setTimeout(() => setFeedback(null), 900);
  };

  return (
    <div className="flex flex-col gap-4 bg-[#311b2b]/95 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-right duration-300 select-none">
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e8618c] flex items-center justify-center text-white text-base font-bold shadow-md shadow-pink-500/20">
            🪡
          </div>
          <h2 className="text-xl font-extrabold text-white">Costura de Precisión</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#f6c344] bg-[#261321] px-3 py-1 rounded-full border border-white/5">
          <span>{sewingScore} pts</span>
        </div>
      </div>

      <p className="text-[11px] text-[#c49db9]">
        Presiona "Puntada" cuando la aguja pase por la zona verde central para coser las costuras del vestido con máxima calidad.
      </p>

      {/* Simulador 2D de tela y máquina de coser */}
      <div
        className="relative h-44 rounded-2xl border border-white/10 p-4 flex flex-col justify-between overflow-hidden shadow-inner"
        style={{ backgroundColor: selectedFabric.color }}
      >
        {/* Línea de costura punteada central */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 border-b-2 border-dashed border-black/40 -translate-y-1/2" />

        {/* Zona verde de precisión perfecta en el centro */}
        <div className="absolute top-0 bottom-0 left-[42%] right-[42%] bg-emerald-500/25 border-x-2 border-emerald-400/50 flex items-center justify-center pointer-events-none">
          <span className="text-[9px] font-black text-emerald-950 uppercase tracking-widest bg-emerald-300/80 px-1 py-0.5 rounded">
            Zona Perfecta
          </span>
        </div>

        {/* Aguja de coser móvil */}
        <div
          className="absolute top-2 bottom-2 w-1.5 bg-[#e8618c] shadow-lg shadow-pink-500/50 rounded-full transition-all duration-75 pointer-events-none flex flex-col items-center justify-between"
          style={{ left: `${needlePos}%` }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-[#f6c344] -mt-1 shadow" />
          <div className="w-2 h-2 rounded-full bg-white -mb-1 shadow" />
        </div>

        {/* Feedback visual flotante */}
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none animate-in zoom-in-75 duration-150">
            <span className="text-base font-black text-white px-3 py-1 rounded-xl bg-[#e8618c] shadow-lg">
              {feedback}
            </span>
          </div>
        )}
      </div>

      {/* Contador de puntadas */}
      <div className="flex items-center justify-between text-xs font-bold text-[#d3b4cb]">
        <span>Puntadas completadas:</span>
        <span className="text-[#f6c344]">
          {Math.min(sewingStitches, REQUIRED_STITCHES)} / {REQUIRED_STITCHES}
        </span>
      </div>

      {/* Botón de acción de puntada */}
      <button
        onClick={handleStitch}
        disabled={isFinished}
        className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide uppercase transition-all shadow-lg active:scale-95 ${
          isFinished
            ? 'bg-emerald-500 text-white cursor-default'
            : 'bg-gradient-to-r from-[#e8618c] to-[#f6c344] text-[#261321] hover:opacity-95'
        }`}
      >
        {isFinished ? '✓ Costura Completada' : '🪡 Dar Puntada'}
      </button>

      {/* Botones de Navegación */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={prevPhase}
          className="p-3.5 rounded-2xl bg-[#3f2237] hover:bg-[#4d2a44] text-[#c49db9] hover:text-white transition-all flex items-center justify-center border border-white/5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextPhase}
          disabled={!isFinished}
          className={`flex-1 py-3.5 rounded-2xl font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all ${
            isFinished
              ? 'bg-[#f6c344] hover:bg-[#ffd152] text-[#261321] shadow-xl shadow-amber-400/20 active:scale-95 cursor-pointer'
              : 'bg-[#4a2e43] text-[#805f77] cursor-not-allowed opacity-50'
          }`}
        >
          <span>Siguiente: Entrega al Cliente</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SewingMinigame;
