"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getWorkoutsByUserId,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getExerciseHistoryByName,
  addExerciseHistoryEntry,
  createSharedWorkout,
  getSharedWorkoutById,
  getSharedWorkoutByWorkoutId,
  deleteSharedWorkout,
} from "@/db/queries";
import type { Exercise } from "@/lib/workout";
import { createId } from "@paralleldrive/cuid2";

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

    const updatedWorkout = await updateWorkout(workoutData.id, session.user.id, {
      name: workoutData.name,
      description: workoutData.description,
      exercises: workoutData.exercises,
    });

    return updatedWorkout;
  }

  const newWorkout = await createWorkout({
    id: workoutData.id,
    name: workoutData.name,
    description: workoutData.description,
    exercises: workoutData.exercises,
    userId: session.user.id,
  });

  for (const exercise of workoutData.exercises) {
    const existingHistory = await getExerciseHistoryByName(
      exercise.name,
      session.user.id
    );
    if (existingHistory.length === 0) {
      await addExerciseHistoryEntry({
        id: createId(),
        exerciseName: exercise.name,
        weight: exercise.weight,
        sets: exercise.sets,
        repsMin: exercise.repsMin,
        repsMax: exercise.repsMax,
        userId: session.user.id,
        workoutId: newWorkout.id,
      });
    }
  }

  return newWorkout;
}

export async function removeWorkout(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return deleteWorkout(id, session.user.id);
}

export async function fetchExerciseHistory(exerciseName: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return getExerciseHistoryByName(exerciseName, session.user.id);
}

export async function recordInitialExerciseHistory(exercise: {
  name: string;
  weight: number;
  sets: number;
  repsMin: number;
  repsMax: number | null;
  workoutId: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return addExerciseHistoryEntry({
    id: createId(),
    exerciseName: exercise.name,
    weight: exercise.weight,
    sets: exercise.sets,
    repsMin: exercise.repsMin,
    repsMax: exercise.repsMax,
    userId: session.user.id,
    workoutId: exercise.workoutId,
  });
}

export async function recordWeightUpdateHistory(exercise: {
  id: string;
  name: string;
  weight: number;
  sets: number;
  repsMin: number;
  repsMax: number | null;
  workoutId: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return addExerciseHistoryEntry({
    id: createId(),
    exerciseName: exercise.name,
    weight: exercise.weight,
    sets: exercise.sets,
    repsMin: exercise.repsMin,
    repsMax: exercise.repsMax,
    userId: session.user.id,
    workoutId: exercise.workoutId,
  });
}

export async function shareWorkout(workoutId: string, shareNotes: boolean) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const workoutData = await getWorkoutById(workoutId, session.user.id);
  if (!workoutData) {
    throw new Error("Workout not found");
  }

  const existingShare = await getSharedWorkoutByWorkoutId(workoutId, session.user.id);
  if (existingShare) {
    return existingShare;
  }

  const shareId = createId();
  const share = await createSharedWorkout({
    id: shareId,
    workoutId,
    userId: session.user.id,
    shareNotes,
  });

  return share;
}

export async function fetchSharedWorkout(shareId: string) {
  const share = await getSharedWorkoutById(shareId);

  if (!share) {
    return null;
  }

  const exercises = share.workout.exercises.map((exercise) => {
    const sanitizedExercise = {
      id: exercise.id,
      name: exercise.name,
      sets: exercise.sets,
      repsMin: exercise.repsMin,
      repsMax: exercise.repsMax,
    } as {
      id: string;
      name: string;
      sets: number;
      repsMin: number;
      repsMax: number | null;
      notes?: string | null;
    };

    if (share.shareNotes && exercise.notes) {
      sanitizedExercise.notes = exercise.notes;
    }

    return sanitizedExercise;
  });

  return {
    id: share.id,
    workout: {
      id: share.workout.id,
      name: share.workout.name,
      description: share.workout.description,
      exercises,
    },
    sharedBy: share.user.name,
    createdAt: share.createdAt,
    shareNotes: share.shareNotes,
  };
}

export async function removeShare(shareId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return deleteSharedWorkout(shareId, session.user.id);
}

export async function copySharedWorkout(shareId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const share = await getSharedWorkoutById(shareId);

  if (!share) {
    throw new Error("Shared workout not found");
  }

  const newWorkoutId = createId();
  const exercisesWithDefaults = share.workout.exercises.map((exercise) => ({
    ...exercise,
    weight: 0,
    id: createId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const newWorkout = await createWorkout({
    id: newWorkoutId,
    name: `${share.workout.name} (Copy)`,
    description: share.workout.description,
    exercises: exercisesWithDefaults,
    userId: session.user.id,
  });

  return newWorkout;
}
