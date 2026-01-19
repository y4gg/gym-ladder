"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AccountInfoCard } from "@/components/account-info-card";
import { ChangePasswordDialog } from "@/components/change-password-dialog";
import { ChangeEmailDialog } from "@/components/change-email-dialog";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { PasskeySection } from "@/components/passkey-section";
import { useState, useEffect } from "react";

export default function AccountPage() {
  const router = useRouter();
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [changeEmailDialog, setChangeEmailDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePasskeyId, setDeletePasskeyId] = useState<string | null>(null);
  const [passkeys, setPasskeys] = useState<Array<{ id: string; name: string; deviceType: string; createdAt: Date | null }>>([]);
  const [passkeysLoading, setPasskeysLoading] = useState(false);
  const [addPasskeyLoading, setAddPasskeyLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  if (!session && !isPending) {
    toast.error("You need to log in first.");
    router.push("/");
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    authClient.changePassword({
      newPassword: newPassword,
      currentPassword: currentPassword,
      revokeOtherSessions: true,
    });
    toast.success("Password changed");
    setChangePasswordDialog(false);
  };

  const changeEmail = async (newEmail: string) => {
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
      <AccountInfoCard
        email={session?.user.email || ""}
        isPending={isPending}
        onChangeEmail={() => setChangeEmailDialog(true)}
        onChangePassword={() => setChangePasswordDialog(true)}
        onDeleteAccount={() => setDeleteConfirm(true)}
      />
      <PasskeySection
        passkeys={passkeys}
        passkeysLoading={passkeysLoading}
        addPasskeyLoading={addPasskeyLoading}
        deletePasskeyId={deletePasskeyId}
        onAddPasskey={addPasskey}
        onSetDeletePasskeyId={setDeletePasskeyId}
        onDeletePasskey={deletePasskey}
      />
      <ChangePasswordDialog
        open={changePasswordDialog}
        onOpenChange={setChangePasswordDialog}
        onChangePassword={changePassword}
      />
      <ChangeEmailDialog
        open={changeEmailDialog}
        onOpenChange={setChangeEmailDialog}
        onChangeEmail={changeEmail}
      />
      <DeleteAccountDialog
        open={deleteConfirm}
        onOpenChange={setDeleteConfirm}
        onDeleteAccount={deleteAccount}
      />
    </div>
  );
}
