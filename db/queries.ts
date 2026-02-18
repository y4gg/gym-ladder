import { db } from "@/db";
import { workout, exerciseHistory, sharedWorkout, user } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import type { Exercise } from "@/lib/workout";

export async function getWorkoutsByUserId(userId: string) {
  const workouts = await db
    .select()
    .from(workout)
    .where(eq(workout.userId, userId))
    .orderBy(desc(workout.updatedAt));
  return workouts;
}

export async function getWorkoutById(id: string, userId: string) {
  const [workoutData] = await db
    .select()
    .from(workout)
    .where(eq(workout.id, id))
    .limit(1);

  if (workoutData && workoutData.userId !== userId) {
    return null;
  }

  return workoutData;
}

export async function createWorkout(
  workoutData: {
    id: string;
    name: string;
    description: string | null;
    exercises: Exercise[];
    userId: string;
  }
) {
  const [newWorkout] = await db.insert(workout).values(workoutData).returning();
  return newWorkout;
}

export async function updateWorkout(
  id: string,
  userId: string,
  workoutData: {
    name?: string;
    description?: string | null;
    exercises?: Exercise[];
  }
) {
  const [updatedWorkout] = await db
    .update(workout)
    .set(workoutData)
    .where(eq(workout.id, id))
    .returning();

  if (updatedWorkout && updatedWorkout.userId !== userId) {
    return null;
  }

  return updatedWorkout;
}

export async function deleteWorkout(id: string, userId: string) {
  const [deletedWorkout] = await db
    .delete(workout)
    .where(eq(workout.id, id))
    .returning();

  if (deletedWorkout && deletedWorkout.userId !== userId) {
    return null;
  }

  return deletedWorkout;
}

export async function getExerciseHistoryByName(
  exerciseName: string,
  userId: string
) {
  const history = await db
    .select()
    .from(exerciseHistory)
    .where(
      and(
        eq(exerciseHistory.exerciseName, exerciseName),
        eq(exerciseHistory.userId, userId)
      )
    )
    .orderBy(desc(exerciseHistory.createdAt));

  return history;
}

export async function addExerciseHistoryEntry(historyData: {
  id: string;
  exerciseName: string;
  weight: number;
  sets: number;
  repsMin: number;
  repsMax: number | null;
  userId: string;
  workoutId: string;
}) {
  const [newHistory] = await db
    .insert(exerciseHistory)
    .values(historyData)
    .returning();
  return newHistory;
}

export async function createSharedWorkout(shareData: {
  id: string;
  workoutId: string;
  userId: string;
  shareNotes: boolean;
}) {
  const [newShare] = await db.insert(sharedWorkout).values(shareData).returning();
  return newShare;
}

export async function getSharedWorkoutById(shareId: string) {
  const [share] = await db
    .select({
      id: sharedWorkout.id,
      shareNotes: sharedWorkout.shareNotes,
      createdAt: sharedWorkout.createdAt,
      workout: workout,
      user: { name: user.name },
    })
    .from(sharedWorkout)
    .innerJoin(workout, eq(sharedWorkout.workoutId, workout.id))
    .innerJoin(user, eq(sharedWorkout.userId, user.id))
    .where(eq(sharedWorkout.id, shareId))
    .limit(1);

  return share;
}

export async function getSharedWorkoutByWorkoutId(workoutId: string, userId: string) {
  const [share] = await db
    .select()
    .from(sharedWorkout)
    .where(and(eq(sharedWorkout.workoutId, workoutId), eq(sharedWorkout.userId, userId)))
    .limit(1);

  return share;
}

export async function deleteSharedWorkout(shareId: string, userId: string) {
  const [deleted] = await db
    .delete(sharedWorkout)
    .where(and(eq(sharedWorkout.id, shareId), eq(sharedWorkout.userId, userId)))
    .returning();

  return deleted;
}
