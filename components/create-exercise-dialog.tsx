"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { Label } from "./ui/label";
import { useWorkoutStore, NewExercise } from "@/lib/workout";

interface props {
  workoutId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateExerciseDialog({ workoutId, open, onOpenChange }: props) {
  const [exercise, setExercise] = useState<NewExercise>({
    name: "",
    repsMin: 0,
    repsMax: 0,
    sets: 0,
    weight: 0,
    notes: "",
  });
  const { addExerciseToWorkout } = useWorkoutStore();

  const updateExercise = (field: keyof typeof exercise, value: string) => {
    setExercise((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
    addExerciseToWorkout(workoutId, {
      name: exercise.name.trim(),
      repsMin: exercise.repsMin,
      repsMax: exercise.repsMax,
      sets: exercise.sets,
      weight: exercise.weight,
      notes: exercise.notes,
    });

    setExercise({
      name: "",
      repsMin: 0,
      repsMax: 0,
      sets: 0,
      weight: 0,
      notes: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={"gap-2"}>
        <DialogHeader>
          <DialogTitle>Create Exercise</DialogTitle>
          <DialogDescription>
            Add a new exercise to your workout
          </DialogDescription>
        </DialogHeader>
        <Label className="mt-2">Name</Label>
        <Input
          required
          placeholder={"Chest press"}
          value={exercise.name}
          onChange={(e) => updateExercise("name", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreate();
            }
          }}
        />
        <Label className="mt-2">Reps Min</Label>
        <Input
          type="number"
          required
          placeholder={"8"}
          value={exercise.repsMin}
          onChange={(e) => updateExercise("repsMin", e.target.value)}
        />
        <Label className="mt-2">Reps Max (optional)</Label>
        <Input
          type="number"
          placeholder={"12"}
          value={exercise.repsMax ?? ""}
          onChange={(e) => updateExercise("repsMax", e.target.value)}
        />
        <Label className="mt-2">Sets</Label>
        <Input
          type="number"
          required
          placeholder={"3"}
          value={exercise.sets}
          onChange={(e) => updateExercise("sets", e.target.value)}
        />
        <Label className="mt-2">Weight (kg)</Label>
        <Input
          type="number"
          required
          placeholder={"60"}
          value={exercise.weight}
          onChange={(e) => updateExercise("weight", e.target.value)}
        />
        <Label className="mt-2">Notes (optional)</Label>
        <Input
          placeholder="Additional notes..."
          value={exercise.notes ?? ""}
          onChange={(e) => updateExercise("notes", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreate();
            }
          }}
        />
        <Button onClick={handleCreate} className={"mt-2"}>
          <PlusIcon />
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
}
