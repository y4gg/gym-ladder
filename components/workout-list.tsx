"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon, MoreHorizontalIcon } from "lucide-react";
import { useWorkoutStore } from "@/lib/workout";
import { EmptyWorkout } from "@/components/empty-workouts";
import { CreateWorkoutDialog } from "./create-workout-dialog";
import { EditWorkoutDialog } from "./edit-workout-dialog";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSyncOnMount, useSync } from "@/lib/useSync";

export function WorkoutList() {
  useSyncOnMount();
  const { syncDeleteWorkout } = useSync();
  const workouts = useWorkoutStore((state) => state.workouts);
  const [open, setOpen] = useState(false);
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);

  return (
    <div className="flex justify-center mt-4 md:mt-10">
      <Card className="wrapper">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Workout List</CardTitle>
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
                <div className="flex min-h-full items-center gap-1">
                  <Link href={"/w/" + workout.id}>
                    <Button variant={"outline"} size={"sm"}>
                      View
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant={"outline"} size={"icon-sm"}>
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className={"w-30s"} align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Workout Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => setEditingWorkoutId(workout.id)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={"text-red-400"}
                          onClick={() => syncDeleteWorkout(workout.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))
          ) : (
            <EmptyWorkout />
          )}
        </CardContent>
      </Card>
      <CreateWorkoutDialog open={open} onOpenChange={setOpen} />
      {editingWorkoutId && (
        <EditWorkoutDialog
          workoutId={editingWorkoutId}
          open={editingWorkoutId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditingWorkoutId(null);
            }
          }}
        />
      )}
    </div>
  );
}
