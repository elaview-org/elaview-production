import {
  IconChartBar,
  IconHelp,
  IconListDetails,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

const advertiserData = {
  navMain: [
    {
      title: "Discover",
      url: "/discover",
      icon: IconListDetails,
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: IconChartBar,
    },
    {
      title: "Alerts",
      url: "/alerts",
      icon: IconChartBar,
    },
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

export default advertiserData;
