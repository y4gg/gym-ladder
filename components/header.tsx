"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

function AccountButton() {
  return (
    <Link href={"/account"}>
      <Button>Account</Button>
    </Link>
  );
}

function WorkoutSelector() {}

function Branding() {
  return (
    <Link href={"/"} className="flex gap-2">
      <Image src={"/logo.png"} alt="Logo" width={68} height={34} />
      <h1 className="text-2xl font-semibold">Gym ladder</h1>
    </Link>
  );
}

function LoginButton() {
  return (
    <Link href={"/login"}>
      <Button>Login</Button>
    </Link>
  );
}

export function Header() {
  const { data: session } = authClient.useSession();

  return (
    <Card className="mt-2 mx-2">
      <CardContent className="flex items-center justify-between">
        <div>
          <Branding />
        </div>
        <div className="flex gap-1">
          <ModeToggle />
          {session ? <AccountButton /> : <LoginButton />}
        </div>
      </CardContent>
    </Card>
  );
}
