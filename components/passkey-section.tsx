"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2Icon, PlusIcon, Trash2Icon, FingerprintIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface Passkey {
  id: string;
  name: string;
  deviceType: string;
  createdAt: Date | null;
}

interface PasskeySectionProps {
  passkeys: Passkey[];
  passkeysLoading: boolean;
  addPasskeyLoading: boolean;
  deletePasskeyId: string | null;
  onAddPasskey: () => void;
  onSetDeletePasskeyId: (id: string | null) => void;
  onDeletePasskey: (id: string) => void;
}

export function PasskeySection({
  passkeys,
  passkeysLoading,
  addPasskeyLoading,
  deletePasskeyId,
  onAddPasskey,
  onSetDeletePasskeyId,
  onDeletePasskey,
}: PasskeySectionProps) {
  return (
    <>
      <Card className="small-wrapper">
        <CardHeader>
          <CardTitle className="text-xl">Passkeys</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={onAddPasskey} disabled={addPasskeyLoading} className="w-full">
            {addPasskeyLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <PlusIcon />
            )}
            Add Passkey
          </Button>
          {passkeys.length > 0 && (
            <div className="mt-4 space-y-2">
              <Label>Your Passkeys</Label>
              {passkeysLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner className="h-6 w-6" />
                </div>
              ) : (
                passkeys.map((passkey) => (
                  <div
                    key={passkey.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FingerprintIcon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{passkey.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {passkey.deviceType}
                          {passkey.createdAt &&
                            ` • Added ${new Date(passkey.createdAt).toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onSetDeletePasskeyId(passkey.id)}
                    >
                      <Trash2Icon className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deletePasskeyId}
        onOpenChange={(open) => !open && onSetDeletePasskeyId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Passkey</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this passkey? You will need to re-register
              it to use passkey authentication again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePasskeyId && onDeletePasskey(deletePasskeyId)}
            >
              <Trash2Icon />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
