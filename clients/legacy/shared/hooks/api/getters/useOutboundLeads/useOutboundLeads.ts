"use client";

import { fakeLeads } from "../../../../components/crm/__test__/fakeLeadsData";

//! that will including filtering system later;

interface UseOutboundLeadsFilters {
  status?: string;
  phase1Only?: boolean;
  hasInventory?: string;
  hasInstallCapability?: string;
  search?: string;
  limit?: number;
}

export default function useOutboundLeads({
  filters,
  options,
}: {
  filters: UseOutboundLeadsFilters;
  options: { enable?: boolean };
}) {
  //what is this for
  // Fetch leads
  // const { data, isLoading, refetch } = api.crm.getLeads.useQuery({
  //   status: statusFilter as any,
  //   phase1Only: phase1Filter,
  //   hasInventory: hasInventoryFilter as any,
  //   hasInstallCapability: hasInstallFilter as any,
  //   search: searchQuery || undefined,
  //   limit: 200,
  // }, {
  //   enabled: activeTab === 'pipeline',
  // });

  function refetch() {}
  return {
    isLoading: false,
    refetch: refetch(),
    data: {
      leads: fakeLeads,
    },
  };
}
