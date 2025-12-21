"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { useWorkouts } from "@/lib/workout";

interface props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkoutDialog({ open, onOpenChange }: props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { newWorkout } = useWorkouts();

  const handleCreate = () => {
    newWorkout({
      name: name.trim(),
      description: description.trim(),
    });

    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Create Workout</DialogTitle>
        <DialogDescription>
          To create a new workout, just specify the name and click on create!
        </DialogDescription>
        <Input
          required
          placeholder={"Push"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreate();
            }
          }}
        />
        <Input
          placeholder="Itteration 1, Monday(s)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreate();
            }
          }}
        />
        <Button onClick={handleCreate}>
          <PlusIcon />
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
}
