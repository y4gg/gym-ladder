"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

interface Workout {
  id: string;
  name: string;
  description: string | null;
  exercises: { id: string }[];
}

interface WorkoutsListProps {
  workouts: Workout[];
}

export function WorkoutsList({ workouts }: WorkoutsListProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Your Workouts</h3>
      {workouts.map((workout) => (
        <Item key={workout.id} variant="outline" className="mb-2">
          <ItemContent>
            <ItemTitle className="text-xl">{workout.name}</ItemTitle>
            <ItemDescription>
              {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
              {workout.description ? ` | ${workout.description}` : ""}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Link href={`/w/${workout.id}`}>
              <Button variant="outline" size="sm">
                View
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="icon-sm">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Workout Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>
        </Item>
      ))}
    </div>
  );
}
