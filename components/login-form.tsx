"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSync } from "@/lib/useSync";
import { LogInIcon, Loader2Icon } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { syncWorkouts } = useSync();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    try {
      event?.preventDefault();
      setLoading(true);
      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }

      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to sign in");
        return;
      }

      toast.success("Signed in");
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="username webauthn"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password webauthn"
                />
              </Field>
              <Field>
                <Button type="submit" disabled={!email || !password || loading}>
                  {loading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <LogInIcon />
                  )}
                  Login
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/register">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
