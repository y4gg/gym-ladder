import { create } from "zustand";

interface exercisePosStore {
  currentExercise: number;
  next: () => void;
  previous: () => void;
}

export const useExercisePosStore = create<exercisePosStore>((set) => ({
  currentExercise: 0,
  next: () =>
    set((state) => ({
      currentExercise: state.currentExercise++,
    })),
  previous: () =>
    set((state) => ({
      currentExercise: state.currentExercise--,
    })),
}));
