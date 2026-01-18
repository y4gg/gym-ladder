import { useExercisePosStore } from "@/lib/exercise-pos";
import { useWorkoutStore } from "@/lib/workout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PlusIcon, MinusIcon, MoreHorizontalIcon, HistoryIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditExerciseDialog } from "./edit-exercise-dialog";

export function ExerciseDisplay({ workoutId }: { workoutId: string }) {
  const router = useRouter();
  const [currentSet, setCurrentSet] = useState(1);
  const exercises = useWorkoutStore(
    (state) => state.workouts.find((find) => find.id === workoutId)?.exercises
  );
  const {
    currentExercise: exercisePos,
    next,
    previous,
  } = useExercisePosStore();
  const currentExercise = exercises?.at(exercisePos);
  const correctMaxReps =
    currentExercise?.repsMax &&
    currentExercise?.repsMax > currentExercise?.repsMin
      ? true
      : false;
  const { updateExerciseInWorkout, removeExerciseFromWorkout } =
    useWorkoutStore();
  const [editingExercisePos, setEditingExercisePos] = useState<number | null>(
    null
  );

  return (
    <Suspense>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-center text-2xl">
            {currentExercise?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={"flex w-full gap-2"}>
            <Input
              className="flex-1"
              disabled
              value={`Weight: ${currentExercise?.weight}kg`}
            />
            <Input
              className="flex-1"
              disabled
              value={`Reps: ${currentExercise?.repsMin}${correctMaxReps ? `-${currentExercise?.repsMax}` : ""}`}
            />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant={"outline"} size={"icon"}>
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
                  {currentExercise && (
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(`/w/${workoutId}/h/${currentExercise.id}`);
                      }}
                    >
                      <HistoryIcon className="mr-2 h-4 w-4" />
                      View History
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className={"text-red-400"}
                    onClick={() => {
                      if (currentExercise) {
                        removeExerciseFromWorkout(
                          workoutId,
                          currentExercise.id
                        );
                      }
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className={"flex w-full gap-2 mt-3"}>
            <Input value={`Current set: ${currentSet}`} disabled />
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => setCurrentSet((prevSet) => prevSet + 1)}
              disabled={currentExercise?.sets == currentSet}
            >
              <PlusIcon />
            </Button>
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() =>
                setCurrentSet((prevSet) => Math.max(1, prevSet - 1))
              }
              disabled={currentSet === 1}
            >
              <MinusIcon />
            </Button>
          </div>
          <div className="mt-3">
            <Textarea
              placeholder="Add a note..."
              value={currentExercise?.notes ?? ""}
              onChange={(e) => {
                if (currentExercise?.id) {
                  updateExerciseInWorkout(workoutId, currentExercise.id, {
                    notes: e.target.value,
                  });
                }
              }}
              className="w-full"
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full gap-2">
            <Button
              className="flex-1"
              onClick={() => previous()}
              disabled={exercisePos == 0}
            >
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={() => next()}
              disabled={exercisePos + 1 == exercises?.length}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

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
    </Suspense>
  );
}
