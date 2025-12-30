"use client";

import CampaingsCard from "../../organisms/CampaingCard";

function CampaignsList({
  filteredCampaigns,
  getCampaignStats,
  bookings,
  expandedCampaigns,
  toggleExpanded,
}) {
  return (
    <div className="space-y-4">
      {filteredCampaigns.map((campaign) => {
        const stats = getCampaignStats(campaign.id);
        const campaignBookings = bookings?.filter((b) => b.campaignId === campaign.id) || [];
        const isExpanded = expandedCampaigns.has(campaign.id);

        return (
          <CampaingsCard
            key={campaign.id}
            campaign={campaign}
            stats={stats}
            toggleExpanded={toggleExpanded}
            campaignBookings={campaignBookings}
            isExpanded={isExpanded}
          />
        );
      })}
    </div>
  );
}

export default CampaignsList;
