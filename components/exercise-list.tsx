"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useWorkoutStore } from "@/lib/workout";
import { EmptyWorkout } from "@/components/empty-workouts";
import { CreateWorkoutDialog } from "./create-workout-dialog";
import { useState } from "react";
import Link from "next/link";

export function ExerciseList({ workoutId }: { workoutId: string }) {
  const exercises = useWorkoutStore(
    (state) => state.workouts.find((find) => find.id === workoutId)?.exercises
  );

  return (
    <div>
      <Card></Card>
    </div>
  );
}
