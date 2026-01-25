import {
  IconClipboardText,
  IconContract,
  IconCookie,
  IconDashboard,
  IconHelp,
  IconMessage,
  IconSearch,
} from "@tabler/icons-react";

const advertiserData = {
  title: "Advertiser",
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
