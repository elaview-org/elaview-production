export default function useLeadStats() {
  // Fetch stats
  // const { data: stats } = api.crm.getLeadStats.useQuery(undefined, {
  //   enabled: activeTab === "pipeline",
  // });

  return {
    stats: {
      total: 150,
      phase1Qualified: 75,
      hotLeads: 30,
      contacted: 60,
      demoScheduled: 25,
      byStatus: {
        CONTACTED: 60,
        DEMO_SCHEDULED: 35,
      },
    },
  };
}
