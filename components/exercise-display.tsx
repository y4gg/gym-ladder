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
import { PlusIcon, MinusIcon } from "lucide-react";
import { useState } from "react";

export function ExerciseDisplay({ workoutId }: { workoutId: string }) {
  const [currentSet, setCurrentSet] = useState(1);
  const exercises = useWorkoutStore(
    (state) => state.workouts.find((find) => find.id === workoutId)?.exercises
  );
  const exercisePos = useExercisePosStore((state) => state.currentExercise);
  const currentExercise = exercises?.at(exercisePos);
  const correctMaxReps =
    currentExercise?.repsMax &&
    currentExercise?.repsMax > currentExercise?.repsMin
      ? true
      : false;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl">
          {currentExercise?.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`flex w-full ${correctMaxReps ? "gap-1" : "gap-2"}`}>
          <Input
            className="flex-1"
            disabled
            defaultValue={`Weight: ${currentExercise?.weight}kg`}
          />
          <Input
            className="flex-1"
            disabled
            defaultValue={`${correctMaxReps ? "Min" : ""}Reps: ${
              currentExercise?.repsMin
            }`}
          />
          {correctMaxReps ? <Input className="flex-1" disabled /> : null}
        </div>
        <div className={"flex w-full gap-1 mt-3"}>
          <Input value={`Current set: ${currentSet}`} disabled />
          <Button
            size={"icon"}
            onClick={() => setCurrentSet((prevSet) => prevSet + 1)}
          >
            <PlusIcon />
          </Button>
          <Button
            size={"icon"}
            onClick={() => setCurrentSet((prevSet) => Math.max(1, prevSet - 1))}
            disabled={currentSet === 1}
          >
            <MinusIcon />
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Button className="flex-1">Back</Button>
          <Button className="flex-1">Next</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
