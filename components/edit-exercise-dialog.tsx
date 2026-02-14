"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PencilIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { Label } from "./ui/label";
import { useWorkoutStore, NewExercise } from "@/lib/workout";
import { useSync } from "@/lib/useSync";
import { recordWeightUpdateHistory } from "@/server/workouts";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";

interface props {
  workoutId: string;
  exercisePos: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditExerciseDialog({
  workoutId,
  exercisePos,
  open,
  onOpenChange,
}: props) {
  const { updateExerciseInWorkout, workouts } = useWorkoutStore();
  const { syncSingleWorkout } = useSync();
  const workout = workouts.find((w) => w.id === workoutId);
  const exercise = workout?.exercises.at(exercisePos);
  const previousWeightRef = useRef<number | undefined>(exercise?.weight);

  useEffect(() => {
    previousWeightRef.current = exercise?.weight;
  }, [exercisePos, exercise?.weight]);

  const getInitialState = (): NewExercise => {
    if (!exercise) {
      return {
        name: "",
        repsMin: 0,
        repsMax: 0,
        sets: 0,
        weight: 0,
        notes: "",
      };
    }
    return {
      name: exercise.name,
      repsMin: exercise.repsMin,
      repsMax: exercise.repsMax ?? 0,
      sets: exercise.sets,
      weight: exercise.weight,
      notes: exercise.notes ?? "",
    };
  };

  // Reset state when exercise changes by using key on inner component
  const FormContent = () => {
    const [formState, setFormState] = useState<NewExercise>(getInitialState);

    const updateField = (field: keyof NewExercise, value: string) => {
      setFormState((prev) => {
        // Convert numeric fields to numbers
        const numericFields: (keyof NewExercise)[] = [
          "sets",
          "repsMin",
          "repsMax",
          "weight",
        ];
        if (numericFields.includes(field)) {
          const numValue =
            value === "" ? (field === "repsMax" ? null : 0) : Number(value);
          return { ...prev, [field]: numValue };
        }
        return { ...prev, [field]: value };
      });
    };

    const handleUpdate = async () => {
      if (!exercise) return;

      const weightChanged = formState.weight !== previousWeightRef.current;

      updateExerciseInWorkout(workoutId, exercise.id, {
        name: formState.name.trim(),
        repsMin: formState.repsMin,
        repsMax: formState.repsMax,
        sets: formState.sets,
        weight: formState.weight,
        notes: formState.notes,
      });

      onOpenChange(false);

      const workout = useWorkoutStore
        .getState()
        .workouts.find((w) => w.id === workoutId);
      if (workout) {
        syncSingleWorkout(workout);

        if (weightChanged) {
          const session = await authClient.getSession();
          if (!session.data) {
            return;
          }

          try {
            await recordWeightUpdateHistory({
              id: exercise.id,
              name: formState.name.trim(),
              weight: formState.weight,
              sets: formState.sets,
              repsMin: formState.repsMin,
              repsMax: formState.repsMax,
              workoutId: workoutId,
            });
          } catch (error) {
            console.error("Failed to record weight update history:", error);
            toast.error("Failed to record weight history", {
              description: "Exercise was updated but history recording failed",
            });
          }
        }
      }
    };

    return (
      <>
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
          <DialogDescription>Update the exercise details</DialogDescription>
        </DialogHeader>
        <Label className="mt-2">Name</Label>
        <Input
          required
          placeholder={"Chest press"}
          value={formState.name}
          onChange={(e) => updateField("name", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdate();
            }
          }}
        />
        <Label className="mt-2">Reps Min</Label>
        <Input
          type="number"
          required
          placeholder={"8"}
          value={formState.repsMin}
          onChange={(e) => updateField("repsMin", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdate();
            }
          }}
        />
        <Label className="mt-2">Reps Max (optional)</Label>
        <Input
          type="number"
          placeholder={"12"}
          value={formState.repsMax ?? ""}
          onChange={(e) => updateField("repsMax", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdate();
            }
          }}
        />
        <Label className="mt-2">Sets</Label>
        <Input
          type="number"
          required
          placeholder={"3"}
          value={formState.sets}
          onChange={(e) => updateField("sets", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdate();
            }
          }}
        />
        <Label className="mt-2">Weight (kg)</Label>
        <Input
          type="number"
          required
          placeholder={"60"}
          value={formState.weight}
          onChange={(e) => updateField("weight", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdate();
            }
          }}
        />
        <Label className="mt-2">Notes (optional)</Label>
        <Input
          placeholder="Additional notes..."
          value={formState.notes ?? ""}
          onChange={(e) => updateField("notes", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdate();
            }
          }}
        />
        <Button onClick={handleUpdate} className={"mt-2"}>
          <PencilIcon />
          Update
        </Button>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={`${workoutId}-${exercisePos}`} className={"gap-2"}>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
}
