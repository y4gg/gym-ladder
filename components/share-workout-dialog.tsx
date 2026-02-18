"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@base-ui/react/checkbox";
import { CheckIcon, CopyIcon, Loader2Icon } from "lucide-react";
import { shareWorkout } from "@/server/workouts";
import { toast } from "sonner";

interface ShareWorkoutDialogProps {
  workoutId: string;
  workoutName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareWorkoutDialog({
  workoutId,
  workoutName,
  open,
  onOpenChange,
}: ShareWorkoutDialogProps) {
  const [shareNotes, setShareNotes] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = shareId ? `${window.location.origin}/s/${shareId}` : "";

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const result = await shareWorkout(workoutId, shareNotes);
      setShareId(result.id);
    } catch {
      toast.error("Failed to create share link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setShareId(null);
    setShareNotes(false);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Workout</DialogTitle>
          <DialogDescription>
            Share &quot;{workoutName}&quot; with your friends
          </DialogDescription>
        </DialogHeader>

        {!shareId ? (
          <>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Your workout will be shared with exercises, sets, and reps.
                Weight information is never shared.
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox.Root
                  checked={shareNotes}
                  onCheckedChange={setShareNotes}
                  className="w-5 h-5 flex items-center justify-center rounded border border-input data-[checked]:bg-primary data-[checked]:border-primary"
                >
                  <Checkbox.Indicator>
                    <CheckIcon className="w-4 h-4 text-primary-foreground" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Include notes</span>
                  <span className="text-xs text-muted-foreground">
                    Share exercise notes along with sets and reps
                  </span>
                </div>
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleShare} disabled={isLoading}>
                {isLoading && <Loader2Icon className="animate-spin" />}
                Create Link
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Anyone with this link can view your workout:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm bg-muted rounded-md border"
                />
                <Button onClick={handleCopy} variant="outline" size="icon">
                  {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                </Button>
              </div>
              {shareNotes && (
                <p className="text-xs text-muted-foreground">
                  Notes are included in this shared workout.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
