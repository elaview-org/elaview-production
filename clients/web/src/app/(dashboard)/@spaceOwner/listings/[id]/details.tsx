"use client";

import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { TYPE_LABELS } from "../constants";

export const Details_SpaceFragment = graphql(`
  fragment Details_SpaceFragment on Space {
    id
    description
    type
    address
    city
    state
    zipCode
    traffic
    pricePerDay
    installationFee
    minDuration
    maxDuration
    width
    height
    dimensionsText
    availableFrom
    availableTo
  }
`);

type Props = {
  data: FragmentType<typeof Details_SpaceFragment>;
};

export default function Details({ data }: Props) {
  const space = getFragmentData(Details_SpaceFragment, data);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    // TODO: implement updateSpace mutation
    await new Promise((r) => setTimeout(r, 500));
    setPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border">
      <Row label="Space Type">
        <select
          name="type"
          defaultValue={space.type}
          className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
        >
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Row>

      <Row label="Description">
        <textarea
          name="description"
          defaultValue={space.description ?? ""}
          placeholder="Describe your space..."
          className="border-input bg-background min-h-20 w-full rounded-md border px-3 py-2 text-sm"
        />
      </Row>

      <Row label="Address">
        <Input name="address" defaultValue={space.address} />
      </Row>

      <Row label="City">
        <Input name="city" defaultValue={space.city} />
      </Row>

      <Row label="State">
        <Input
          name="state"
          defaultValue={space.state}
          maxLength={2}
          className="uppercase"
        />
      </Row>

      <Row label="ZIP Code">
        <Input name="zipCode" defaultValue={space.zipCode ?? ""} />
      </Row>

      <Row label="Foot Traffic">
        <Input
          name="traffic"
          defaultValue={space.traffic ?? ""}
          placeholder="e.g., High foot traffic area"
        />
      </Row>

      <Row label="Daily Rate">
        <div className="relative">
          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
            $
          </span>
          <Input
            name="pricePerDay"
            type="number"
            defaultValue={String(space.pricePerDay)}
            className="pl-7"
            min={1}
          />
        </div>
      </Row>

      <Row label="Installation Fee">
        <div className="relative">
          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
            $
          </span>
          <Input
            name="installationFee"
            type="number"
            defaultValue={
              space.installationFee ? String(space.installationFee) : ""
            }
            className="pl-7"
            placeholder="Optional"
          />
        </div>
      </Row>

      <Row label="Width (inches)">
        <Input name="width" type="number" defaultValue={space.width ?? ""} />
      </Row>

      <Row label="Height (inches)">
        <Input name="height" type="number" defaultValue={space.height ?? ""} />
      </Row>

      <Row label="Min Duration (days)">
        <Input
          name="minDuration"
          type="number"
          defaultValue={space.minDuration}
          min={1}
        />
      </Row>

      <Row label="Max Duration (days)">
        <Input
          name="maxDuration"
          type="number"
          defaultValue={space.maxDuration ?? ""}
          placeholder="No limit"
        />
      </Row>

      <div className="flex justify-end border-t p-4">
        <Button type="submit" disabled={pending}>
          <IconCheck className="size-4" />
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
