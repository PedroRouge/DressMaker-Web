// src/store/useGameStore.ts
import { create } from 'zustand';

export type GamePhase = 'START' | 'MEASURE' | 'DESIGN' | 'FABRIC' | 'CUT' | 'SEW' | 'DELIVERY';

export interface ClientOrder {
  id: string;
  clientName: string;
  avatar: string;
  occasion: string;
  description: string;
  requiredTags: string[];
  budget: number;
  rewardStars: number;
  deadlineMinutes: number;
}

export interface Measurements {
  bust: number | null;
  waist: number | null;
  hips: number | null;
}

export interface DesignChoice {
  cut: 'entallado' | 'recto' | 'peplum' | 'imperio';
  skirtLength: 'corta' | 'midi' | 'larga';
  neckline: 'redondo' | 'cuadrado' | 'enV' | 'corazon' | 'barco';
  sleeve: 'sin_mangas' | 'corta' | 'abullonada';
  tags: string[];
}

export interface FabricItem {
  id: string;
  name: string;
  color: string;
  price: number;
  roughness: number;
  metalness: number;
  tag: string;
}

interface GameState {
  // Estado base del juego
  phase: GamePhase;
  coins: number;
  stars: number;
  currentOrder: ClientOrder;
  
  // Medición
  measurements: Measurements;
  activeMeasurePart: 'bust' | 'waist' | 'hips';
  tempMeasureValue: number;

  // Diseño
  design: DesignChoice;

  // Tela & Patronaje
  selectedFabric: FabricItem;
  cutProgress: number;

  // Costura (Minijuego 2D)
  sewingScore: number;
  sewingStitches: number;

  // Acciones
  setPhase: (phase: GamePhase) => void;
  nextPhase: () => void;
  prevPhase: () => void;
  addCoins: (amount: number) => void;
  addStars: (amount: number) => void;
  setOrder: (order: ClientOrder) => void;

  // Acciones de Medición
  setActiveMeasurePart: (part: 'bust' | 'waist' | 'hips') => void;
  setTempMeasureValue: (val: number) => void;
  lockMeasurement: () => void;

  // Acciones de Diseño
  setCut: (cut: DesignChoice['cut'], tags: string[]) => void;
  setSkirtLength: (length: DesignChoice['skirtLength'], tags: string[]) => void;
  setNeckline: (neckline: DesignChoice['neckline']) => void;
  setSleeve: (sleeve: DesignChoice['sleeve']) => void;

  // Acciones de Tela
  selectFabric: (fabric: FabricItem) => boolean;

  // Acciones de Corte y Costura
  setCutProgress: (prog: number) => void;
  addStitch: (quality: 'PERFECT' | 'GOOD' | 'MISS') => void;

  // Reiniciar juego / Nuevo cliente
  resetGame: () => void;
}

export const FABRICS: FabricItem[] = [
  { id: 'lino-crudo', name: 'Lino Atelier Crudo', color: '#ebdccb', price: 0, roughness: 0.9, metalness: 0.05, tag: 'vintage' },
  { id: 'seda-rosa', name: 'Seda Rosa Romántica', color: '#f3a6b8', price: 30, roughness: 0.25, metalness: 0.35, tag: 'romántico' },
  { id: 'terciopelo-vino', name: 'Terciopelo Borgoña', color: '#681c2f', price: 45, roughness: 0.85, metalness: 0.1, tag: 'glamuroso' },
  { id: 'satén-marfil', name: 'Satén Marfil', color: '#fdfbf7', price: 25, roughness: 0.2, metalness: 0.4, tag: 'profesional' },
  { id: 'medianoche', name: 'Crepé Azul Noche', color: '#1e272e', price: 40, roughness: 0.6, metalness: 0.15, tag: 'minimalista' },
  { id: 'esmeralda', name: 'Brocado Esmeralda', color: '#10ac84', price: 50, roughness: 0.4, metalness: 0.3, tag: 'vintage' }
];

const INITIAL_ORDER: ClientOrder = {
  id: 'order-1',
  clientName: 'Elena Rostova',
  avatar: '👩🏼',
  occasion: 'Banquete de Primavera',
  description: 'Deseo un vestido sofisticado con un aire vintage y romántico. ¡Confío en tu criterio para la silueta!',
  requiredTags: ['vintage', 'romántico'],
  budget: 120,
  rewardStars: 2,
  deadlineMinutes: 10
};

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'START',
  coins: 150,
  stars: 3,
  currentOrder: INITIAL_ORDER,

  measurements: {
    bust: null,
    waist: null,
    hips: null
  },
  activeMeasurePart: 'bust',
  tempMeasureValue: 88.3,

  design: {
    cut: 'entallado',
    skirtLength: 'midi',
    neckline: 'redondo',
    sleeve: 'sin_mangas',
    tags: ['glamuroso', 'romántico']
  },

  selectedFabric: FABRICS[0],
  cutProgress: 0,
  sewingScore: 0,
  sewingStitches: 0,

  setPhase: (phase) => set({ phase }),

  nextPhase: () => {
    const phases: GamePhase[] = ['START', 'MEASURE', 'DESIGN', 'FABRIC', 'CUT', 'SEW', 'DELIVERY'];
    const currentIdx = phases.indexOf(get().phase);
    if (currentIdx < phases.length - 1) {
      set({ phase: phases[currentIdx + 1] });
    }
  },

  prevPhase: () => {
    const phases: GamePhase[] = ['START', 'MEASURE', 'DESIGN', 'FABRIC', 'CUT', 'SEW', 'DELIVERY'];
    const currentIdx = phases.indexOf(get().phase);
    if (currentIdx > 0) {
      set({ phase: phases[currentIdx - 1] });
    }
  },

  addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),
  addStars: (amount) => set((s) => ({ stars: s.stars + amount })),
  setOrder: (order) => set({ currentOrder: order }),

  setActiveMeasurePart: (part) => {
    const current = get().measurements[part];
    let defaultVal = 88.3;
    if (part === 'waist') defaultVal = 65.4;
    if (part === 'hips') defaultVal = 94.2;
    set({
      activeMeasurePart: part,
      tempMeasureValue: current !== null ? current : defaultVal
    });
  },

  setTempMeasureValue: (val) => set({ tempMeasureValue: parseFloat(val.toFixed(1)) }),

  lockMeasurement: () => {
    const { activeMeasurePart, tempMeasureValue, measurements } = get();
    const updated = { ...measurements, [activeMeasurePart]: tempMeasureValue };

    // Siguiente parte a medir automáticamente
    let nextPart: 'bust' | 'waist' | 'hips' = activeMeasurePart;
    let nextVal = 65.4;
    if (activeMeasurePart === 'bust' && !updated.waist) {
      nextPart = 'waist';
      nextVal = 65.4;
    } else if (activeMeasurePart === 'waist' && !updated.hips) {
      nextPart = 'hips';
      nextVal = 94.2;
    }

    set({
      measurements: updated,
      activeMeasurePart: nextPart,
      tempMeasureValue: updated[nextPart] !== null ? updated[nextPart]! : nextVal
    });
  },

  setCut: (cut, tags) => {
    set((s) => ({
      design: { ...s.design, cut, tags: Array.from(new Set([...s.design.tags, ...tags])) }
    }));
  },

  setSkirtLength: (skirtLength, tags) => {
    set((s) => ({
      design: { ...s.design, skirtLength, tags: Array.from(new Set([...s.design.tags, ...tags])) }
    }));
  },

  setNeckline: (neckline) => {
    set((s) => ({
      design: { ...s.design, neckline }
    }));
  },

  setSleeve: (sleeve) => {
    set((s) => ({
      design: { ...s.design, sleeve }
    }));
  },

  selectFabric: (fabric) => {
    const { coins } = get();
    if (coins >= fabric.price) {
      set({
        selectedFabric: fabric,
        coins: coins - fabric.price
      });
      return true;
    }
    return false;
  },

  setCutProgress: (prog) => set({ cutProgress: Math.min(100, Math.max(0, prog)) }),

  addStitch: (quality) => {
    set((s) => {
      let bonus = 10;
      if (quality === 'PERFECT') bonus = 25;
      if (quality === 'GOOD') bonus = 15;
      if (quality === 'MISS') bonus = -5;
      return {
        sewingScore: Math.max(0, s.sewingScore + bonus),
        sewingStitches: s.sewingStitches + 1
      };
    });
  },

  resetGame: () => {
    const newClients: ClientOrder[] = [
      {
        id: 'order-2',
        clientName: 'Valeria Dupont',
        avatar: '👩🏻‍🦰',
        occasion: 'Cóctel en la Ópera',
        description: 'Busco algo glamuroso y entallado, con telas de calidad.',
        requiredTags: ['glamuroso', 'profesional'],
        budget: 150,
        rewardStars: 3,
        deadlineMinutes: 12
      },
      {
        id: 'order-3',
        clientName: 'Camila Morales',
        avatar: '👱🏻‍♀️',
        occasion: 'Boda en el Jardín',
        description: 'Un look romántico y fluido con un corte cómodo y delicado.',
        requiredTags: ['romántico', 'vintage'],
        budget: 135,
        rewardStars: 2,
        deadlineMinutes: 8
      }
    ];

    const randomClient = newClients[Math.floor(Math.random() * newClients.length)];

    set({
      phase: 'START',
      currentOrder: randomClient,
      measurements: { bust: null, waist: null, hips: null },
      activeMeasurePart: 'bust',
      tempMeasureValue: 88.3,
      design: {
        cut: 'entallado',
        skirtLength: 'midi',
        neckline: 'redondo',
        sleeve: 'sin_mangas',
        tags: ['glamuroso', 'romántico']
      },
      selectedFabric: FABRICS[0],
      cutProgress: 0,
      sewingScore: 0,
      sewingStitches: 0
    });
  }
}));
