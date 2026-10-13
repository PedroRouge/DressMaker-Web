// src/components/ui/panels/MeasurePanel.tsx
import React from 'react';
import { useGameStore } from '../../../store/useGameStore';
import { HelpCircle, Check, ArrowRight, Lock } from 'lucide-react';

export const MeasurePanel: React.FC = () => {
  const activeMeasurePart = useGameStore((s) => s.activeMeasurePart);
  const tempMeasureValue = useGameStore((s) => s.tempMeasureValue);
  const measurements = useGameStore((s) => s.measurements);
  const setActiveMeasurePart = useGameStore((s) => s.setActiveMeasurePart);
  const setTempMeasureValue = useGameStore((s) => s.setTempMeasureValue);
  const lockMeasurement = useGameStore((s) => s.lockMeasurement);
  const nextPhase = useGameStore((s) => s.nextPhase);

  const allMeasured =
    measurements.bust !== null && measurements.waist !== null && measurements.hips !== null;

  const partNames = {
    bust: 'Pecho',
    waist: 'Cintura',
    hips: 'Cadera'
  };

  const partIcons = {
    bust: '<>',
    waist: '><',
    hips: '<>'
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempMeasureValue(parseFloat(e.target.value));
  };

  return (
    <div className="flex flex-col gap-5 bg-[#311b2b]/95 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-right duration-300 select-none">
      {/* Encabezado con icono y ayuda */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#e8618c] flex items-center justify-center text-white text-lg font-bold shadow-md shadow-pink-500/20">
            📏
          </div>
          <h2 className="text-xl font-extrabold text-white">Tomar medidas</h2>
        </div>
        <button
          className="text-[#9c7891] hover:text-white transition-colors"
          title="Mueve la cinta métrica por el maniquí para encontrar el contorno exacto"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* 3 Tabs / Botones para Pecho, Cintura y Cadera */}
      <div className="grid grid-cols-3 gap-2">
        {(['bust', 'waist', 'hips'] as const).map((part) => {
          const isSelected = activeMeasurePart === part;
          const isLocked = measurements[part] !== null;

          return (
            <button
              key={part}
              onClick={() => setActiveMeasurePart(part)}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl border transition-all ${
                isSelected
                  ? 'border-[#e8618c] bg-[#e8618c]/15 shadow-md shadow-pink-500/10'
                  : 'border-white/5 bg-[#3f2237] hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-white mb-0.5">
                <span className="text-[#e8618c]">{partIcons[part]}</span>
                <span>{partNames[part]}</span>
              </div>
              <span className="text-[11px] font-medium text-[#c49db9]">
                {isLocked ? `${measurements[part]} cm` : '_'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selector / Ajuste del contorno de cinta métrica */}
      <div className="bg-[#3f2237] p-5 rounded-2xl border border-white/5 flex flex-col items-center gap-3">
        <span className="text-xs font-semibold text-[#c49db9]">
          Contorno de {partNames[activeMeasurePart]}:
        </span>

        {/* Medida gigante en cm */}
        <div className="text-4xl font-black text-white tracking-tight flex items-baseline gap-1">
          <span>{tempMeasureValue.toFixed(1).replace('.', ',')}</span>
          <span className="text-lg font-bold text-[#e8618c]">cm</span>
        </div>

        {/* Slider interactivo para medir */}
        <div className="w-full space-y-1">
          <input
            type="range"
            min={activeMeasurePart === 'waist' ? '58.0' : activeMeasurePart === 'bust' ? '78.0' : '84.0'}
            max={activeMeasurePart === 'waist' ? '82.0' : activeMeasurePart === 'bust' ? '106.0' : '112.0'}
            step="0.1"
            value={tempMeasureValue}
            onChange={handleSliderChange}
            className="w-full accent-[#e8618c] cursor-pointer h-2 bg-[#261321] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-[#9c7891] font-semibold">
            <span>Ajustado</span>
            <span className="text-[#e8618c]">↕ Ajustar cinta en el maniquí</span>
            <span>Holgado</span>
          </div>
        </div>

        {/* Botón rosa Fijar Medida */}
        <button
          onClick={lockMeasurement}
          className="w-full mt-2 py-3 bg-[#e8618c] hover:bg-[#f3739c] text-white font-extrabold rounded-2xl shadow-lg shadow-pink-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Lock className="w-4 h-4" />
          <span>Fijar {partNames[activeMeasurePart]}</span>
        </button>
      </div>

      {/* Mensaje de guía */}
      <p className="text-xs text-center text-[#d3b4cb]/80">
        Fija primero el contorno de pecho, cintura y cadera.
      </p>

      {/* Botón Siguiente */}
      <button
        onClick={nextPhase}
        disabled={!allMeasured}
        className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all ${
          allMeasured
            ? 'bg-[#f6c344] text-[#261321] hover:bg-[#fed35b] shadow-xl shadow-amber-400/20 cursor-pointer active:scale-95'
            : 'bg-[#4a2e43] text-[#805f77] cursor-not-allowed opacity-60'
        }`}
      >
        <span>Siguiente</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MeasurePanel;
