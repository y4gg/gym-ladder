import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createId } from "@paralleldrive/cuid2";

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
  createdAt: Date;
  updatedAt: Date;
}

interface NewWorkout {
  name: string;
  description: string | null;
}

interface Workout extends NewWorkout {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  exercises: Exercise[];
}

interface WorkoutStore {
  workouts: Workout[];
  newWorkout: (workout: NewWorkout) => void;
  deleteWorkout: (id: string) => void;
  editWorkout: (id: string, workout: Partial<Workout>) => void;
  getExercises: (workoutId: string) => void
  addExerciseToWorkout: (workoutId: string, exercise: NewExercise) => void;
  deleteExerciseFromWorkout: (workoutId: string, exerciseId: string) => void;
  updateExerciseInWorkout: (
    workoutId: string,
    exerciseId: string,
    exercise: Partial<Exercise>
  ) => void;
}

export const useWorkouts = create<WorkoutStore>()(
  persist(
    (set) => ({
      workouts: [],
      newWorkout: (workout: NewWorkout) => {
        const newWorkout: Workout = {
          id: createId(),
          name: workout.name,
          description: workout.description,
          createdAt: new Date(),
          updatedAt: new Date(),
          exercises: [],
        };
        set((state) => ({
          workouts: [...state.workouts, newWorkout],
        }));
      },
      deleteWorkout: (id: string) => {
        set((state) => ({
          workouts: state.workouts.filter((workout) => workout.id !== id),
        }));
      },
      editWorkout: (id: string, workout: Partial<Workout>) => {
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, ...workout, updatedAt: new Date() } : w
          ),
        }));
      },
      getExercises: (workoutId) => {},
      addExerciseToWorkout: (workoutId, exercise) => {
        const newExercise: Exercise = {
          id: createId(),
          name: exercise.name,
          repsMin: exercise.repsMin,
          repsMax: exercise.repsMax,
          sets: exercise.sets,
          weight: exercise.weight,
          notes: exercise.notes,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: [...workout.exercises, newExercise],
                  updatedAt: new Date(),
                }
              : workout
          ),
        }));
      },
      deleteExerciseFromWorkout: (workoutId, exerciseId) => {
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: workout.exercises.filter(
                    (e) => e.id !== exerciseId
                  ),
                  updatedAt: new Date(),
                }
              : workout
          ),
        }));
      },
      updateExerciseInWorkout: (workoutId, exerciseId, exercise) => {
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
        }));
      },
    }),
    {
      name: "workout-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.workouts) {
          // Convert date strings back to Date objects
          state.workouts = state.workouts.map((workout) => ({
            ...workout,
            createdAt: new Date(workout.createdAt),
            updatedAt: new Date(workout.updatedAt),
            exercises: workout.exercises.map((exercise) => ({
              ...exercise,
              createdAt: new Date(exercise.createdAt),
              updatedAt: new Date(exercise.updatedAt),
            })),
          }));
        }
      },
    }
  )
);
