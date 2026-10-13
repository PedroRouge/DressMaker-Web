import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * Estado global del juego.
 * - loading: indica si los assets están listos.
 * - cameraPosition: posición inicial de la cámara.
 * - outfits: array de outfits creados (placeholder).
 */
export const useGameStore = create(
  immer((set, get) => ({
    loading: true,
    cameraPosition: [0, 2, 5],
    outfits: [],

    // Inicializa el juego (carga assets, etc.)
    initialize: async () => {
      // Simular carga (puedes reemplazar por loaders reales)
      await new Promise((res) => setTimeout(res, 800));
      set((state) => {
        state.loading = false;
      });
    },

    // Añade un outfit al array (ejemplo de acción de store)
    addOutfit: (outfit) => {
      set((state) => {
        state.outfits.push(outfit);
      });
    }
  }))
);
