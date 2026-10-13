import { useGameStore } from '../../store/useGameStore.js';

const PALETTES = [
  { name: 'Rose', primary: '#ff7675', secondary: '#fab1a0' },
  { name: 'Orchid', primary: '#e056fd', secondary: '#f368e0' },
  { name: 'Sky', primary: '#0984e3', secondary: '#74b9ff' },
  { name: 'Emerald', primary: '#00b894', secondary: '#55efc4' },
  { name: 'Golden', primary: '#fdcb6e', secondary: '#ffeaa7' },
  { name: 'Midnight', primary: '#2d3436', secondary: '#636e72' },
  { name: 'Crimson', primary: '#d63031', secondary: '#ff7675' },
  { name: 'Lavanda', primary: '#6c5ce7', secondary: '#a29bfe' }
];

const FABRICS = [
  { id: 'satin', label: 'Satén Brillante', desc: 'Reflejos sedosos y brillo de pasarela' },
  { id: 'velvet', label: 'Terciopelo Mate', desc: 'Textura profunda y tacto suave' },
  { id: 'cotton', label: 'Algodón Clásico', desc: 'Acabado natural para el día a día' }
];

const CUTS = [
  { id: 'flair', label: 'Vuelo & Campana' },
  { id: 'princess', label: 'Corte Princesa' },
  { id: 'sleek', label: 'Sirena Entallada' }
];

export default function DressControls() {
  const dressColor = useGameStore((s) => s.dressColor);
  const fabricType = useGameStore((s) => s.fabricType);
  const dressCut = useGameStore((s) => s.dressCut);
  const hasBelt = useGameStore((s) => s.hasBelt);
  const hasNecklace = useGameStore((s) => s.hasNecklace);
  const autoRotate = useGameStore((s) => s.autoRotate);
  const savedDesigns = useGameStore((s) => s.savedDesigns);

  const setDressColor = useGameStore((s) => s.setDressColor);
  const setSecondaryColor = useGameStore((s) => s.setSecondaryColor);
  const setFabricType = useGameStore((s) => s.setFabricType);
  const setDressCut = useGameStore((s) => s.setDressCut);
  const toggleBelt = useGameStore((s) => s.toggleBelt);
  const toggleNecklace = useGameStore((s) => s.toggleNecklace);
  const toggleAutoRotate = useGameStore((s) => s.toggleAutoRotate);
  const saveCurrentDesign = useGameStore((s) => s.saveCurrentDesign);

  return (
    <div className="flex flex-col gap-5 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto">
      <div>
        <span className="text-xs uppercase tracking-widest text-pink-400 font-bold">Atelier de Alta Costura</span>
        <h2 className="text-xl font-extrabold text-white">Diseña tu Vestido</h2>
      </div>

      {/* Selector de Paletas de Color */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">Paleta y Tonos</label>
        <div className="grid grid-cols-4 gap-2">
          {PALETTES.map((p) => {
            const isSelected = dressColor === p.primary;
            return (
              <button
                key={p.name}
                onClick={() => {
                  setDressColor(p.primary);
                  setSecondaryColor(p.secondary);
                }}
                className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-pink-500 bg-pink-500/20 scale-105 shadow-md shadow-pink-500/30'
                    : 'border-white/10 hover:border-white/30 bg-slate-800/50'
                }`}
              >
                <div className="flex -space-x-1 mb-1">
                  <div
                    className="w-4 h-4 rounded-full border border-black/30"
                    style={{ backgroundColor: p.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-black/30"
                    style={{ backgroundColor: p.secondary }}
                  />
                </div>
                <span className="text-[10px] text-slate-300 font-medium">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de Corte de Falda */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">Corte & Silueta</label>
        <div className="grid grid-cols-3 gap-2">
          {CUTS.map((cut) => {
            const isSelected = dressCut === cut.id;
            return (
              <button
                key={cut.id}
                onClick={() => setDressCut(cut.id)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'border-pink-500 bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-white shadow-md'
                    : 'border-white/10 text-slate-400 hover:border-white/30 bg-slate-800/40'
                }`}
              >
                {cut.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de Tela */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">Tejido & Acabado</label>
        <div className="flex flex-col gap-2">
          {FABRICS.map((fabric) => {
            const isSelected = fabricType === fabric.id;
            return (
              <button
                key={fabric.id}
                onClick={() => setFabricType(fabric.id)}
                className={`flex justify-between items-center px-3 py-2 rounded-xl text-xs border text-left transition-all ${
                  isSelected
                    ? 'border-pink-500 bg-pink-500/20 text-white font-bold'
                    : 'border-white/10 text-slate-300 hover:border-white/20 bg-slate-800/30'
                }`}
              >
                <span>{fabric.label}</span>
                <span className="text-[10px] text-slate-400">{fabric.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accesorios y Opciones */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">Detalles & Accesorios</label>
        <div className="flex gap-2">
          <button
            onClick={toggleBelt}
            className={`flex-1 py-2 rounded-xl text-xs border font-medium transition-all ${
              hasBelt
                ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                : 'border-white/10 text-slate-400 bg-slate-800/40'
            }`}
          >
            {hasBelt ? '✓ Cinturón' : '+ Cinturón'}
          </button>
          <button
            onClick={toggleNecklace}
            className={`flex-1 py-2 rounded-xl text-xs border font-medium transition-all ${
              hasNecklace
                ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                : 'border-white/10 text-slate-400 bg-slate-800/40'
            }`}
          >
            {hasNecklace ? '✓ Gargantilla' : '+ Gargantilla'}
          </button>
          <button
            onClick={toggleAutoRotate}
            className={`px-3 py-2 rounded-xl text-xs border font-medium transition-all ${
              autoRotate
                ? 'border-blue-400 bg-blue-400/20 text-blue-200'
                : 'border-white/10 text-slate-400 bg-slate-800/40'
            }`}
            title="Pausar o reanudar rotación 360"
          >
            {autoRotate ? '⏸ 360°' : '▶ 360°'}
          </button>
        </div>
      </div>

      {/* Botón de Guardar / Snapshot del Look */}
      <button
        onClick={saveCurrentDesign}
        className="mt-2 w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
      >
        <span>📸 Guardar Colección</span>
        {savedDesigns.length > 0 && (
          <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
            {savedDesigns.length}
          </span>
        )}
      </button>
    </div>
  );
}
