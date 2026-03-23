import Link from "next/link";
import {
  IconBriefcase,
  IconBuilding,
  IconCalendarEvent,
  IconChevronRight,
  IconUsers,
} from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { SummaryCardGrid } from "@/components/composed/summary-card";
import { CardAction, CardFooter } from "@/components/primitives/card";
import api from "@/api/server";
import { graphql } from "@/types/gql";

const PlatformStatsQuery = graphql(`
  query PlatformStats {
    platformStats {
      totalUsers
      totalActiveSpaces
      totalBookings
      totalRevenue
      totalCampaigns
      totalSpaceOwners
      totalAdvertisers
      newUsersLast30Days
    }
  }
`);

const ADMIN_SECTIONS = [
  {
    title: "Users",
    description: "Manage user accounts, roles, and permissions.",
    href: "/users",
    icon: IconUsers,
    status: "coming-soon" as const,
  },
  {
    title: "Spaces",
    description: "Review and moderate listed ad spaces.",
    href: "/spaces",
    icon: IconBuilding,
    status: "coming-soon" as const,
  },
  {
    title: "Bookings",
    description: "Monitor active bookings and resolve disputes.",
    href: "/bookings",
    icon: IconCalendarEvent,
    status: "coming-soon" as const,
  },
  {
    title: "Careers",
    description: "Post and manage open job positions.",
    href: "/careers",
    icon: IconBriefcase,
    status: "active" as const,
  },
];

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function Page() {
  const { data } = await api.query({
    query: PlatformStatsQuery,
    tags: ["admin-stats"],
    revalidate: 60,
  });

  const stats = data?.platformStats;

  const PLATFORM_STATS = [
    {
      label: "Total Users",
      value: stats ? formatNumber(stats.totalUsers) : "—",
      footer: stats
        ? `+${formatNumber(stats.newUsersLast30Days)} last 30 days`
        : "Loading...",
      description: `${formatNumber(stats?.totalSpaceOwners ?? 0)} owners · ${formatNumber(stats?.totalAdvertisers ?? 0)} advertisers`,
    },
    {
      label: "Active Spaces",
      value: stats ? formatNumber(stats.totalActiveSpaces) : "—",
      footer: "Currently listed and active",
      description: "Spaces available for booking",
    },
    {
      label: "Total Bookings",
      value: stats ? formatNumber(stats.totalBookings) : "—",
      footer: `${formatNumber(stats?.totalCampaigns ?? 0)} campaigns`,
      description: "All-time bookings across platform",
    },
    {
      label: "Platform Revenue",
      value: stats ? formatCurrency(stats.totalRevenue) : "—",
      footer: "Total successful payments",
      description: "All-time revenue from payments",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Platform-wide management and monitoring.
        </p>
      </div>

      {/* Stats */}
      <SummaryCardGrid>
        {PLATFORM_STATS.map((stat) => (
          <Card key={stat.label} className="@container/card">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stat.value}
              </CardTitle>
              <CardAction />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 font-medium">{stat.footer}</div>
              <div className="text-muted-foreground">{stat.description}</div>
            </CardFooter>
          </Card>
        ))}
      </SummaryCardGrid>

      {/* Quick access */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Admin sections</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADMIN_SECTIONS.map((section) => (
            <Card
              key={section.title}
              className={section.status === "coming-soon" ? "opacity-60" : ""}
            >
              <CardContent className="flex flex-col gap-4 pt-6">
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                  <section.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-semibold">{section.title}</h3>
                    {section.status === "coming-soon" && (
                      <span className="text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 text-xs">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {section.description}
                  </p>
                </div>
                {section.status === "active" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href={section.href}>
                      Manage
                      <IconChevronRight className="ml-auto size-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled
                  >
                    Coming soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
