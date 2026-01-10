import { createId } from "@paralleldrive/cuid2";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface NewExercise {
  id: string;
  name: string;
  notes: string | null;
  sets: number;
  repsMin: number;
  repsMax: number | null;
  weight: number;
}

export interface Exercise extends NewExercise {
  updatedAt: Date;
  createdAt: Date;
}

export interface NewWorkout {
  name: string;
  notes: string | null;
}

export interface Workout extends NewWorkout {
  id: string;

  createdAt: Date;
  updatedAt: Date;
  exercises: Exercise[];
}

interface WorkoutStore {
  workouts: Workout[];
  addWorkout: (workout: NewWorkout) => void;
  removeWorkout: (id: string) => void;
  updateWorkout: (id: string, workout: Partial<NewWorkout>) => void;

  addExerciseToWorkout: (workoutId: string, exercise: NewExercise) => void;
  removeExerciseFromWorkout: (workoutId: string, exerciseId: string) => void;
  updateExerciseInWorkout: (
    workoutId: string,
    exerciseId: string,
    exercise: Partial<NewExercise>
  ) => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      workouts: [],
      addWorkout: (workout) =>
        set((state) => ({
          workouts: [...state.workouts, createWorkout(workout)],
        })),
      removeWorkout: (id) =>
        set((state) => ({
          workouts: state.workouts.filter((workout) => workout.id !== id),
        })),
      updateWorkout: (id, workout) =>
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, ...workout, updatedAt: new Date() } : w
          ),
        })),

      // Exercise part (doin this comment so prettier will not format this)
      addExerciseToWorkout: (workoutId, exercise) =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: [...workout.exercises, createExercise(exercise)],
                  updatedAt: new Date(),
                }
              : workout
          ),
        })),
      removeExerciseFromWorkout: (workoutId, exerciseId) =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: workout.exercises.filter(
                    (e) => e.id !== exerciseId
                  ),
                }
              : workout
          ),
        })),
      updateExerciseInWorkout: (workoutId, exerciseId, exercise) =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: workout.exercises.map((e) =>
                    e.id === exerciseId
                      ? { ...e, ...exercise, updatedAt: new Date() }
                      : e
                  ),
                  updatedAt: new Date(),
                }
              : workout
          ),
        })),
    }),

    {
      name: "exercise-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

function createWorkout(workout: NewWorkout): Workout {
  return {
    id: createId(),
    name: workout.name,
    notes: workout.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
    exercises: [],
  };
}

function createExercise(exercise: NewExercise): Exercise {
  return {
    id: createId(),
    name: exercise.name,
    notes: exercise.notes,
    sets: exercise.sets,
    repsMin: exercise.repsMin,
    repsMax: exercise.repsMax,
    weight: exercise.weight,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
