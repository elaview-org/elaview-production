"use client";

import { Ban } from "lucide-react";
import { usePathname } from "next/navigation";
import { suspendUserAction } from "./suspend.action";

interface SuspenseButtonProps {
  userId: string;
}

export default function SuspendButton(props: SuspenseButtonProps) {
  const pathname = usePathname();

  return (
    <button
      onClick={async () => {
        await suspendUserAction(props.userId, prompt("Suspension reason:") ?? "", pathname);
        alert("User suspended successfully");
      }}
      className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
    >
      <Ban className="h-4 w-4" />
      Suspend
    </button>
  );
}
