// src/store/useGameStore.ts
import { create } from 'zustand';

export type GamePhase =
  | 'START'
  | 'ORDER'
  | 'MEASURE'
  | 'DESIGN'
  | 'FABRIC'
  | 'CUT'
  | 'SEW'
  | 'DECORATE'
  | 'DELIVERY';

export interface ClientOrder {
  id: string;
  clientName: string;
  avatar: string;
  occasion: string;
  description: string;
  requiredTags: string[];
  budget: number;
  rewardStars: number;
  targetMeasurements: {
    bust: number;
    waist: number;
    hips: number;
  };
}

export interface Measurements {
  bust: number | null;
  waist: number | null;
  hips: number | null;
}

export interface DesignChoice {
  cut: 'entallado' | 'recto' | 'peplum' | 'imperio';
  skirtStyle: 'tubo' | 'evase' | 'plisada';
  neckline: 'redondo' | 'cuadrado' | 'enV' | 'corazon' | 'barco';
  sleeve: 'sin_mangas' | 'corta' | 'abullonada';
  tags: string[];
}

export interface FabricItem {
  id: string;
  name: string;
  patternType: 'vichy' | 'floral' | 'linen' | 'polka' | 'damask';
  baseColor: string;
  secondaryColor: string;
  price: number;
  roughness: number;
  metalness: number;
  tag: string;
}

export interface DecorationChoice {
  buttons: boolean; // Botones de nácar frontales
  bow: boolean;     // Lazo de satén en la cintura
  lace: boolean;    // Encaje floral en el dobladillo
  brooch: boolean;  // Broche de oro en el escote
}

interface GameState {
  phase: GamePhase;
  coins: number;
  stars: number;
  currentOrder: ClientOrder;

  // Medición y Precisión
  measurements: Measurements;
  activeMeasurePart: 'bust' | 'waist' | 'hips';
  tempMeasureValue: number;
  measureAccuracy: number; // Porcentaje calculado

  // Diseño y Telas
  design: DesignChoice;
  selectedFabric: FabricItem;

  // Mesa de Corte 2D
  cutPiecesPlaced: { bodiceFront: boolean; bodiceBack: boolean; skirt: boolean };
  isCuttingAnimated: boolean;
  cutProgress: number;
  cutAccuracy: number;

  // Mesa de Costura 3D / 2D
  sewingMode: 'auto' | 'manual';
  sewingNeedleActive: boolean;
  sewingLineProgress: number; // 0 - 100
  sewingDeviance: number;     // Desvío en modo manual
  sewingAccuracy: number;     // % final

  // Decoraciones
  decorations: DecorationChoice;

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
  setSkirtStyle: (style: DesignChoice['skirtStyle'], tags: string[]) => void;
  setNeckline: (neckline: DesignChoice['neckline']) => void;
  setSleeve: (sleeve: DesignChoice['sleeve']) => void;
  selectFabric: (fabric: FabricItem) => boolean;

  // Acciones de Corte
  placePatternPiece: (piece: 'bodiceFront' | 'bodiceBack' | 'skirt') => void;
  triggerCutAnimation: () => void;

  // Acciones de Costura
  setSewingMode: (mode: 'auto' | 'manual') => void;
  advanceSewing: (devianceOffset?: number) => void;

  // Acciones de Decoración
  toggleDecoration: (key: keyof DecorationChoice) => void;

  // Reiniciar
  resetGame: () => void;
}

export const FABRICS: FabricItem[] = [
  {
    id: 'lino-crudo',
    name: 'Lino Atelier con Trama',
    patternType: 'linen',
    baseColor: '#ebdccb',
    secondaryColor: '#dfcfbe',
    price: 0,
    roughness: 0.9,
    metalness: 0.05,
    tag: 'vintage'
  },
  {
    id: 'vichy-rosa',
    name: 'Algodón Vichy a Cuadros',
    patternType: 'vichy',
    baseColor: '#f8d7da',
    secondaryColor: '#e8618c',
    price: 35,
    roughness: 0.65,
    metalness: 0.1,
    tag: 'romántico'
  },
  {
    id: 'floral-primavera',
    name: 'Batista Floral Botánica',
    patternType: 'floral',
    baseColor: '#fbf7f4',
    secondaryColor: '#e55039',
    price: 45,
    roughness: 0.5,
    metalness: 0.15,
    tag: 'romántico'
  },
  {
    id: 'polka-vintage',
    name: 'Algodón Lunares Retro',
    patternType: 'polka',
    baseColor: '#2c3e50',
    secondaryColor: '#ffffff',
    price: 30,
    roughness: 0.6,
    metalness: 0.1,
    tag: 'vintage'
  },
  {
    id: 'damasco-oro',
    name: 'Brocado Damasco Imperial',
    patternType: 'damask',
    baseColor: '#1e272e',
    secondaryColor: '#f6c344',
    price: 60,
    roughness: 0.35,
    metalness: 0.45,
    tag: 'glamuroso'
  }
];

const DEFAULT_ORDERS: ClientOrder[] = [
  {
    id: 'order-1',
    clientName: 'Valeria Delacroix',
    avatar: '👩🏻‍🦰',
    occasion: 'Gala de Alta Sociedad',
    description: 'Necesito un vestido entallado con tela de textura exquisita y aire vintage. ¡El calce debe ser milimétrico!',
    requiredTags: ['vintage', 'glamuroso'],
    budget: 160,
    rewardStars: 3,
    targetMeasurements: {
      bust: 90.0,
      waist: 68.0,
      hips: 95.0
    }
  },
  {
    id: 'order-2',
    clientName: 'Camila Visconti',
    avatar: '👱🏻‍♀️',
    occasion: 'Boda de Verano',
    description: 'Busco algo romántico con caída vaporosa y estampados delicados.',
    requiredTags: ['romántico', 'vintage'],
    budget: 140,
    rewardStars: 2,
    targetMeasurements: {
      bust: 86.5,
      waist: 64.0,
      hips: 92.0
    }
  }
];

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'START',
  coins: 150,
  stars: 3,
  currentOrder: DEFAULT_ORDERS[0],

  measurements: { bust: null, waist: null, hips: null },
  activeMeasurePart: 'bust',
  tempMeasureValue: 90.0,
  measureAccuracy: 100,

  design: {
    cut: 'entallado',
    skirtStyle: 'evase',
    neckline: 'corazon',
    sleeve: 'sin_mangas',
    tags: ['glamuroso', 'vintage']
  },

  selectedFabric: FABRICS[1], // Vichy de inicio

  cutPiecesPlaced: { bodiceFront: false, bodiceBack: false, skirt: false },
  isCuttingAnimated: false,
  cutProgress: 0,
  cutAccuracy: 95,

  sewingMode: 'manual',
  sewingNeedleActive: false,
  sewingLineProgress: 0,
  sewingDeviance: 0,
  sewingAccuracy: 100,

  decorations: {
    buttons: true,
    bow: false,
    lace: false,
    brooch: false
  },

  setPhase: (phase) => set({ phase }),

  nextPhase: () => {
    const phases: GamePhase[] = [
      'START',
      'ORDER',
      'MEASURE',
      'DESIGN',
      'FABRIC',
      'CUT',
      'SEW',
      'DECORATE',
      'DELIVERY'
    ];
    const idx = phases.indexOf(get().phase);
    if (idx < phases.length - 1) {
      set({ phase: phases[idx + 1] });
    }
  },

  prevPhase: () => {
    const phases: GamePhase[] = [
      'START',
      'ORDER',
      'MEASURE',
      'DESIGN',
      'FABRIC',
      'CUT',
      'SEW',
      'DECORATE',
      'DELIVERY'
    ];
    const idx = phases.indexOf(get().phase);
    if (idx > 0) {
      set({ phase: phases[idx - 1] });
    }
  },

  addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),
  addStars: (amount) => set((s) => ({ stars: s.stars + amount })),
  setOrder: (order) => set({ currentOrder: order }),

  setActiveMeasurePart: (part) => {
    const { measurements, currentOrder } = get();
    const current = measurements[part];
    const target = currentOrder.targetMeasurements[part];
    set({
      activeMeasurePart: part,
      tempMeasureValue: current !== null ? current : target - 1.5 + Math.random() * 3
    });
  },

  setTempMeasureValue: (val) => set({ tempMeasureValue: parseFloat(val.toFixed(1)) }),

  lockMeasurement: () => {
    const { activeMeasurePart, tempMeasureValue, measurements, currentOrder } = get();
    const updated = { ...measurements, [activeMeasurePart]: tempMeasureValue };

    // Cálculo de precisión respecto a la medida real del cliente
    const target = currentOrder.targetMeasurements[activeMeasurePart];
    const diff = Math.abs(tempMeasureValue - target);
    const accuracyForPart = Math.max(50, Math.min(100, 100 - diff * 8));

    // Promedio de precisión
    let nextPart: 'bust' | 'waist' | 'hips' = activeMeasurePart;
    if (activeMeasurePart === 'bust' && !updated.waist) nextPart = 'waist';
    else if (activeMeasurePart === 'waist' && !updated.hips) nextPart = 'hips';

    set((s) => ({
      measurements: updated,
      activeMeasurePart: nextPart,
      tempMeasureValue: updated[nextPart] !== null ? updated[nextPart]! : currentOrder.targetMeasurements[nextPart],
      measureAccuracy: Math.round((s.measureAccuracy + accuracyForPart) / 2)
    }));
  },

  setCut: (cut, tags) => {
    set((s) => ({
      design: { ...s.design, cut, tags: Array.from(new Set([...s.design.tags, ...tags])) }
    }));
  },

  setSkirtStyle: (skirtStyle, tags) => {
    set((s) => ({
      design: { ...s.design, skirtStyle, tags: Array.from(new Set([...s.design.tags, ...tags])) }
    }));
  },

  setNeckline: (neckline) => set((s) => ({ design: { ...s.design, neckline } })),
  setSleeve: (sleeve) => set((s) => ({ design: { ...s.design, sleeve } })),

  selectFabric: (fabric) => {
    const { coins } = get();
    if (coins >= fabric.price) {
      set({ selectedFabric: fabric, coins: coins - fabric.price });
      return true;
    }
    return false;
  },

  placePatternPiece: (piece) => {
    set((s) => ({
      cutPiecesPlaced: { ...s.cutPiecesPlaced, [piece]: true }
    }));
  },

  triggerCutAnimation: () => {
    set({ isCuttingAnimated: true, cutProgress: 0 });
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      if (p >= 100) {
        clearInterval(interval);
        set({ isCuttingAnimated: false, cutProgress: 100 });
      } else {
        set({ cutProgress: p });
      }
    }, 45);
  },

  setSewingMode: (mode) => set({ sewingMode: mode }),

  advanceSewing: (devianceOffset = 0) => {
    set((s) => {
      const nextProg = Math.min(100, s.sewingLineProgress + 4);
      const penalty = Math.abs(devianceOffset) > 4 ? 3 : 0;
      return {
        sewingLineProgress: nextProg,
        sewingNeedleActive: nextProg < 100,
        sewingDeviance: devianceOffset,
        sewingAccuracy: Math.max(40, s.sewingAccuracy - penalty)
      };
    });
  },

  toggleDecoration: (key) => {
    set((s) => ({
      decorations: { ...s.decorations, [key]: !s.decorations[key] }
    }));
  },

  resetGame: () => {
    const nextOrder =
      DEFAULT_ORDERS[Math.floor(Math.random() * DEFAULT_ORDERS.length)];
    set({
      phase: 'ORDER',
      currentOrder: nextOrder,
      measurements: { bust: null, waist: null, hips: null },
      activeMeasurePart: 'bust',
      tempMeasureValue: nextOrder.targetMeasurements.bust,
      measureAccuracy: 100,
      cutPiecesPlaced: { bodiceFront: false, bodiceBack: false, skirt: false },
      cutProgress: 0,
      sewingLineProgress: 0,
      sewingAccuracy: 100,
      decorations: { buttons: true, bow: false, lace: false, brooch: false }
    });
  }
}));
