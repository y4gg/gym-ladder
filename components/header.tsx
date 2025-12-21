"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { authClient } from "@/lib/auth-client";
// import Image from "next/image";
import { useWorkouts } from "@/lib/workout";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();

  // Extract workoutId from pathname (e.g., "/w/abc123" -> "abc123")
  const workoutIdMatch = pathname.match(/^\/w\/([^/]+)/);
  const workoutId = workoutIdMatch ? workoutIdMatch[1] : null;

  const handleValueChange = (value: string | null) => {
    if (value) {
      router.push(`/w/${value}`);
    }
  };

  // Find the current workout name for display
  const currentWorkoutName = workoutId
    ? workouts.find((w) => w.id === workoutId)?.name || "Select Workout"
    : "Select Workout";

  return (
    <Select value={workoutId || ""} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>{currentWorkoutName}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Workouts</SelectLabel>
          {workouts.length !== 0 ? (
            workouts.map((workout) => (
              <SelectItem key={workout.id} value={workout.id}>
                {workout.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="" disabled>
              No workouts yet.
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function Branding() {
  return (
    <Link href={"/"} className="flex gap-2">
      {/* <Image src={"/logo.png"} alt="Logo" width={68} height={34} /> */}
      <h1 className="text-2xl font-bold">Gym ladder</h1>
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
