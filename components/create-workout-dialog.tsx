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
import { useWorkoutStore } from "@/lib/workout";
import { Label } from "./ui/label";

interface props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkoutDialog({ open, onOpenChange }: props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { addWorkout } = useWorkoutStore();

  const handleCreate = () => {
    addWorkout({
      name: name.trim(),
      description: description.trim(),
    });

    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={"gap-2"}>
        <DialogHeader>
          {" "}
          <DialogTitle>Create Workout</DialogTitle>
          <DialogDescription>
            To create a new workout, just specify the name and click on create!
          </DialogDescription>
        </DialogHeader>
        <Label className="mt-2">Name</Label>
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
        <Label className="mt-2">Description</Label>
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
        <Button onClick={handleCreate} className={"mt-2"}>
          <PlusIcon />
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
}
