"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useWorkoutStore, Exercise } from "@/lib/workout";
import { useMemo, useState } from "react";
import { useSync } from "@/lib/useSync";
import { GripVerticalIcon } from "lucide-react";

interface RearrangeExercisesDialogProps {
  workoutId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SortableItem({ exercise }: { exercise: Exercise }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 rounded-lg border bg-card"
    >
      <button {...attributes} {...listeners} className="cursor-grab touch-none">
        <GripVerticalIcon className="size-4 text-muted-foreground" />
      </button>
      <span className="flex-1">{exercise.name}</span>
      <span className="text-sm text-muted-foreground">
        {exercise.sets}x{exercise.repsMin}
        {exercise.repsMax && exercise.repsMax > exercise.repsMin
          ? `-${exercise.repsMax}`
          : ""}{" "}
        @ {exercise.weight}kg
      </span>
    </div>
  );
}

function RearrangeDialogContent({
  workoutId,
  onOpenChange,
}: {
  workoutId: string;
  onOpenChange: (open: boolean) => void;
}) {
  const workout = useWorkoutStore((state) =>
    state.workouts.find((w) => w.id === workoutId)
  );
  const reorderExercises = useWorkoutStore(
    (state) => state.reorderExercisesInWorkout
  );
  const { syncSingleWorkout } = useSync();
  const initialExercises = useMemo(
    () => workout?.exercises ?? [],
    [workout?.exercises]
  );
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setExercises((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    reorderExercises(workoutId, exercises);
    const updatedWorkout = useWorkoutStore
      .getState()
      .workouts.find((w) => w.id === workoutId);
    if (updatedWorkout) {
      syncSingleWorkout(updatedWorkout);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!workout) return null;

  return (
    <>
      <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
        {exercises.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No exercises to rearrange
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={exercises.map((e) => e.id)}
              strategy={verticalListSortingStrategy}
            >
              {exercises.map((exercise) => (
                <SortableItem key={exercise.id} exercise={exercise} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
      <DialogFooter className="flex-row justify-between w-full sm:justify-between">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogFooter>
    </>
  );
}

export function RearrangeExercisesDialog({
  workoutId,
  open,
  onOpenChange,
}: RearrangeExercisesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rearrange Exercises</DialogTitle>
        </DialogHeader>
        {open && (
          <RearrangeDialogContent
            workoutId={workoutId}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
