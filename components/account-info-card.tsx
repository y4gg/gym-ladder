"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Trash2Icon, WrenchIcon } from "lucide-react";

interface AccountInfoCardProps {
  email: string;
  isPending: boolean;
  onChangeEmail: () => void;
  onChangePassword: () => void;
  onDeleteAccount: () => void;
}

export function AccountInfoCard({
  email,
  isPending,
  onChangeEmail,
  onChangePassword,
  onDeleteAccount,
}: AccountInfoCardProps) {
  return (
    <Card className="small-wrapper">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Account</CardTitle>
      </CardHeader>
      <CardContent>
        {!isPending ? (
          <>
            <Label className="mb-2">Email</Label>
            <div className="flex gap-1">
              <Input disabled value={email} />
              <Button size={"icon"} onClick={onChangeEmail}>
                <WrenchIcon />
              </Button>
            </div>
            <Label className="mb-2 mt-5">Password</Label>
            <div className="flex gap-1">
              <Input disabled value="************" />
              <Button size={"icon"} onClick={onChangePassword}>
                <WrenchIcon />
              </Button>
            </div>
            <Label className="mb-2 mt-5">Danger Zone</Label>
            <Button variant={"destructive"} className={"w-full"} onClick={onDeleteAccount}>
              <Trash2Icon />
              Delete Account & Data
            </Button>
          </>
        ) : (
          <div className="w-full flex items-center justify-center h-53.5">
            <Spinner className="h-10 w-10" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
