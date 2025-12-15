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

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (session) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      toast.error(error.message || "Failed to create account");
      return;
    }

    toast.success("Account created");
    router.push("/");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                  required
                />
              </Field>
              <Field>
                <Button type="submit">Create account</Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Log in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
