import {
  IconBriefcase,
  IconBuilding,
  IconClock,
  IconMessageCircle,
  IconShieldCheck,
  IconWorld,
} from "@tabler/icons-react";
import mock from "./mock.json";

export default function AboutSection() {
  const { user, responseRate, responseTime, campaigns } = mock;
  const profile = user.advertiserProfile;
  const completedCampaigns = campaigns.filter((c) => c.status === "COMPLETED");

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-3xl font-semibold">About {user.name}</h1>

      <div className="flex flex-col gap-3">
        {profile.industry && (
          <div className="flex items-center gap-3">
            <IconBriefcase className="text-muted-foreground size-5" />
            <span>Industry: {profile.industry}</span>
          </div>
        )}

        {profile.companyName && (
          <div className="flex items-center gap-3">
            <IconBuilding className="text-muted-foreground size-5" />
            <span>{profile.companyName}</span>
          </div>
        )}

        {profile.website && (
          <div className="flex items-center gap-3">
            <IconWorld className="text-muted-foreground size-5" />
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {profile.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}

        <div className="flex items-center gap-3">
          <IconShieldCheck className="text-muted-foreground size-5" />
          <span className={profile.onboardingComplete ? "underline" : ""}>
            {profile.onboardingComplete
              ? "Identity verified"
              : "Identity not verified"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <IconMessageCircle className="text-muted-foreground size-5" />
          <span>Response rate: {responseRate}%</span>
        </div>

        <div className="flex items-center gap-3">
          <IconClock className="text-muted-foreground size-5" />
          <span>Responds {responseTime}</span>
        </div>
      </div>

      {completedCampaigns.length > 0 && (
        <p className="text-muted-foreground">
          Completed {completedCampaigns.length} advertising{" "}
          {completedCampaigns.length === 1 ? "campaign" : "campaigns"}.
        </p>
      )}
    </div>
  );
}
