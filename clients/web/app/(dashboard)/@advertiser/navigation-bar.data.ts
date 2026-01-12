import {
  IconClipboardText,
  IconContract,
  IconCookie,
  IconDashboard,
  IconHelp,
  IconMessage,
  IconPlus,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

const advertiserData = {
  quickAction: {
    title: "New Campaign",
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
      title: "Discover",
      url: "/discover",
      icon: IconSearch,
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: IconClipboardText,
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

export default advertiserData;
