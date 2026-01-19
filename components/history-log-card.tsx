"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseHistoryList } from "@/components/exercise-history-list";

interface HistoryEntry {
  id: string;
  exerciseName: string;
  weight: number;
  sets: number;
  repsMin: number;
  repsMax: number | null;
  createdAt: Date;
}

interface HistoryLogCardProps {
  history: HistoryEntry[];
}

export function HistoryLogCard({ history }: HistoryLogCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>History Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ExerciseHistoryList history={history} />
      </CardContent>
    </Card>
  );
}
