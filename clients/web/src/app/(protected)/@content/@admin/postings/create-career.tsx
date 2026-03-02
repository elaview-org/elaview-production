"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/primitives/dialog";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
import {
  CAREER_DEPARTMENT_LABELS,
  CAREER_TYPE_LABELS,
} from "@/lib/types/career";
import {
  createCareerAction,
  careerActionInitialState,
} from "./careers.actions";
import { toast } from "sonner";

type Props = {
  triggerLabel?: string;
};

export default function CreateCareer({ triggerLabel = "New career" }: Props) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    createCareerAction,
    careerActionInitialState
  );

  useEffect(() => {
    if (state.message && !state.success) {
      toast.error(state.message);
    }
    if (state.success) {
      toast.success("Career created successfully.");
      startTransition(() => setOpen(false));
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <IconPlus className="mr-1 size-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create career posting</DialogTitle>
        </DialogHeader>

        <form action={action} className="flex flex-col gap-4 pt-2">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="title">
              Job title <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              required
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
            />
            {state.fieldErrors.title && (
              <p className="text-destructive text-xs">
                {state.fieldErrors.title[0]}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Department */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="department">
                Department <span className="text-destructive">*</span>
              </label>
              <select
                id="department"
                name="department"
                required
                className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
              >
                <option value="">Select department</option>
                {Object.entries(CAREER_DEPARTMENT_LABELS).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
              {state.fieldErrors.department && (
                <p className="text-destructive text-xs">
                  {state.fieldErrors.department[0]}
                </p>
              )}
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="type">
                Employment type <span className="text-destructive">*</span>
              </label>
              <select
                id="type"
                name="type"
                required
                className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
              >
                <option value="">Select type</option>
                {Object.entries(CAREER_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {state.fieldErrors.type && (
                <p className="text-destructive text-xs">
                  {state.fieldErrors.type[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="location">
                Location <span className="text-destructive">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Remote or San Francisco, CA"
                required
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
              />
              {state.fieldErrors.location && (
                <p className="text-destructive text-xs">
                  {state.fieldErrors.location[0]}
                </p>
              )}
            </div>

            {/* Active */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Status</label>
              <div className="flex h-9 items-center gap-2">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  value="true"
                  defaultChecked
                  className="size-4 rounded"
                />
                <label htmlFor="isActive" className="text-sm">
                  Active (visible on public careers page)
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="description">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Describe the role, responsibilities, and what a typical day looks like..."
              required
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
            />
            {state.fieldErrors.description && (
              <p className="text-destructive text-xs">
                {state.fieldErrors.description[0]}
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="requirements">
              Requirements <span className="text-destructive">*</span>
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={5}
              placeholder="List the skills, experience, and qualifications you are looking for..."
              required
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
            />
            {state.fieldErrors.requirements && (
              <p className="text-destructive text-xs">
                {state.fieldErrors.requirements[0]}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              Create posting
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
