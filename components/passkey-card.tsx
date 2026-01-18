"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSync } from "@/lib/useSync";
import { LogInIcon, Loader2Icon, FingerprintIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PasskeyCard() {
  const router = useRouter();
  const { syncWorkouts } = useSync();
  const [loading, setLoading] = useState(false);
  const [supportsConditional, setSupportsConditional] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && 
        window.PublicKeyCredential && 
        "isConditionalMediationAvailable" in window.PublicKeyCredential) {
      window.PublicKeyCredential.isConditionalMediationAvailable?.().then(
        (available) => setSupportsConditional(available)
      );
    }

    if (supportsConditional) {
      void authClient.signIn.passkey({ autoFill: true });
    }
  }, [supportsConditional]);

  const handlePasskeySignIn = async () => {
    try {
      setLoading(true);
      const { error } = await authClient.signIn.passkey();

      if (error) {
        toast.error(error.message || "Failed to sign in with passkey");
        return;
      }

      toast.success("Signed in with passkey");
      toast.loading("Syncing your workouts...", { id: "sync-loading" });
      try {
        await syncWorkouts();
        toast.success("Workouts synced");
      } catch (error) {
        console.error("Sync failed:", error);
        toast.error("Some workouts failed to sync");
      } finally {
        toast.dismiss("sync-loading");
      }
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Button
          type="button"
          onClick={handlePasskeySignIn}
          disabled={loading}
          className="w-full"
          variant="outline"
        >
          {loading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <FingerprintIcon />
          )}
          Sign in with Passkey
        </Button>
      </CardContent>
    </Card>
  );
}
