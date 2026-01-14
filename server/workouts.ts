"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getWorkoutsByUserId,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "@/db/queries";
import type { Exercise } from "@/lib/workout";

export async function fetchWorkouts() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return getWorkoutsByUserId(session.user.id);
}

export async function fetchWorkout(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return getWorkoutById(id, session.user.id);
}

export async function syncWorkout(workoutData: {
  id: string;
  name: string;
  description: string | null;
  exercises: Exercise[];
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const existingWorkout = await getWorkoutById(workoutData.id, session.user.id);

  if (existingWorkout) {
    const serverUpdatedAt = new Date(existingWorkout.updatedAt);
    const localUpdatedAt = new Date();
    const exercisesUpdatedAt =
      workoutData.exercises.length > 0
        ? new Date(workoutData.exercises[workoutData.exercises.length - 1].updatedAt)
        : localUpdatedAt;

    if (serverUpdatedAt > localUpdatedAt && serverUpdatedAt > exercisesUpdatedAt) {
      return existingWorkout;
    }

    return updateWorkout(workoutData.id, session.user.id, {
      name: workoutData.name,
      description: workoutData.description,
      exercises: workoutData.exercises,
    });
  }

  return createWorkout({
    id: workoutData.id,
    name: workoutData.name,
    description: workoutData.description,
    exercises: workoutData.exercises,
    userId: session.user.id,
  });
}

export async function removeWorkout(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return deleteWorkout(id, session.user.id);
}
