"use client";

import * as React from "react";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/primitives/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import Modal from "@/components/composed/modal";
import { cn } from "@/lib/core/utils";
import { SPACE_COLORS } from "./constants";
import type { CalendarSpace } from "./types";

type Props = {
  spaces: CalendarSpace[];
  selectedSpaceId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBlock: (spaceId: string, dates: string[], reason?: string) => void;
};

function generateDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  while (current <= endDate) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function BlockDatesDialog({
  spaces,
  selectedSpaceId,
  open,
  onOpenChange,
  onBlock,
}: Props) {
  const [spaceId, setSpaceId] = React.useState(selectedSpaceId ?? "");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [reason, setReason] = React.useState("");

  const canSubmit = spaceId && startDate && endDate && startDate <= endDate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const dates = generateDateRange(startDate, endDate);
    if (dates.length === 0) return;
    onBlock(spaceId, dates, reason || undefined);
    onOpenChange(false);
  };

  return (
    <Modal
      title="Block Dates"
      description="Block a range of dates for a space to prevent bookings."
      open={open}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="block-space">Space</FieldLabel>
            <Select value={spaceId} onValueChange={setSpaceId}>
              <SelectTrigger id="block-space">
                <SelectValue placeholder="Select a space" />
              </SelectTrigger>
              <SelectContent>
                {spaces.map((space) => {
                  const color =
                    SPACE_COLORS[space.colorIndex % SPACE_COLORS.length];
                  return (
                    <SelectItem key={space.id} value={space.id}>
                      <span className={cn("size-2 rounded-full", color.bg)} />
                      {space.title}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="block-start">Start Date</FieldLabel>
              <Input
                id="block-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="block-end">End Date</FieldLabel>
              <Input
                id="block-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split("T")[0]}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="block-reason">Reason (optional)</FieldLabel>
            <Input
              id="block-reason"
              placeholder="e.g., Renovation, Personal use"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <FieldDescription>
              Add an optional reason for blocking these dates
            </FieldDescription>
          </Field>
        </FieldGroup>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            Block Dates
          </Button>
        </div>
      </form>
    </Modal>
  );
}
