"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteExerciseDialogProps {
  workoutId: string;
  exerciseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteExercise: (workoutId: string, exerciseId: string) => void;
}

export function DeleteExerciseDialog({
  workoutId,
  exerciseId,
  open,
  onOpenChange,
  onDeleteExercise,
}: DeleteExerciseDialogProps) {
  const handleDelete = () => {
    onDeleteExercise(workoutId, exerciseId);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Exercise</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this exercise? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleDelete} variant="destructive">
            <Trash2Icon />
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
