"use client";

import { Separator } from "./ui/separator";
import { Button } from "@/components/ui/button";
import { useWorkoutStore } from "@/lib/workout";
import { useExercisePosStore } from "@/lib/exercise-pos";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";

export function ExerciseList({ workoutId }: { workoutId: string }) {
  const exercises = useWorkoutStore(
    (state) => state.workouts.find((find) => find.id === workoutId)?.exercises
  );
  const exercisePos = useExercisePosStore((state) => state.currentExercise);
  const currentExercise = exercises?.at(exercisePos);
  const nextExercises = exercises?.slice(exercisePos + 1);

  return (
    <div>
      <Item variant={"muted"}>
        <ItemContent>
          <ItemTitle className="text-xl">{currentExercise?.name}</ItemTitle>
          <ItemDescription>{`Sets: ${currentExercise?.sets} | Reps: ${currentExercise?.repsMin}-${currentExercise?.repsMax} | Weight: ${currentExercise?.weight}kg`}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={"outline"} size={"icon-sm"}>
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"w-30s"} align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Exercise Actions</DropdownMenuLabel>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className={"text-red-400"}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      </Item>

      <Separator className={"my-4"} />

      {nextExercises?.map((exercise) => (
        <Item key={exercise.id} variant={"outline"}>
          <ItemContent>
            <ItemTitle className="text-lg">{exercise.name}</ItemTitle>
            <ItemDescription>
              {`Sets: ${exercise.sets} | Reps: ${exercise.repsMin}-${exercise.repsMax} | Weight: ${exercise.weight}kg`}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant={"outline"} size={"sm"}>
              Skip to this exercise
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant={"outline"} size={"icon-sm"}>
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={"w-25"} align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Exercise Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className={"text-red-400"}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>
        </Item>
      ))}
    </div>
  );
}
