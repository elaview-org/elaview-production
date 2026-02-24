"use client";

import PaymentsTable from "./payments-table";
import ExportButton from "./export-button";
import DateRangeFilter from "./date-range-filter";
import CampaignFilter from "./campaign-filter";
import Link from "next/link";
import { Button } from "@/components/primitives/button";
import type { PaymentData } from "./payments-table";

type Campaign = {
  id: string;
  name: string;
};

type Props = {
  payments: PaymentData[];
  campaigns: Campaign[];
};

export default function PaymentsSection({ payments, campaigns }: Props) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Payments</h2>
        <div className="flex items-center gap-2">
          <DateRangeFilter />
          <CampaignFilter campaigns={campaigns} />
          <ExportButton payments={payments} />
          <Button variant="outline" size="sm" asChild>
            <Link href="/spending/payments">View All</Link>
          </Button>
        </div>
      </div>
      <PaymentsTable data={payments} />
    </>
  );
}
