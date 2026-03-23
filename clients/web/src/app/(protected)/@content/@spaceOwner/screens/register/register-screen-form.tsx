"use client";

import { useActionState, useEffect, startTransition } from "react";
import { Button } from "@/components/primitives/button";
import { IconPlus } from "@tabler/icons-react";
import {
  registerScreenAction,
  type ScreenActionState,
} from "../screens.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialState: ScreenActionState = {
  success: false,
  message: "",
};

const INPUT_CLASSES =
  "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none";

type Space = { id: string; title: string };

export default function RegisterScreenForm({ spaces }: { spaces: Space[] }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    registerScreenAction,
    initialState,
  );

  useEffect(() => {
    if (state.message && !state.success) {
      toast.error(state.message);
    }
    if (state.success) {
      toast.success(state.message);
      startTransition(() => router.push("/screens"));
    }
  }, [state, router]);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Register Screen</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Add a new digital signage screen to one of your spaces.
        </p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        {/* Space */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="spaceId">
            Space <span className="text-destructive">*</span>
          </label>
          <select
            id="spaceId"
            name="spaceId"
            required
            className={INPUT_CLASSES}
          >
            <option value="">Select a space</option>
            {spaces.map((space) => (
              <option key={space.id} value={space.id}>
                {space.title}
              </option>
            ))}
          </select>
        </div>

        {/* Screen name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="name">
            Screen name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Front Window Display"
            required
            className={INPUT_CLASSES}
          />
        </div>

        {/* Resolution */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="resolution">
            Resolution (optional)
          </label>
          <input
            id="resolution"
            name="resolution"
            type="text"
            placeholder="e.g. 1920x1080"
            className={INPUT_CLASSES}
          />
          <p className="text-muted-foreground text-xs">
            The native resolution of the screen hardware.
          </p>
        </div>

        <Button type="submit" disabled={pending} className="mt-2">
          <IconPlus className="mr-2 size-4" />
          {pending ? "Registering…" : "Register Screen"}
        </Button>
      </form>
    </div>
  );
}
