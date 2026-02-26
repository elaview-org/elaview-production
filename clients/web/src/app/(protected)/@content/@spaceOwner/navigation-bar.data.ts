import {
  IconBuildingStore,
  IconCalendar,
  IconCalendarEvent,
  IconChartBar,
  IconContract,
  IconCookie,
  IconCurrencyDollar,
  IconDashboard,
  IconHelp,
} from "@tabler/icons-react";

const spaceOwnerData = {
  title: "Space Owner",
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
      title: "Bookings",
      url: "/bookings",
      icon: IconCalendarEvent,
    },
    {
      title: "Earnings",
      url: "/earnings",
      icon: IconCurrencyDollar,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: IconCalendar,
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
