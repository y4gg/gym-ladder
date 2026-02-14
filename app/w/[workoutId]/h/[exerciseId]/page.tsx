"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeightProgressionChart } from "@/components/weight-progression-chart";
import { HistoryLoadingState } from "@/components/history-loading-state";
import { HistoryEmptyState } from "@/components/history-empty-state";
import { HistoryLogCard } from "@/components/history-log-card";
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

interface ChartData {
  index: number;
  weight: number;
  date: string;
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

  const chartData: ChartData[] = history
    .slice()
    .reverse()
    .map((entry, index) => ({
      index: index + 1,
      weight: entry.weight,
      date: new Date(entry.createdAt).toLocaleDateString(),
    }));

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
          <HistoryLoadingState />
        ) : history.length === 0 ? (
          <HistoryEmptyState />
        ) : (
          <div className="space-y-6">
            <WeightProgressionChart data={chartData} />
            <HistoryLogCard history={history} />
          </div>
        )}
      </div>
    </div>
  );
}
