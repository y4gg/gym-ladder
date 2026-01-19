"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangePassword: (password: string, newPassword: string) => void;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onChangePassword,
}: ChangePasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = () => {
    onChangePassword(password, newPassword);
    setPassword("");
    setNewPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-3">
        <Label>Current Password</Label>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          placeholder="************"
        />
        <Label>New Password</Label>
        <Input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          id="new-password"
          placeholder="************"
        />
        <Button onClick={handleChangePassword}>Change Password</Button>
      </DialogContent>
    </Dialog>
  );
}
