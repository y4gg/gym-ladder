"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { ListIcon } from "lucide-react";
import { RearrangeExercisesDialog } from "./rearrange-exercises-dialog";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();
  const workoutId = pathname.match(/^\/w\/([^/]+)/)?.[1] ?? null;
  const [rearrangeOpen, setRearrangeOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <SidebarTrigger />
            {workoutId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRearrangeOpen(true)}
              >
                <ListIcon className="size-4" />
              </Button>
            )}
          </div>
          {children}
        </div>
        {workoutId && (
          <RearrangeExercisesDialog
            workoutId={workoutId}
            open={rearrangeOpen}
            onOpenChange={setRearrangeOpen}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
