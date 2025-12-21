import { createId } from "@paralleldrive/cuid2";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NewExercise {
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

export const useExercises = create<ExerciseStore>()(
  persist(
    (set) => ({
      exercises: [],
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
    }),
    {
      name: "exercise-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.exercises) {
          // Convert date strings back to Date objects
          state.exercises = state.exercises.map((exercise) => ({
            ...exercise,
            createdAt: new Date(exercise.createdAt),
            updatedAt: new Date(exercise.updatedAt),
          }));
        }
      },
    }
  )
);
