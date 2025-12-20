"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useWorkouts } from "@/lib/workout";
import { EmptyDemo } from "@/components/empty-workouts";
import { CreateWorkoutDialog } from "./create-workout-dialog";
import { useState } from "react";
import Link from "next/link";

export function WorkoutList() {
  const workouts = useWorkouts((state) => state.workouts);
  const [open, setOpen] = useState(false);
  const delWorkout = useWorkouts((state) => state.deleteWorkout);

  return (
    <div className="flex justify-center mt-10">
      <Card className="wrapper">
        <CardHeader>
          <CardTitle>Workout List</CardTitle>
          <CardAction>
            <Button onClick={() => setOpen(true)}>
              <PlusIcon />
              Create Workout
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {workouts.length != 0 ? (
            workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader>
                  <CardTitle>{workout.name}</CardTitle>
                  <CardDescription>{workout.description}</CardDescription>
                  <CardAction className="flex">
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
                  </CardAction>
                </CardHeader>
              </Card>
            ))
          ) : (
            <EmptyDemo />
          )}
        </CardContent>
      </Card>
      <CreateWorkoutDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
