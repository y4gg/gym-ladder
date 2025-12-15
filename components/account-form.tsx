"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WrenchIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (!session && !isPending) {
    toast.error("You need to log in first.");
    router.push("/");
  }

  return (
    <div className="flex justify-center w-screen">
      <Card className="small-wrapper mt-10">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Email</Label>
          <div className="flex gap-1">
            <Input disabled value={session?.user.email} />
            <Button size={"icon"}>
              <WrenchIcon />
            </Button>
          </div>
          <Label className="mt-2">Password</Label>
          <div className="flex gap-1">
            <Input disabled value="************" />
            <Button size={"icon"}>
              <WrenchIcon />
            </Button>
          </div>
          <Label className="mt-2">Danger Zone</Label>
          <Button variant={"destructive"} className={"w-full"}>
            <Trash2Icon />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
