"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CreateExerciseDialog } from "@/components/create-exercise-dialog";
import { Suspense, use, useState } from "react";
import { Button } from "@/components/ui/button";
import { useWorkoutStore } from "@/lib/workout";

export default function WorkoutViewer({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = use(params);
  const workouts = useWorkoutStore((state) => state.workouts);
  const workout = workouts.find((item) => item.id === workoutId);

  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-[calc(100vh-5.75rem)] flex justify-center items-center">
      <Suspense>
        <CreateExerciseDialog
          workoutId={workoutId}
          open={open}
          onOpenChange={setOpen}
        />
      </Suspense>
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel minSize={"30"}>One</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={"30"}>
          <Button onClick={() => setOpen(true)}>Add exercise</Button>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
