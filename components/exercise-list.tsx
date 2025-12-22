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
import { useWorkouts } from "@/lib/workout";
import { EmptyWorkout } from "@/components/empty-workouts";
import { CreateExerciseDialog } from "./create-exercise-dialog";
import { useState } from "react";
import Link from "next/link";

interface ExerciseListProps {
    workoutId: string
}

export function ExerciseList({workoutId}: ExerciseListProps) {
  const workouts = useWorkouts((state) => state.workouts);
  const [open, setOpen] = useState(false);
  const delWorkout = useWorkouts((state) => state.deleteWorkout);

  return (
    <div className="flex justify-center mt-10">
      <Card className="wrapper">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Next exercises</CardTitle>
          <CardAction>
            <Button onClick={() => setOpen(true)}>
              <PlusIcon />
              Create exercise
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {workouts.length != 0 ? (
            workouts.map((workout) => (
              <Card
                key={workout.id}
                className="flex flex-row justify-between p-6"
              >
                <div>
                  <h1 className="font-medium text-xl">{workout.name}</h1>
                  <p className="text-gray-400">
                    {workout.description
                      ? workout.description
                      : "No description"}
                  </p>
                </div>
                <div className="flex min-h-full items-center">
                  <Link href={"/w/" + workout.id}>
                    <Button>View</Button>
                  </Link>
                  <Button
                    onClick={() => delWorkout(workout.id)}
                    size={"icon"}
                    variant={"destructive"}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <EmptyWorkout />
          )}
        </CardContent>
      </Card>
      <CreateExerciseDialog workoutId={workoutId} open={open} onOpenChange={setOpen} />
    </div>
  );
}