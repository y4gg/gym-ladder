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
import { useState } from "react";
import { EditExerciseDialog } from "./edit-exercise-dialog";
import { useSync } from "@/lib/useSync";

export function ExerciseList({ workoutId }: { workoutId: string }) {
  const exercises = useWorkoutStore(
    (state) => state.workouts.find((find) => find.id === workoutId)?.exercises
  );
  const { removeExerciseFromWorkout } = useWorkoutStore();
  const { syncSingleWorkout } = useSync();
  const exercisePos = useExercisePosStore((state) => state.currentExercise);
  const setCurrentExercise = useExercisePosStore((state) => state.setCurrent);
  const currentExercise = exercises?.at(exercisePos + 1);
  const nextExercises = exercises?.slice(exercisePos + 2);
  const [editingExercisePos, setEditingExercisePos] = useState<number | null>(
    null
  );

  return (
    <div>
      {exercises && exercises.length == exercisePos + 1 ? null : (
        <Item variant={"muted"}>
          <ItemContent>
            <ItemTitle className="text-xl">{currentExercise?.name}</ItemTitle>
            <ItemDescription>
              {`Sets: ${currentExercise?.sets} | Reps: ${
                currentExercise?.repsMin
              }${
                currentExercise?.repsMax &&
                Number(currentExercise.repsMax) >
                  Number(currentExercise.repsMin)
                  ? `-${currentExercise?.repsMax}`
                  : currentExercise?.repsMax
                    ? `x${currentExercise?.repsMax}`
                    : ""
              } | Weight: ${currentExercise?.weight}kg`}
            </ItemDescription>
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
                  <DropdownMenuItem
                    onClick={() => setEditingExercisePos(exercisePos)}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={"text-red-400"}
                    onClick={() => {
                      if (currentExercise) {
                        removeExerciseFromWorkout(
                          workoutId,
                          currentExercise.id
                        );
                        const workout = useWorkoutStore
                          .getState()
                          .workouts.find((w) => w.id === workoutId);
                        if (workout) {
                          syncSingleWorkout(workout);
                        }
                      }
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>
        </Item>
      )}

      {exercises && exercises.length <= exercisePos + 2 ? null : (
        <Separator className={"my-4"} />
      )}

      {nextExercises?.map((exercise, index) => {
        const exerciseIndex = exercisePos + 1 + index;
        return (
          <Item key={exercise.id} variant={"outline"} className="mb-2">
            <ItemContent>
              <ItemTitle className="text-lg">{exercise.name}</ItemTitle>
              <ItemDescription>
                {`Sets: ${exercise.sets} | Reps: ${exercise.repsMin}${
                  exercise.repsMax &&
                  Number(exercise.repsMax) > Number(exercise.repsMin)
                    ? `-${exercise.repsMax}`
                    : ""
                } | Weight: ${exercise.weight}kg`}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setCurrentExercise(exerciseIndex + 1)}
              >
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
                    <DropdownMenuItem
                      onClick={() => setEditingExercisePos(exerciseIndex)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={"text-red-400"}
                      onClick={() => {
                        removeExerciseFromWorkout(workoutId, exercise.id);
                        const workout = useWorkoutStore
                          .getState()
                          .workouts.find((w) => w.id === workoutId);
                        if (workout) {
                          syncSingleWorkout(workout);
                        }
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ItemActions>
          </Item>
        );
      })}

      {editingExercisePos !== null && (
        <EditExerciseDialog
          workoutId={workoutId}
          exercisePos={editingExercisePos}
          open={editingExercisePos !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditingExercisePos(null);
            }
          }}
        />
      )}
    </div>
  );
}
