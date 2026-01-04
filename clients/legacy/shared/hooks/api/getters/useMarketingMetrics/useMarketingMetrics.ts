export default function useMarketingMetrics() {
  // const { data: metrics, isLoading } = api.admin.marketing.getMarketingMetrics.useQuery();
  return {
    metrics: {
      totalUsers: 1837,
      newUsersThisWeek: 37,
      totalDemoRequests: 312,
      newDemoRequestsThisWeek: 8,
      activeCampaigns: 19,
      conversionRate: 11.5,
      totalAdvertisers: 12,
      totalSpaceOwners: 13,
      newUsersThisMonth: 12,
    },
    isLoading: false,
  };
}
