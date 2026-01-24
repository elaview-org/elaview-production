import {
  IconBuildingStore,
  IconCalendar,
  IconCalendarEvent,
  IconCamera,
  IconChartBar,
  IconContract,
  IconCookie,
  IconCurrencyDollar,
  IconDashboard,
  IconFileText,
  IconHammer,
  IconHelp,
  IconMessage,
  IconQuestionMark,
  IconReceipt,
} from "@tabler/icons-react";

const spaceOwnerData = {
  quickAction: {
    title: "Messages",
    url: "/messages",
    icon: IconMessage,
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
  documents: [
    {
      name: "Installation Guide",
      url: "/documents/installation-guide",
      icon: IconHammer,
    },
    {
      name: "Verification Guide",
      url: "/documents/verification-guide",
      icon: IconCamera,
    },
    {
      name: "Payout FAQ",
      url: "/documents/payout-faq",
      icon: IconQuestionMark,
    },
    {
      name: "Tax Documents",
      url: "/documents/tax-documents",
      icon: IconReceipt,
    },
    {
      name: "Platform Terms",
      url: "/documents/platform-terms",
      icon: IconFileText,
    },
  ],
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
