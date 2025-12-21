import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createId } from "@paralleldrive/cuid2";

interface NewWorkout {
  name: string;
  description: string | null;
}

interface Workout extends NewWorkout {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  exerciseIds: string[];
}

interface WorkoutStore {
  workouts: Workout[];
  newWorkout: (workout: NewWorkout) => void;
  deleteWorkout: (id: string) => void;
  editWorkout: (id: string, workout: Partial<Workout>) => void;
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
          exerciseIds: [],
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
      editWorkout: (id: string, workout: Partial<Workout>) => {},
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
          }));
        }
      },
    }
  )
);
