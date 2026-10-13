// src/components/ui/panels/CuttingTable.tsx
import React, { useState } from 'react';
import { useGameStore } from '../../../store/useGameStore';
import { Scissors, ArrowRight, ArrowLeft, Check, Sparkles, Move } from 'lucide-react';

export const CuttingTable: React.FC = () => {
  const selectedFabric = useGameStore((s) => s.selectedFabric);
  const cutPiecesPlaced = useGameStore((s) => s.cutPiecesPlaced);
  const isCuttingAnimated = useGameStore((s) => s.isCuttingAnimated);
  const cutProgress = useGameStore((s) => s.cutProgress);
  const placePatternPiece = useGameStore((s) => s.placePatternPiece);
  const triggerCutAnimation = useGameStore((s) => s.triggerCutAnimation);
  const nextPhase = useGameStore((s) => s.nextPhase);
  const prevPhase = useGameStore((s) => s.prevPhase);

  const allPiecesPlaced =
    cutPiecesPlaced.bodiceFront && cutPiecesPlaced.bodiceBack && cutPiecesPlaced.skirt;
  const isCutFinished = cutProgress >= 100;

  return (
    <div className="flex flex-col gap-4 bg-[#311b2b]/95 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-xl animate-in fade-in slide-in-from-right duration-300 select-none">
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e8618c] flex items-center justify-center text-white text-base font-bold shadow-md shadow-pink-500/20">
            ✂️
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Mesa de Corte & Patrones</h2>
          </div>
        </div>
        <span className="text-xs font-bold text-[#f6c344] bg-[#261321] px-3 py-1 rounded-full border border-white/5">
          {isCutFinished ? '100% Cortado' : allPiecesPlaced ? 'Listo para Cortar' : 'Coloca Patrones'}
        </span>
      </div>

      <p className="text-[11px] text-[#c49db9]">
        Coloca las piezas del patrón sobre la tela extendida ({selectedFabric.name}). Cuando estén posicionadas, presiona "¡Cortar!" para activar las tijeras de precisión.
      </p>

      {/* =========================================================================
          MESA DE TRABAJO 2D CENITAL CON TAPETE VERDE CUADRICULADO (CUTTING MAT)
         ========================================================================= */}
      <div className="relative h-64 rounded-2xl overflow-hidden border-2 border-[#1e4d2b] shadow-2xl flex items-center justify-center bg-[#13391e]">
        {/* Cuadrícula milimétrica sastre del tapete verde */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #4ade80 1px, transparent 1px),
              linear-gradient(to bottom, #4ade80 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* TELA EXTENDIDA CON SU ESTAMPADO / COLOR REAL */}
        <div
          className="absolute inset-4 rounded-xl shadow-lg border border-black/20 overflow-hidden"
          style={{
            backgroundColor: selectedFabric.baseColor,
            backgroundImage:
              selectedFabric.patternType === 'vichy'
                ? `repeating-linear-gradient(0deg, transparent, transparent 16px, rgba(232,97,140,0.4) 16px, rgba(232,97,140,0.4) 32px), repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(232,97,140,0.4) 16px, rgba(232,97,140,0.4) 32px)`
                : selectedFabric.patternType === 'polka'
                ? `radial-gradient(#ffffff 20%, transparent 20%)`
                : 'none',
            backgroundSize: selectedFabric.patternType === 'polka' ? '28px 28px' : 'auto'
          }}
        >
          {/* Animación visual de línea de corte trazando el contorno */}
          {isCuttingAnimated && (
            <div
              className="absolute inset-0 border-4 border-dashed border-[#f6c344] pointer-events-none animate-pulse"
              style={{
                clipPath: `inset(0 ${100 - cutProgress}% 0 0)`
              }}
            />
          )}

          {/* Tijera animada recorriendo la tela en tiempo real */}
          {isCuttingAnimated && (
            <div
              className="absolute top-1/2 -translate-y-1/2 text-2xl transition-all duration-75 pointer-events-none"
              style={{ left: `${cutProgress}%` }}
            >
              ✂️
            </div>
          )}

          {/* PIEZAS DEL PATRÓN SOBRE LA TELA */}
          <div className="relative w-full h-full p-4 flex items-center justify-around">
            {/* Pieza 1: Delantero Corpiño */}
            <div
              className={`w-28 h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-2 transition-all ${
                cutPiecesPlaced.bodiceFront
                  ? 'border-white bg-white/20 text-white shadow-md'
                  : 'border-white/40 bg-black/20 text-white/50'
              }`}
            >
              <span className="text-[10px] font-black uppercase text-center">
                Patrón Delantero
              </span>
              {cutPiecesPlaced.bodiceFront ? (
                <span className="text-xs text-[#f6c344] font-bold mt-1">✓ Ubicado</span>
              ) : (
                <span className="text-[9px] text-[#d3b4cb] mt-1">Sin colocar</span>
              )}
            </div>

            {/* Pieza 2: Trasero Corpiño */}
            <div
              className={`w-28 h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-2 transition-all ${
                cutPiecesPlaced.bodiceBack
                  ? 'border-white bg-white/20 text-white shadow-md'
                  : 'border-white/40 bg-black/20 text-white/50'
              }`}
            >
              <span className="text-[10px] font-black uppercase text-center">
                Patrón Trasero
              </span>
              {cutPiecesPlaced.bodiceBack ? (
                <span className="text-xs text-[#f6c344] font-bold mt-1">✓ Ubicado</span>
              ) : (
                <span className="text-[9px] text-[#d3b4cb] mt-1">Sin colocar</span>
              )}
            </div>

            {/* Pieza 3: Falda */}
            <div
              className={`w-36 h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-2 transition-all ${
                cutPiecesPlaced.skirt
                  ? 'border-white bg-white/20 text-white shadow-md'
                  : 'border-white/40 bg-black/20 text-white/50'
              }`}
            >
              <span className="text-[10px] font-black uppercase text-center">
                Patrón Falda Evasé
              </span>
              {cutPiecesPlaced.skirt ? (
                <span className="text-xs text-[#f6c344] font-bold mt-1">✓ Ubicado</span>
              ) : (
                <span className="text-[9px] text-[#d3b4cb] mt-1">Sin colocar</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTONES PARA COLOCAR CADA PIEZA DEL PATRÓN */}
      <div className="flex gap-2">
        <button
          onClick={() => placePatternPiece('bodiceFront')}
          disabled={cutPiecesPlaced.bodiceFront || isCutFinished}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
            cutPiecesPlaced.bodiceFront
              ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
              : 'border-white/10 bg-[#3f2237] text-white hover:border-white/30'
          }`}
        >
          {cutPiecesPlaced.bodiceFront ? '✓ Delantero' : '+ Ubicar Delantero'}
        </button>

        <button
          onClick={() => placePatternPiece('bodiceBack')}
          disabled={cutPiecesPlaced.bodiceBack || isCutFinished}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
            cutPiecesPlaced.bodiceBack
              ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
              : 'border-white/10 bg-[#3f2237] text-white hover:border-white/30'
          }`}
        >
          {cutPiecesPlaced.bodiceBack ? '✓ Trasero' : '+ Ubicar Trasero'}
        </button>

        <button
          onClick={() => placePatternPiece('skirt')}
          disabled={cutPiecesPlaced.skirt || isCutFinished}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
            cutPiecesPlaced.skirt
              ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
              : 'border-white/10 bg-[#3f2237] text-white hover:border-white/30'
          }`}
        >
          {cutPiecesPlaced.skirt ? '✓ Falda' : '+ Ubicar Falda'}
        </button>
      </div>

      {/* BOTÓN DISPARADOR DE CORTE */}
      <button
        onClick={triggerCutAnimation}
        disabled={!allPiecesPlaced || isCuttingAnimated || isCutFinished}
        className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-2 shadow-xl transition-all ${
          isCutFinished
            ? 'bg-emerald-500 text-white cursor-default'
            : allPiecesPlaced && !isCuttingAnimated
            ? 'bg-[#e8618c] hover:bg-[#f3739c] text-white shadow-pink-500/25 active:scale-95 cursor-pointer'
            : 'bg-[#4a2e43] text-[#805f77] cursor-not-allowed opacity-50'
        }`}
      >
        <Scissors className="w-4 h-4" />
        <span>{isCutFinished ? '✓ Piezas Cortadas con Éxito' : isCuttingAnimated ? 'Cortando Tela...' : '¡Cortar con Tijeras!'}</span>
      </button>

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
          disabled={!isCutFinished}
          className={`flex-1 py-3.5 rounded-2xl font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all ${
            isCutFinished
              ? 'bg-[#f6c344] hover:bg-[#ffd152] text-[#261321] shadow-xl shadow-amber-400/20 active:scale-95 cursor-pointer'
              : 'bg-[#4a2e43] text-[#805f77] cursor-not-allowed opacity-50'
          }`}
        >
          <span>Siguiente: Coser en Máquina 3D</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CuttingTable;
