"use client";

import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { SPACE_STATUS, SPACE_TYPE } from "@/lib/constants";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export const Header_SharedSpaceFragment = graphql(`
  fragment Header_SharedSpaceFragment on Space {
    title
    status
    type
  }
`);

type Props = {
  data: FragmentType<typeof Header_SharedSpaceFragment>;
};

export default function Header({ data }: Props) {
  const router = useRouter();
  const space = getFragmentData(Header_SharedSpaceFragment, data);

  return (
    <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <IconChevronLeft className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Go back</TooltipContent>
      </Tooltip>
      <h1 className="text-2xl font-semibold">{space.title}</h1>
      <Badge variant={SPACE_STATUS.variants[space.status]}>
        {SPACE_STATUS.labels[space.status]}
      </Badge>
      <Badge variant="outline">{SPACE_TYPE.labels[space.type]}</Badge>
    </div>
  );
}
