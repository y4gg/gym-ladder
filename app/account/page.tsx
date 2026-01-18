"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WrenchIcon, Trash2Icon, PlusIcon, Loader2Icon, FingerprintIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState, useEffect } from "react";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function AccountPage() {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [changeEmailDialog, setChangeEmailDialog] = useState(false);
  const [deletePasskeyId, setDeletePasskeyId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [passkeys, setPasskeys] = useState<Array<{ id: string; name: string; deviceType: string; createdAt: Date | null }>>([]);
  const [passkeysLoading, setPasskeysLoading] = useState(false);
  const [addPasskeyLoading, setAddPasskeyLoading] = useState(false);

  if (!session && !isPending) {
    toast.error("You need to log in first.");
    router.push("/");
  }

  const changePassword = async () => {
    authClient.changePassword({
      newPassword: newPassword,
      currentPassword: password,
      revokeOtherSessions: true,
    });
    toast.success("Password changed");
    setChangePasswordDialog(false);
  };

  const changeEmail = async () => {
    authClient.changeEmail({
      newEmail: newEmail,
    });
    toast.success("Email changed");
    setChangeEmailDialog(false);
  };

  const deleteAccount = async () => {
    authClient.deleteUser();
    toast.success("Account deleted");
    router.push("/");
  };

  const fetchPasskeys = async () => {
    try {
      setPasskeysLoading(true);
      const { data, error } = await authClient.passkey.listUserPasskeys();
      if (error) {
        toast.error(error.message || "Failed to fetch passkeys");
        return;
      }
      setPasskeys(
        (data || []).map((p) => ({
          id: p.id,
          name: p.name || "Unnamed Passkey",
          deviceType: p.deviceType,
          createdAt: p.createdAt,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch passkeys:", error);
      toast.error("Failed to fetch passkeys");
    } finally {
      setPasskeysLoading(false);
    }
  };

  const addPasskey = async () => {
    try {
      setAddPasskeyLoading(true);
      const { error } = await authClient.passkey.addPasskey({
        name: `${session?.user.email}'s Passkey`,
      });
      if (error) {
        toast.error(error.message || "Failed to add passkey");
        return;
      }
      toast.success("Passkey added");
      await fetchPasskeys();
    } catch (error) {
      console.error("Failed to add passkey:", error);
      toast.error("Failed to add passkey");
    } finally {
      setAddPasskeyLoading(false);
    }
  };

  const deletePasskey = async (id: string) => {
    try {
      const { error } = await authClient.passkey.deletePasskey({ id });
      if (error) {
        toast.error(error.message || "Failed to delete passkey");
        return;
      }
      toast.success("Passkey deleted");
      await fetchPasskeys();
      setDeletePasskeyId(null);
    } catch (error) {
      console.error("Failed to delete passkey:", error);
      toast.error("Failed to delete passkey");
    }
  };

  useEffect(() => {
    if (session) {
      void fetchPasskeys();
    }
  }, [session]);

  return (
    <div className="flex justify-center mt-4 md:mt-10 space-y-4 flex-col items-center">
      <Card className="small-wrapper">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Account</CardTitle>
        </CardHeader>
        <CardContent>
          {!isPending && session ? (
            <>
              <Label className="mb-2">Email</Label>
              <div className="flex gap-1">
                <Input disabled value={session.user.email} />
                <Button
                  size={"icon"}
                  onClick={() => setChangeEmailDialog(true)}
                >
                  <WrenchIcon />
                </Button>
              </div>
              <Label className="mb-2 mt-5">Password</Label>
              <div className="flex gap-1">
                <Input disabled value="************" />
                <Button
                  size={"icon"}
                  onClick={() => setChangePasswordDialog(true)}
                >
                  <WrenchIcon />
                </Button>
              </div>
              <Label className="mb-2 mt-5">Danger Zone</Label>
              <Button
                variant={"destructive"}
                className={"w-full"}
                onClick={() => setDeleteConfirm(true)}
              >
                <Trash2Icon />
                Delete Account & Data
              </Button>
              {/* Delete Account Dialog */}
              <AlertDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your account? All of your
                      data will be permanently removed. This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteAccount}>
                      <Trash2Icon />
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* Change Password Dialog */}
              <Dialog
                open={changePasswordDialog}
                onOpenChange={setChangePasswordDialog}
              >
                <DialogContent className={"gap-3"}>
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
                  <Button onClick={changePassword}>Change Password</Button>
                </DialogContent>
              </Dialog>
              {/*Change Email Dialog*/}
              <Dialog
                open={changeEmailDialog}
                onOpenChange={setChangeEmailDialog}
              >
                <DialogContent className={"gap-3"}>
                  <Label>New Email</Label>
                  <Input
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    type="email"
                    placeholder="me@example.com"
                  />
                  <Button onClick={changeEmail}>Change Email</Button>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="w-full flex items-center justify-center h-53.5">
              <Spinner className="h-10 w-10" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="small-wrapper">
        <CardHeader>
          <CardTitle>Add Passkey</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={addPasskey}
            disabled={addPasskeyLoading}
            className="w-full"
          >
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
                          {passkey.createdAt && ` • Added ${new Date(passkey.createdAt).toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeletePasskeyId(passkey.id)}
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

      <AlertDialog open={!!deletePasskeyId} onOpenChange={(open) => !open && setDeletePasskeyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Passkey</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this passkey? You will need to re-register it to use passkey authentication again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletePasskeyId && deletePasskey(deletePasskeyId)}>
              <Trash2Icon />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
