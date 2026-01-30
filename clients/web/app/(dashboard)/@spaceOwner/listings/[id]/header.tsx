"use client";

import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { SPACE_STATUS } from "@/lib/constants";
import { useBreadcrumbLabel } from "@/components/composed/breadcrumb-nav";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconChevronLeft } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";

const Header_SpaceFragment = graphql(`
  fragment Header_SpaceFragment on Space {
    title
    status
  }
`);

type Props = {
  data: FragmentType<typeof Header_SpaceFragment>;
};

export default function Header({ data }: Props) {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const space = getFragmentData(Header_SpaceFragment, data);
  useBreadcrumbLabel(id, space.title);

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
    </div>
  );
}
