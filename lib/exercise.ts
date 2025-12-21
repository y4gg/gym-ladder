import { createId } from "@paralleldrive/cuid2";
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
  newExercise: (workoutId: string, newExercise: NewExercise) => void;
  deleteExercise: (exerciseId: string) => void;
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
  newExercise: (workoutId, newExercise) => {
    const exercise: Exercise = {
      id: createId(),
      name: newExercise.name,
      repsMin: newExercise.repsMin,
      repsMax: newExercise.repsMax,
      sets: newExercise.sets,
      weight: newExercise.weight,
      notes: newExercise.notes,
      workoutId: workoutId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      exercises: [...state.exercises, exercise],
    }));
  },
  deleteExercise: () => {},
}));
