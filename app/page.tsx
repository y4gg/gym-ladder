"use client";

import { useWorkoutStore } from "@/lib/workout";
import { useSyncOnMount } from "@/lib/useSync";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityIcon, PlusIcon } from "lucide-react";

export default function Page() {
  useSyncOnMount();
  const workouts = useWorkoutStore((state) => state.workouts);

  return (
    <div className="flex flex-col gap-4">
      <Card>
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
              <Button>
                <PlusIcon />
                Create Workout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{workouts.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {workouts.reduce((acc, workout) => acc + workout.exercises.length, 0)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {workouts.length > 0 ? new Date(workouts[0].updatedAt).toLocaleDateString() : '-'}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                <div className="flex gap-2">
                  <Button>
                    <PlusIcon />
                    Create Workout
                  </Button>
                  {workouts.length > 0 && (
                    <Link href={`/w/${workouts[0].id}`}>
                      <Button variant="outline">
                        View Latest Workout
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
