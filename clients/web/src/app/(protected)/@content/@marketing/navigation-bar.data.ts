import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconMailFilled,
  IconSearch,
  IconSettings,
  IconSpeakerphone,
} from "@tabler/icons-react";

const marketingData = {
  title: "Marketing",
  navMain: [
    { title: "Overview", url: "/overview", icon: IconDashboard },
    { title: "Campaigns", url: "/campaigns", icon: IconSpeakerphone },
    { title: "Analytics", url: "/analytics", icon: IconChartBar },
    { title: "Email", url: "/email", icon: IconMailFilled },
  ],
  navClouds: [],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [],
};

export default marketingData;
