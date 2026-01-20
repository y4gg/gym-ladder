"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  onCreateWorkout: () => void;
  workouts: { id: string }[];
}

export function QuickActions({ onCreateWorkout, workouts }: QuickActionsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
      <div className="flex gap-2">
        <Button onClick={onCreateWorkout}>
          <PlusIcon />
          Create Workout
        </Button>
        {workouts.length > 0 && (
          <Link href={`/w/${workouts[0].id}`}>
            <Button variant="outline">Last workout</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
