"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WrenchIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
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
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

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

  return (
    <div className="flex justify-center mt-4 md:mt-10">
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
    </div>
  );
}
