"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { PlusIcon, Home, LayoutDashboard, User, SearchIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkoutStore } from "@/lib/workout";
import { useState } from "react";
import { CreateWorkoutDialog } from "./create-workout-dialog";
import { useSyncOnMount } from "@/lib/useSync";
import { ModeToggle } from "@/components/mode-toggle";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AppSidebar() {
  const pathname = usePathname();
  const workouts = useWorkoutStore((state) => state.workouts);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = authClient.useSession();
  
  useSyncOnMount();

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isWorkoutActive = (workoutId: string) => pathname === `/w/${workoutId}`;

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                size="lg" 
                render={<Link href="/" />}
                isActive={pathname === "/"}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Gym Ladder</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Search</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="relative w-full">
                <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search workouts..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    render={<Link href="/" />}
                    isActive={pathname === "/"}
                  >
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Workouts</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredWorkouts.length === 0 ? (
                  <SidebarMenuItem>
                    <div className="flex flex-col gap-2 p-2 text-sm text-muted-foreground">
                      <p>{searchQuery ? "No workouts found" : "No workouts yet"}</p>
                      <p className="text-xs">{searchQuery ? "Try a different search term" : "Create your first workout"}</p>
                    </div>
                  </SidebarMenuItem>
                ) : (
                  filteredWorkouts.map((workout) => (
                    <SidebarMenuItem key={workout.id}>
                      <SidebarMenuButton
                        render={<Link href={`/w/${workout.id}`} />}
                        isActive={isWorkoutActive(workout.id)}
                      >
                        <div className="flex flex-col items-start">
                          <span>{workout.name}</span>
                          {workout.description && (
                            <span className="text-xs text-muted-foreground truncate">
                              {workout.description}
                            </span>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    variant="default"
                    onClick={() => setOpen(true)}
                  >
                    <PlusIcon />
                    <span>New Workout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="flex items-center gap-2">
                    <ModeToggle />
                    {session ? (
                      <>
                        <SidebarMenuButton 
                          render={<Link href="/account" />}
                          isActive={pathname === "/account"}
                          className="flex-1"
                        >
                          <User />
                          <span>Account</span>
                        </SidebarMenuButton>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={async () => {
                            await authClient.signOut();
                          }}
                        >
                          <LogOutIcon className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <SidebarMenuButton 
                        render={<Link href="/login" />}
                        className="flex-1"
                      >
                        <User />
                        <span>Login</span>
                      </SidebarMenuButton>
                    )}
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
      <CreateWorkoutDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
