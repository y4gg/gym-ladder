"use client";

import { useWorkoutStore } from "@/lib/workout";
import { useSyncOnMount } from "@/lib/useSync";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ActivityIcon, PlusIcon } from "lucide-react";
import { StatsCards } from "@/components/stats-cards";
import { QuickActions } from "@/components/quick-actions";
import { WorkoutsList } from "@/components/workouts-list";

export default function Page() {
  useSyncOnMount();
  const workouts = useWorkoutStore((state) => state.workouts);
  const addWorkout = useWorkoutStore((state) => state.addWorkout);
  const router = useRouter();

  const handleCreateWorkout = () => {
    const newWorkout = addWorkout({ name: "New Workout", description: null });
    const updatedWorkouts = useWorkoutStore.getState().workouts;
    const latestWorkout = updatedWorkouts[updatedWorkouts.length - 1];
    router.push(`/w/${latestWorkout.id}`);
  };

  return (
    <div className="flex flex-col items-center mt-4 md:mt-10">
      <Card className="wrapper">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Gym Ladder</CardTitle>
          <CardDescription>
            Track your workouts and exercises efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <ActivityIcon className="size-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No workouts yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first workout to get started tracking your exercises
              </p>
              <Button onClick={handleCreateWorkout}>
                <PlusIcon />
                Create Workout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <StatsCards workouts={workouts} />
              <Separator />
              <QuickActions onCreateWorkout={handleCreateWorkout} workouts={workouts} />
              <Separator />
              <WorkoutsList workouts={workouts} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
