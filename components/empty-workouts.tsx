import { Dumbbell } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyWorkout() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Dumbbell />
        </EmptyMedia>
        <EmptyTitle>No workouts yet!</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any workouts yet. Get started by creating
          your first workout.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
