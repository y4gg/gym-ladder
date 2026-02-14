"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteWorkoutDialog } from "./delete-workout-dialog";
import { useSync } from "@/lib/useSync";

interface Workout {
  id: string;
  name: string;
  description: string | null;
  exercises: { id: string }[];
}

interface WorkoutsListProps {
  workouts: Workout[];
  onCreateWorkout: () => void;
}

export function WorkoutsList({ workouts, onCreateWorkout }: WorkoutsListProps) {
  const [deletingWorkoutId, setDeletingWorkoutId] = useState<string | null>(
    null
  );
  const { syncDeleteWorkout } = useSync();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Workouts</h3>
        <Button onClick={onCreateWorkout} size="sm">
          <PlusIcon />
          Create Workout
        </Button>
      </div>
      {workouts.map((workout) => (
        <Item key={workout.id} variant="outline" className="mb-2">
          <ItemContent>
            <ItemTitle className="text-xl">{workout.name}</ItemTitle>
            <ItemDescription>
              {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
              {workout.description ? ` | ${workout.description}` : ""}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Link href={`/w/${workout.id}`}>
              <Button variant="outline" size="sm">
                View
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="icon-sm">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Workout Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-400"
                    onClick={() => setDeletingWorkoutId(workout.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>
        </Item>
      ))}
      {deletingWorkoutId && (
        <DeleteWorkoutDialog
          workoutId={deletingWorkoutId}
          open={deletingWorkoutId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setDeletingWorkoutId(null);
            }
          }}
          onDeleteWorkout={syncDeleteWorkout}
        />
      )}
    </div>
  );
}
