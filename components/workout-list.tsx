import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Workout {
  id: string;
  name: string;
  description: string;
}

export function WorkoutList() {
  const workouts: Workout[] = [
    { id: "1", name: "Workout 1", description: "Workout 1 description" },
    { id: "2", name: "Workout 2", description: "Workout 2 description" },
    { id: "3", name: "Workout 3", description: "Workout 3 description" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="wrapper">
        <CardHeader>
          <CardTitle>Workout List</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
                <CardDescription>{workout.description}</CardDescription>
                <CardAction>
                  <Button>View</Button>
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
