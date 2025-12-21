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
import { useWorkouts } from "@/lib/workout";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

function AccountButton() {
  return (
    <Link href={"/account"}>
      <Button>Account</Button>
    </Link>
  );
}

function WorkoutSelector() {
  const workouts = useWorkouts((state) => state.workouts);
  const pathname = usePathname();

  // Extract workoutId from pathname (e.g., "/w/abc123" -> "abc123")
  const workoutIdMatch = pathname.match(/^\/w\/([^/]+)/);
  const workoutId = workoutIdMatch ? workoutIdMatch[1] : null;

  // Find the current workout from the store
  const currentWorkout = workoutId
    ? workouts.find((w) => w.id === workoutId)?.name || "Select Workout"
    : "Select Workout";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"outline"}>
          {currentWorkout} <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {workouts.length != 0 ? (
          workouts.map((workout) => (
            <Link href={"/w/" + workoutId}>
              <DropdownMenuItem>{workout.name}</DropdownMenuItem>
            </Link>
          ))
        ) : (
          <DropdownMenuItem>No workouts yet.</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
        <div className="flex gap-4">
          <Branding />
          <WorkoutSelector />
        </div>
        <div className="flex gap-1">
          <ModeToggle />
          {session ? <AccountButton /> : <LoginButton />}
        </div>
      </CardContent>
    </Card>
  );
}
