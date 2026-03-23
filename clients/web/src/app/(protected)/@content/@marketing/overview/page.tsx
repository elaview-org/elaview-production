import Link from "next/link";
import {
  IconChartBar,
  IconMailFilled,
  IconSpeakerphone,
  IconChevronRight,
} from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import { Card, CardContent } from "@/components/primitives/card";
import { SummaryCardGrid } from "@/components/composed/summary-card";
import {
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import api from "@/api/server";
import { graphql } from "@/types/gql";

const MarketingStatsQuery = graphql(`
  query MarketingStats {
    marketingStats {
      newSignups30d
      conversionRate
      activeCampaigns
      totalAdSpend30d
      totalCompletedBookings30d
      signupTrend {
        date
        count
      }
    }
  }
`);

const MARKETING_SECTIONS = [
  {
    title: "Campaigns",
    description: "Track active marketing campaigns and performance.",
    href: "/campaigns",
    icon: IconSpeakerphone,
  },
  {
    title: "Analytics",
    description: "Platform traffic, acquisition, and conversion metrics.",
    href: "/analytics",
    icon: IconChartBar,
  },
  {
    title: "Email",
    description: "Manage email campaigns and subscriber lists.",
    href: "/email",
    icon: IconMailFilled,
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

function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}

export default async function Page() {
  const { data } = await api.query({
    query: MarketingStatsQuery,
    tags: ["marketing-stats"],
    revalidate: 60,
  });

  const stats = data?.marketingStats;

  const MARKETING_STATS = [
    {
      label: "New Sign-ups (30d)",
      value: stats ? formatNumber(stats.newSignups30d) : "—",
      footer: stats
        ? `${formatNumber(stats.totalCompletedBookings30d)} completed bookings`
        : "Loading...",
      description: "New user registrations in the last 30 days",
    },
    {
      label: "Conversion Rate",
      value: stats ? formatPercent(stats.conversionRate) : "—",
      footer: "Visitor → registered user",
      description: "Percentage of visitors who sign up",
    },
    {
      label: "Active Campaigns",
      value: stats ? formatNumber(stats.activeCampaigns) : "—",
      footer: "Currently running campaigns",
      description: "Bookings in active state across the platform",
    },
    {
      label: "Total Ad Spend (30d)",
      value: stats ? formatCurrency(stats.totalAdSpend30d) : "—",
      footer: "Last 30 days",
      description: "Advertiser spending across platform",
    },
  ];
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Marketing Overview
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Growth, acquisition, and campaign performance.
        </p>
      </div>

      {/* Stats */}
      <SummaryCardGrid>
        {MARKETING_STATS.map((stat) => (
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

      {/* Sections */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Marketing tools</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {MARKETING_SECTIONS.map((section) => (
            <Card key={section.title} className="opacity-60">
              <CardContent className="flex flex-col gap-4 pt-6">
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                  <section.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold">{section.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {section.description}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Coming soon
                  <IconChevronRight className="ml-auto size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="bg-muted rounded-lg p-4">
        <p className="text-muted-foreground text-sm">
          Marketing tools are under development. Platform analytics, campaign
          management, and email tooling will be available in a future release.
        </p>
        <Button
          variant="link"
          size="sm"
          className="mt-1 h-auto p-0 text-sm"
          asChild
        >
          <Link href="/settings">Go to settings</Link>
        </Button>
      </div>
    </div>
  );
}
