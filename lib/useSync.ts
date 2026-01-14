"use client";

import { useEffect, useCallback, useRef } from "react";
import { useWorkoutStore, type Workout } from "@/lib/workout";
import {
  fetchWorkouts,
  syncWorkout,
  removeWorkout as removeWorkoutServer,
} from "@/server/workouts";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function useSync() {
  const { workouts, setWorkouts, updateWorkout, removeWorkout } =
    useWorkoutStore();

  const syncWorkouts = useCallback(async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      return;
    }

    try {
      const serverWorkouts = await fetchWorkouts();

      const mergedWorkouts = serverWorkouts.map((serverWorkout) => {
        const localWorkout = workouts.find((w) => w.id === serverWorkout.id);

        if (localWorkout) {
          const serverUpdatedAt = new Date(serverWorkout.updatedAt);
          const localUpdatedAt = new Date(localWorkout.updatedAt);

          const exercisesUpdatedAt =
            localWorkout.exercises.length > 0
              ? new Date(
                  localWorkout.exercises[localWorkout.exercises.length - 1]
                    .updatedAt
                )
              : localUpdatedAt;

          const maxLocalUpdatedAt =
            localUpdatedAt > exercisesUpdatedAt
              ? localUpdatedAt
              : exercisesUpdatedAt;

          if (serverUpdatedAt > maxLocalUpdatedAt) {
            return {
              ...serverWorkout,
              createdAt: new Date(serverWorkout.createdAt),
              updatedAt: new Date(serverWorkout.updatedAt),
              exercises: serverWorkout.exercises.map((exercise) => ({
                ...exercise,
                createdAt: new Date(exercise.createdAt),
                updatedAt: new Date(exercise.updatedAt),
              })),
            } as Workout;
          }
          return localWorkout;
        }

        return {
          ...serverWorkout,
          createdAt: new Date(serverWorkout.createdAt),
          updatedAt: new Date(serverWorkout.updatedAt),
          exercises: serverWorkout.exercises.map((exercise) => ({
            ...exercise,
            createdAt: new Date(exercise.createdAt),
            updatedAt: new Date(exercise.updatedAt),
          })),
        } as Workout;
      });

      const localOnlyWorkouts = workouts.filter(
        (localWorkout) =>
          !serverWorkouts.find((serverWorkout) => serverWorkout.id === localWorkout.id)
      );

      const syncedLocalWorkouts = [];
      for (const localWorkout of localOnlyWorkouts) {
        try {
          const syncedWorkout = await syncWorkout(localWorkout);
          syncedLocalWorkouts.push(syncedWorkout ?? localWorkout);
        } catch (error) {
          console.error(`Failed to sync workout ${localWorkout.id}:`, error);
          syncedLocalWorkouts.push(localWorkout);
        }
      }

      setWorkouts([...mergedWorkouts, ...syncedLocalWorkouts]);
    } catch (error) {
      console.error("Failed to sync workouts:", error);
      toast.error("Failed to sync workouts");
    }
  }, [workouts, setWorkouts]);

  const syncSingleWorkout = async (workout: Workout) => {
    const session = await authClient.getSession();
    if (!session.data) {
      return;
    }

    try {
      const syncedWorkout = await syncWorkout(workout);
      if (syncedWorkout) {
        updateWorkout(workout.id, {
          name: syncedWorkout.name,
          description: syncedWorkout.description,
        });
      }
    } catch (error) {
      console.error("Failed to sync workout:", error);
      toast.error("Failed to sync workout");
    }
  };

  const syncDeleteWorkout = async (id: string) => {
    const session = await authClient.getSession();
    if (!session.data) {
      removeWorkout(id);
      return;
    }

    try {
      await removeWorkoutServer(id);
      removeWorkout(id);
    } catch (error) {
      console.error("Failed to delete workout:", error);
      toast.error("Failed to delete workout");
    }
  };

  return { syncWorkouts, syncSingleWorkout, syncDeleteWorkout };
}

export function useSyncOnMount() {
  const { syncWorkouts } = useSync();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!hasSynced.current) {
      hasSynced.current = true;
      syncWorkouts();
    }
  }, [syncWorkouts]);
}
