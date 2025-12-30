"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

export type Period = "7d" | "30d" | "90d" | "1y";

export default function PeriodSelector({ period }: { period: Period }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value as Period;
    router.replace(pathname + "?" + createQueryString("period", newPeriod), { scroll: false });
  };

  return (
    <select
      value={period}
      onChange={handleChange}
      className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white"
    >
      <option value="7d">Last 7 days</option>
      <option value="30d">Last 30 days</option>
      <option value="90d">Last 90 days</option>
      <option value="1y">Last year</option>
    </select>
  );
}
