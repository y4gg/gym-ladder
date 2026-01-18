import { db } from "@/db";
import { workout, exerciseHistory } from "@/db/schema";
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
