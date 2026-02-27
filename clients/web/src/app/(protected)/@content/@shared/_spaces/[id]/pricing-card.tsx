"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Input } from "@/components/primitives/input";
import { Separator } from "@/components/primitives/separator";
import { formatCurrency } from "@/lib/core/utils";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";

export const PricingCard_SpaceFragment = graphql(`
  fragment PricingCard_SpaceFragment on Space {
    pricePerDay
    installationFee
    minDuration
    maxDuration
  }
`);

type Props = {
  data: FragmentType<typeof PricingCard_SpaceFragment>;
};

export default function PricingCard({ data }: Props) {
  const space = getFragmentData(PricingCard_SpaceFragment, data);
  const [days, setDays] = useState(space.minDuration);

  const durationText = space.maxDuration
    ? `${space.minDuration}–${space.maxDuration} days`
    : `${space.minDuration} days min`;

  const estimatedTotal =
    Number(space.pricePerDay) * days + Number(space.installationFee ?? 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="text-3xl font-semibold">
            {formatCurrency(space.pricePerDay)}
            <span className="text-muted-foreground text-base font-normal">
              /day
            </span>
          </p>
        </div>
        <Separator />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Installation Fee</span>
          <span className="font-medium">
            {space.installationFee
              ? formatCurrency(space.installationFee)
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Duration</span>
          <span className="font-medium">{durationText}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="duration" className="text-muted-foreground text-sm">
            Days
          </label>
          <Input
            id="duration"
            type="number"
            min={space.minDuration}
            max={space.maxDuration ?? undefined}
            value={days}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (
                val >= space.minDuration &&
                (!space.maxDuration || val <= space.maxDuration)
              ) {
                setDays(val);
              }
            }}
            className="w-20 text-right"
          />
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span>Estimated Total</span>
          <span>{formatCurrency(estimatedTotal)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled>
          Request Booking
        </Button>
      </CardFooter>
    </Card>
  );
}
