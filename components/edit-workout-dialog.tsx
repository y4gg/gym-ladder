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
import { useWorkoutStore, type Workout, type NewWorkout } from "@/lib/workout";
import { useSync } from "@/lib/useSync";

interface props {
  workoutId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWorkoutDialog({
  workoutId,
  open,
  onOpenChange,
}: props) {
  const { updateWorkout, workouts } = useWorkoutStore();
  const { syncSingleWorkout } = useSync();
  const workout = workouts.find((w) => w.id === workoutId);

  const getInitialState = (): NewWorkout => {
    if (!workout) {
      return {
        name: "",
        description: null,
      };
    }
    return {
      name: workout.name,
      description: workout.description,
    };
  };

  const FormContent = () => {
    const [formState, setFormState] = useState<NewWorkout>(getInitialState);

    const updateField = (field: keyof NewWorkout, value: string) => {
      setFormState((prev) => {
        if (field === "description") {
          return { ...prev, [field]: value || null };
        }
        return { ...prev, [field]: value };
      });
    };

    const handleUpdate = () => {
      if (!workout) return;

      updateWorkout(workout.id, {
        name: formState.name.trim(),
        description: formState.description,
      });

      const updatedWorkout = useWorkoutStore
        .getState()
        .workouts.find((w) => w.id === workoutId);
      if (updatedWorkout) {
        syncSingleWorkout(updatedWorkout);
      }

      onOpenChange(false);
    };

    return (
      <>
        <DialogHeader>
          <DialogTitle>Edit Workout</DialogTitle>
          <DialogDescription>Update the workout details</DialogDescription>
        </DialogHeader>
        <Label className="mt-2">Name</Label>
        <Input
          required
          placeholder={"Push"}
          value={formState.name}
          onChange={(e) => updateField("name", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdate();
            }
          }}
        />
        <Label className="mt-2">Description</Label>
        <Input
          placeholder="Itteration 1, Monday(s)"
          value={formState.description ?? ""}
          onChange={(e) => updateField("description", e.target.value)}
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
      <DialogContent key={workoutId} className={"gap-2"}>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
}
