"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ExerciseHistoryList } from "@/components/exercise-history-list";
import { fetchExerciseHistory } from "@/server/workouts";
import { useWorkoutStore } from "@/lib/workout";

interface HistoryEntry {
  id: string;
  exerciseName: string;
  weight: number;
  sets: number;
  repsMin: number;
  repsMax: number | null;
  createdAt: Date;
}

export default function ExerciseHistoryPage({
  params,
}: {
  params: Promise<{ workoutId: string; exerciseId: string }>;
}) {
  const router = useRouter();
  const { workoutId, exerciseId } = use(params);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [exerciseName, setExerciseName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const workouts = useWorkoutStore((state) => state.workouts);
  const workout = workouts.find((w) => w.id === workoutId);
  const exercise = workout?.exercises.find((e) => e.id === exerciseId);

  useEffect(() => {
    async function loadHistory() {
      if (!exercise) return;

      setLoading(true);
      setExerciseName(exercise.name);

      try {
        const historyData = await fetchExerciseHistory(exercise.name);
        setHistory(historyData);
      } catch (error) {
        console.error("Failed to fetch exercise history:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [exerciseId, exercise]);

  const chartData = history
    .slice()
    .reverse()
    .map((entry, index) => ({
      index: index + 1,
      weight: entry.weight,
      date: new Date(entry.createdAt).toLocaleDateString(),
    }));

  const chartConfig = {
    weight: {
      label: "Weight (kg)",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl p-4 md:p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{exerciseName} History</h1>
          <p className="text-muted-foreground">
            Track your weight progression over time
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p>Loading history...</p>
            </CardContent>
          </Card>
        ) : history.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-muted-foreground">
                No history recorded yet
              </p>
              <p className="text-sm text-muted-foreground">
                Complete workouts to start tracking your progress
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weight Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[300px] w-full"
                >
                  <LineChart data={chartData}>
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <Line
                      dataKey="weight"
                      type="monotone"
                      stroke="var(--color-weight)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-weight)", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>History Log</CardTitle>
              </CardHeader>
              <CardContent>
                <ExerciseHistoryList history={history} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
