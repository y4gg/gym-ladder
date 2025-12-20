import { create } from "zustand";
import { createId } from "@paralleldrive/cuid2";

interface NewWorkout {
  name: string;
  description: string | null;
}

interface Workout extends NewWorkout {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkoutStore {
  workouts: Workout[];
  newWorkout: (workout: NewWorkout) => void;
  deleteWorkout: (id: string) => void;
  editWorkout: (id: string, workout: Partial<Workout>) => void;
}

export const useWorkouts = create<WorkoutStore>((set) => ({
  workouts: [],
  newWorkout: (workout: NewWorkout) => {
    const newWorkout: Workout = {
      id: createId(),
      name: workout.name,
      description: workout.description,
      createdAt: new Date(),
      updatedAt: new Date(),
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
}));
