"use client";

import { Card, CardContent } from "@/components/ui/card";

export function HistoryLoadingState() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <p>Loading history...</p>
      </CardContent>
    </Card>
  );
}
