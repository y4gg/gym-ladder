import { create } from "zustand";

interface exercisePosStore {
  currentExercise: number;
  next: () => void;
  previous: () => void;
  setCurrent: (position: number) => void;
}

export const useExercisePosStore = create<exercisePosStore>((set) => ({
  currentExercise: 0,
  next: () =>
    set((state) => ({
      currentExercise: state.currentExercise + 1,
    })),
  previous: () =>
    set((state) => ({
      currentExercise: state.currentExercise - 1,
    })),
  setCurrent: (position: number) => set({ currentExercise: position }),
}));
