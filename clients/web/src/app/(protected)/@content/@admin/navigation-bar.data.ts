import {
  IconBriefcase,
  IconBuilding,
  IconCalendarEvent,
  IconDashboard,
  IconHelp,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

const adminData = {
  title: "Administrator",
  navMain: [
    { title: "Overview", url: "/overview", icon: IconDashboard },
    { title: "Users", url: "/users", icon: IconUsers },
    { title: "Spaces", url: "/spaces", icon: IconBuilding },
    { title: "Bookings", url: "/bookings", icon: IconCalendarEvent },
    { title: "Careers", url: "/postings", icon: IconBriefcase },
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

export default adminData;
