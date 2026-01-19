"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeEmail: (newEmail: string) => void;
}

export function ChangeEmailDialog({
  open,
  onOpenChange,
  onChangeEmail,
}: ChangeEmailDialogProps) {
  const [newEmail, setNewEmail] = useState("");

  const handleChangeEmail = () => {
    onChangeEmail(newEmail);
    setNewEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-3">
        <Label>New Email</Label>
        <Input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          type="email"
          placeholder="me@example.com"
        />
        <Button onClick={handleChangeEmail}>Change Email</Button>
      </DialogContent>
    </Dialog>
  );
}
