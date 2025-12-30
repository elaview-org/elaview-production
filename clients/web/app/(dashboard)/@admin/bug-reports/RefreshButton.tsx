"use client";

import { Button } from "../../../../../elaview-mvp/src/components/ui/Button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RefreshButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.refresh()} variant="ghost" size="sm">
      <RefreshCw className="mr-2 h-4 w-4" />
      Refresh
    </Button>
  );
}
