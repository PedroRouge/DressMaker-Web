import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useGameStore = create(
  immer((set) => ({
    loading: false,
    cameraPosition: [0, 1.2, 3.8],
    dressColor: '#e056fd',
    secondaryColor: '#f368e0',
    fabricType: 'satin',
    dressCut: 'flair', // 'flair' | 'sleek' | 'princess'
    hasBelt: true,
    hasNecklace: true,
    autoRotate: true,
    savedDesigns: [],

    setDressColor: (color) => {
      set((state) => {
        state.dressColor = color;
      });
    },

    setSecondaryColor: (color) => {
      set((state) => {
        state.secondaryColor = color;
      });
    },

    setFabricType: (fabric) => {
      set((state) => {
        state.fabricType = fabric;
      });
    },

    setDressCut: (cut) => {
      set((state) => {
        state.dressCut = cut;
      });
    },

    toggleBelt: () => {
      set((state) => {
        state.hasBelt = !state.hasBelt;
      });
    },

    toggleNecklace: () => {
      set((state) => {
        state.hasNecklace = !state.hasNecklace;
      });
    },

    toggleAutoRotate: () => {
      set((state) => {
        state.autoRotate = !state.autoRotate;
      });
    },

    saveCurrentDesign: () => {
      set((state) => {
        state.savedDesigns.push({
          id: Date.now(),
          color: state.dressColor,
          fabric: state.fabricType,
          cut: state.dressCut,
          createdAt: new Date().toLocaleTimeString()
        });
      });
    },

    initialize: async () => {
      set((state) => {
        state.loading = false;
      });
    }
  }))
);
