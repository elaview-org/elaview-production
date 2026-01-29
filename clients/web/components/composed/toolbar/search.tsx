"use client";

import { Input } from "@/components/primitives/input";
import { IconSearch } from "@tabler/icons-react";

type Props = {
  searchTarget: string;
};

export default function ToolbarSearch({ searchTarget }: Props) {
  return (
    <div className="relative w-80">
      <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input placeholder={`Search ${searchTarget}...`} className="pl-9" />
    </div>
  );
}
