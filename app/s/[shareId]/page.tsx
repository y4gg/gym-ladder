"use client";

import { use, useState, useEffect } from "react";
import { fetchSharedWorkout, copySharedWorkout } from "@/server/workouts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Loader2Icon, CopyIcon, DumbbellIcon, Share2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface SharedExercise {
  id: string;
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number | null;
  notes?: string | null;
}

interface SharedWorkoutData {
  id: string;
  workout: {
    id: string;
    name: string;
    description: string | null;
    exercises: SharedExercise[];
  };
  sharedBy: string;
  createdAt: Date;
  shareNotes: boolean;
}

export default function SharedWorkoutPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = use(params);
  const [sharedWorkout, setSharedWorkout] = useState<SharedWorkoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const loadSharedWorkout = async () => {
      try {
        const data = await fetchSharedWorkout(shareId);
        if (!data) {
          setError("Workout not found");
        } else {
          setSharedWorkout(data);
        }
      } catch {
        setError("Failed to load workout");
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedWorkout();
  }, [shareId]);

  const handleCopyWorkout = async () => {
    if (!session) {
      toast.error("Please log in to copy this workout");
      return;
    }

    setIsCopying(true);
    try {
      await copySharedWorkout(shareId);
      toast.success("Workout copied to your account");
      router.push("/");
    } catch {
      toast.error("Failed to copy workout");
    } finally {
      setIsCopying(false);
    }
  };

  const formatReps = (repsMin: number, repsMax: number | null) => {
    if (repsMax === null || repsMin === repsMax) {
      return `${repsMin} reps`;
    }
    return `${repsMin}-${repsMax} reps`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !sharedWorkout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Share2Icon className="size-16 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Workout Not Found</h1>
        <p className="text-muted-foreground">
          This shared workout may have been removed or the link is invalid.
        </p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-4 md:mt-10">
      <Card className="wrapper">
        <CardHeader>
          <CardTitle className="text-2xl">{sharedWorkout.workout.name}</CardTitle>
          <CardDescription>
            Shared by {sharedWorkout.sharedBy} • {sharedWorkout.workout.exercises.length} exercises
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sharedWorkout.workout.description && (
            <p className="text-muted-foreground mb-4">
              {sharedWorkout.workout.description}
            </p>
          )}

          <div className="flex flex-col gap-2 mb-6">
            {sharedWorkout.workout.exercises.map((exercise) => (
              <Item key={exercise.id} variant="outline" className="flex-col items-start gap-1">
                <ItemContent>
                  <ItemTitle className="text-base">
                    <DumbbellIcon className="size-4 mr-2" />
                    {exercise.name}
                  </ItemTitle>
                  <ItemDescription>
                    {exercise.sets} sets • {formatReps(exercise.repsMin, exercise.repsMax)}
                  </ItemDescription>
                  {sharedWorkout.shareNotes && exercise.notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Note: {exercise.notes}
                    </p>
                  )}
                </ItemContent>
              </Item>
            ))}
          </div>

          {session && (
            <Button onClick={handleCopyWorkout} disabled={isCopying} className="w-full">
              {isCopying ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <CopyIcon />
              )}
              Copy to My Workouts
            </Button>
          )}

          {!session && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Log in to copy this workout to your account
              </p>
              <Button variant="outline" onClick={() => router.push(`/login?redirect=/s/${shareId}`)}>
                Log In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
