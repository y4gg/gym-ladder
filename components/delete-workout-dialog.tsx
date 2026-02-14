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

interface DeleteWorkoutDialogProps {
  workoutId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteWorkout: (workoutId: string) => void;
}

export function DeleteWorkoutDialog({
  workoutId,
  open,
  onOpenChange,
  onDeleteWorkout,
}: DeleteWorkoutDialogProps) {
  const handleDelete = () => {
    onDeleteWorkout(workoutId);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Workout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this workout? All exercises within it
            will be removed. This action cannot be undone.
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
