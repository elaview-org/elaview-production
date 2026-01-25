"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/primitives/button";
import { cn } from "@/lib/utils";
import { FILTER_TABS, type FilterTabKey } from "./constants";

export default function FilterTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = (searchParams.get("status") as FilterTabKey) ?? "all";

  const setTab = useCallback(
    (tab: FilterTabKey) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "all") {
        params.delete("status");
      } else {
        params.set("status", tab);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex gap-1 rounded-lg border p-1">
      {FILTER_TABS.map((tab) => (
        <Button
          key={tab.key}
          variant="ghost"
          size="sm"
          onClick={() => setTab(tab.key)}
          className={cn(
            "h-8 px-3 text-sm",
            currentTab === tab.key && "bg-muted"
          )}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}