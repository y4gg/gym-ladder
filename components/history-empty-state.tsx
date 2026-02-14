"use client";

import { Card, CardContent } from "@/components/ui/card";

export function HistoryEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">No history recorded yet</p>
        <p className="text-sm text-muted-foreground">
          Complete workouts to start tracking your progress
        </p>
      </CardContent>
    </Card>
  );
}
