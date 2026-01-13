"use client";

import { ExerciseList } from "@/components/exercise-list";
import { CreateExerciseDialog } from "@/components/create-exercise-dialog";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExerciseDisplay } from "@/components/exercise-display";
import { useWorkoutStore } from "@/lib/workout";
import { EmptyExercises } from "@/components/empty-exercises";

export default function WorkoutViewer({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = use(params);
  const workout = useWorkoutStore().workouts.find(
    (workout) => workout.id == workoutId
  );

  if (!workout) {
    return null;
  }

  if (workout.exercises.length == 0) {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex w-full justify-center mt-10">
        <EmptyExercises onCreateExercise={() => setOpen(true)} />
        <CreateExerciseDialog
          open={open}
          onOpenChange={setOpen}
          workoutId={workoutId}
        />
      </div>
    );
  }

  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full justify-center mt-4 md:mt-10">
      <div className="md:grid md:grid-cols-7 h-100 big-wrapper gap-4 mb-4">
        <div className="col-span-3">
          <ExerciseDisplay workoutId={workoutId} />
        </div>
        <div className="col-span-4">
          <div className="flex justify-between mb-2">
            <h1 className="font-semibold text-2xl">Next up:</h1>
            <Button onClick={() => setOpen(true)}>Create Exercise</Button>
          </div>
          <ExerciseList workoutId={workoutId} />
        </div>
      </div>

      <CreateExerciseDialog
        open={open}
        onOpenChange={setOpen}
        workoutId={workoutId}
      />
    </div>
  );
}
