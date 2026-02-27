"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";

type Campaign = {
  id: string;
  name: string;
};

type Props = {
  campaigns: Campaign[];
};

export default function CampaignFilter({ campaigns }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("campaign") ?? "all";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("campaign");
    } else {
      params.set("campaign", value);
    }
    params.delete("after");
    router.push(`?${params.toString()}`);
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="All Campaigns" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Campaigns</SelectItem>
        {campaigns.map((campaign) => (
          <SelectItem key={campaign.id} value={campaign.id}>
            {campaign.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
