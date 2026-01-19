"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Workout {
  exercises: { id: string }[];
  updatedAt: Date;
}

interface StatsCardsProps {
  workouts: Workout[];
}

export function StatsCards({ workouts }: StatsCardsProps) {
  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce((acc, workout) => acc + workout.exercises.length, 0);
  const recentActivity = workouts.length > 0 ? new Date(workouts[0].updatedAt).toLocaleDateString() : "-";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWorkouts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalExercises}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentActivity}</div>
        </CardContent>
      </Card>
    </div>
  );
}
