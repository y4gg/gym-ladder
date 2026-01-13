"use client";

import { ExerciseList } from "@/components/exercise-list";
import { CreateExerciseDialog } from "@/components/create-exercise-dialog";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";

export default function WorkoutViewer({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = use(params);

  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full justify-center mt-10">
      <div className="mt-10 grid grid-cols-5 h-100 big-wrapper">
        <div className="col-span-2 w-full"></div>
        <div className="col-span-3">
          <div>
            <h1 className="font-semibold text-2xl">Next up:</h1>
            <CreateExerciseDialog />
          </div>
          <ExerciseList workoutId={workoutId} />
        </div>
      </div>
    </div>
  );
}
