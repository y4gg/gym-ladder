import { db } from "@/db";
import { workout } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
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
