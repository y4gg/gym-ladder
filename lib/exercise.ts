import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NewExercise {
  name: string;
  repsMin: number;
  repsMax: number | null;
  sets: number;
  weight: number;
  notes: string | null;
}

export interface Exercise extends NewExercise {
  id: string;
  workoutId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ExerciseStore {
  exercises: Exercise[];
  newExercise: () => void;
  deleteExercise: () => void;
}

const useExercises = create<ExerciseStore>((set) => ({
  exercises: [
    {
      id: "b8lrbmv7p3kclobjz3ecvw98",
      name: "Ball crusher",
      repsMin: 8,
      repsMax: null,
      sets: 3,
      weight: 30,
      notes: null,
      workoutId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  newExercise: () => {},
  deleteExercise: () => {},
}));
