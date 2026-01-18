import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";

interface ExerciseHistoryEntry {
  id: string;
  exerciseName: string;
  weight: number;
  sets: number;
  repsMin: number;
  repsMax: number | null;
  createdAt: Date;
  workoutName?: string;
}

interface ExerciseHistoryListProps {
  history: ExerciseHistoryEntry[];
}

export function ExerciseHistoryList({ history }: ExerciseHistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-lg">No history yet</p>
        <p className="text-sm">Start logging your workouts to see history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((entry) => (
        <Item key={entry.id} variant="outline">
          <ItemContent>
            <div className="flex w-full items-start justify-between">
              <div>
                <ItemTitle className="text-base">{entry.weight}kg</ItemTitle>
                <ItemDescription>
                  {entry.sets} sets × {entry.repsMin}
                  {entry.repsMax && entry.repsMax > entry.repsMin
                    ? `-${entry.repsMax}`
                    : ""}
                  {" "}
                  reps
                </ItemDescription>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="secondary">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </Badge>
                {entry.workoutName && (
                  <span className="text-xs text-muted-foreground">
                    {entry.workoutName}
                  </span>
                )}
              </div>
            </div>
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}
