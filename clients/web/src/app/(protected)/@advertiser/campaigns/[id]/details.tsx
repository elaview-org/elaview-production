"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import {
  updateCampaignAction,
  type UpdateCampaignState,
} from "../campaigns.actions";
import { toast } from "sonner";

export const Details_CampaignFragment = graphql(`
  fragment Details_CampaignFragment on Campaign {
    id
    name
    description
    goals
    targetAudience
    startDate
    endDate
    totalBudget
  }
`);

type Props = {
  data: FragmentType<typeof Details_CampaignFragment>;
};

export default function Details({ data }: Props) {
  const campaign = getFragmentData(Details_CampaignFragment, data);
  const prevSuccessRef = useRef(false);

  const boundAction = updateCampaignAction.bind(null, campaign.id);
  const [state, action, pending] = useActionState<
    UpdateCampaignState,
    FormData
  >(boundAction, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.message) {
      if (state.success && !prevSuccessRef.current) {
        toast.success(state.message);
      } else if (!state.success) {
        toast.error(state.message);
      }
    }
    prevSuccessRef.current = state.success;
  }, [state]);

  const startDate = campaign.startDate
    ? new Date(campaign.startDate as string).toISOString().split("T")[0]
    : "";
  const endDate = campaign.endDate
    ? new Date(campaign.endDate as string).toISOString().split("T")[0]
    : "";

  return (
    <form action={action} className="rounded-lg border">
      <Row label="Campaign Name">
        <Input name="name" defaultValue={campaign.name} />
      </Row>

      <Row label="Description">
        <textarea
          name="description"
          defaultValue={campaign.description ?? ""}
          placeholder="Describe your campaign..."
          className="border-input bg-background min-h-20 w-full rounded-md border px-3 py-2 text-sm"
        />
      </Row>

      <Row label="Goals">
        <Input
          name="goals"
          defaultValue={campaign.goals ?? ""}
          placeholder="Campaign goals"
        />
      </Row>

      <Row label="Target Audience">
        <Input
          name="targetAudience"
          defaultValue={campaign.targetAudience ?? ""}
          placeholder="Target audience"
        />
      </Row>

      <Row label="Start Date">
        <Input name="startDate" type="date" defaultValue={startDate} />
      </Row>

      <Row label="End Date">
        <Input name="endDate" type="date" defaultValue={endDate} />
      </Row>

      <Row label="Total Budget">
        <div className="relative">
          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
            $
          </span>
          <Input
            name="totalBudget"
            type="number"
            defaultValue={
              campaign.totalBudget ? String(campaign.totalBudget) : ""
            }
            className="pl-7"
            min={100}
          />
        </div>
      </Row>

      <div className="flex justify-end border-t p-4">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : (
            <IconCheck className="size-4" />
          )}
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 items-start gap-4 border-b p-4 last:border-b-0">
      <label className="text-muted-foreground pt-2 text-sm">{label}</label>
      <div className="col-span-2">{children}</div>
    </div>
  );
}
