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

function UserDropdown() {}

function WorkoutSelector() {}

function Branding() {
  return <h1 className="text-2xl font-semibold">Gym ladder</h1>;
}

function ModeToggle() {}

function LoginButton() {
  return (
    <Link href={"/login"}>
      <Button>Login</Button>
    </Link>
  );
}

export function Header() {
  return (
    <div className="flex items-center justify-between bg-accent">
      <div>
        <Branding />
      </div>
      <div>
        <LoginButton />
      </div>
    </div>
  );
}
