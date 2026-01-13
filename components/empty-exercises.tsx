import { Dumbbell } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

interface EmptyExercisesProps {
  onCreateExercise: () => void;
}

export function EmptyExercises({ onCreateExercise }: EmptyExercisesProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Dumbbell />
        </EmptyMedia>
        <EmptyTitle>No exercises yet!</EmptyTitle>
        <EmptyDescription>
          This workout doesn&apos;t have any exercises. Get started by adding
          your first exercise.
        </EmptyDescription>
        <Button onClick={onCreateExercise}>Create Exercise</Button>
      </EmptyHeader>
    </Empty>
  );
}
