import { useExercisePosStore } from "@/lib/exercise-pos";
import { useWorkoutStore } from "@/lib/workout";
import { authClient } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PlusIcon, MinusIcon, MoreHorizontalIcon, RotateCcwIcon } from "lucide-react";
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
import { DeleteExerciseDialog } from "./delete-exercise-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useSync } from "@/lib/useSync";

export function ExerciseDisplay({ workoutId }: { workoutId: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [currentSet, setCurrentSet] = useState(1);
  const exercises = useWorkoutStore(
    (state) => state.workouts.find((find) => find.id === workoutId)?.exercises
  );
  const {
    currentExercise: exercisePos,
    next,
    previous,
    setCurrent,
  } = useExercisePosStore();
  const currentExercise = exercises?.at(exercisePos);
  const correctMaxReps =
    currentExercise?.repsMax &&
    currentExercise?.repsMax > currentExercise?.repsMin
      ? true
      : false;
  const { updateExerciseInWorkout } = useWorkoutStore();
  const { syncDeleteExercise } = useSync();
  const [editingExercisePos, setEditingExercisePos] = useState<number | null>(
    null
  );
  const [deletingExerciseId, setDeletingExerciseId] = useState<string | null>(
    null
  );
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleDeleteExercise = (workoutId: string, exerciseId: string) => {
    syncDeleteExercise(workoutId, exerciseId);
  };

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
                      disabled={!session}
                      onClick={() => {
                        router.push(`/w/${workoutId}/h/${currentExercise.id}`);
                      }}
                    >
                      View History
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className={"text-red-400"}
                    onClick={() => {
                      if (currentExercise) {
                        setDeletingExerciseId(currentExercise.id);
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
            <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <Button
                variant="outline"
                size="icon"
                disabled={exercisePos === 0}
                onClick={() => setIsResetDialogOpen(true)}
              >
                <RotateCcwIcon />
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Progress</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reset to the first exercise?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="default"
                    onClick={() => {
                      setCurrent(0);
                      setIsResetDialogOpen(false);
                    }}
                  >
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
      {deletingExerciseId && (
        <DeleteExerciseDialog
          workoutId={workoutId}
          exerciseId={deletingExerciseId}
          open={deletingExerciseId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setDeletingExerciseId(null);
            }
          }}
          onDeleteExercise={handleDeleteExercise}
        />
      )}
    </Suspense>
  );
}
