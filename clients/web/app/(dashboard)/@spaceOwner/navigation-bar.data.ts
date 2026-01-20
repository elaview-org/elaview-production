import {
  IconBuildingStore,
  IconContract,
  IconCookie,
  IconDashboard,
  IconHelp,
  IconMessage,
  IconPlus,
  IconSettings,
  IconShieldCheck,
  IconWallet,
} from "@tabler/icons-react";

const spaceOwnerData = {
  quickAction: {
    title: "New Space",
    url: "#",
    icon: IconPlus,
  },
  navMain: [
    {
      title: "Overview",
      url: "/overview",
      icon: IconDashboard,
    },
    {
      title: "Listings",
      url: "/listings",
      icon: IconBuildingStore,
    },
    {
      title: "Earnings",
      url: "/earnings",
      icon: IconWallet,
    },
    {
      title: "Verification Flow",
      url: "/verification-flow",
      icon: IconShieldCheck,
    },
    {
      title: "Messages",
      url: "/messages",
      icon: IconMessage,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
  documents: [],
  navSecondary: [
    {
      title: "Help & Support",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Terms of Service",
      url: "/terms-of-service",
      icon: IconContract,
    },
    {
      title: "Privacy Policy",
      url: "/privacy-policy",
      icon: IconCookie,
    },
  ],
  navClouds: [],
};

export default spaceOwnerData;
