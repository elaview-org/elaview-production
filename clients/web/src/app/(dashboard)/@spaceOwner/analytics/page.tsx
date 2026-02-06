import { connection } from "next/server";
import { subDays } from "date-fns";
import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";
import SummaryCards from "./summary-cards";
import BookingsChart from "./bookings-chart";
import StatusChart from "./status-chart";
import RevenueChart from "./revenue-chart";
import MonthlyChart from "./monthly-chart";
import RatingChart from "./rating-chart";
import HeatmapChart from "./heatmap-chart";
import ComparisonCard from "./comparison-card";
import TopPerformers from "./top-performers";
import PerformanceTable from "./performance-table";

const SpaceOwnerAnalyticsQuery = graphql(`
  query SpaceOwnerAnalyticsPage($startDate: DateTime!, $endDate: DateTime!) {
    spaceOwnerAnalytics(startDate: $startDate, endDate: $endDate) {
      summary {
        totalBookings
        previousTotalBookings
        totalRevenue
        previousTotalRevenue
        averageRating
        completionRate
        avgBookingDuration
        previousAvgBookingDuration
        occupancyRate
        previousOccupancyRate
        repeatAdvertiserRate
        previousRepeatAdvertiserRate
        forecastedRevenue
      }
      statusDistribution {
        status
        count
      }
      spacePerformance(first: 10) {
        id
        title
        image
        totalBookings
        totalRevenue
        averageRating
        occupancyRate
      }
      monthlyStats(months: 12) {
        month
        revenue
        bookings
      }
      ratingTrends(months: 12) {
        month
        rating
        reviews
      }
      bookingHeatmap
      periodComparison {
        current {
          period
          startDate
          endDate
          bookings
          revenue
          avgRating
          completionRate
        }
        previous {
          period
          startDate
          endDate
          bookings
          revenue
          avgRating
          completionRate
        }
      }
      topPerformers {
        bestRevenue {
          id
          title
          value
          change
        }
        bestRating {
          id
          title
          value
          reviews
        }
        bestOccupancy {
          id
          title
          value
          change
        }
        mostBookings {
          id
          title
          value
          change
        }
        needsAttention {
          id
          title
          occupancy
          bookings
        }
      }
    }
    spaceOwnerDailyStats(startDate: $startDate, endDate: $endDate) {
      date
      bookings
    }
  }
`);

export default async function Page() {
  await connection();

  const endDate = new Date();
  const startDate = subDays(endDate, 90);

  const data = await api
    .query({
      query: SpaceOwnerAnalyticsQuery,
      variables: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    })
    .then((res) => res.data);

  const { spaceOwnerAnalytics, spaceOwnerDailyStats } = data!;

  const heatmapData = spaceOwnerAnalytics.bookingHeatmap.flatMap(
    (dayData, day) =>
      dayData.map((count, hour) => ({ day, hour: hour + 9, count }))
  );

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards data={spaceOwnerAnalytics.summary} />

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <BookingsChart data={spaceOwnerDailyStats} />
        <StatusChart data={spaceOwnerAnalytics.statusDistribution} />
      </div>

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <MonthlyChart data={spaceOwnerAnalytics.monthlyStats} />
        <RatingChart data={spaceOwnerAnalytics.ratingTrends} />
      </div>

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <HeatmapChart data={heatmapData} />
        <ComparisonCard data={spaceOwnerAnalytics.periodComparison} />
      </div>

      <TopPerformers data={spaceOwnerAnalytics.topPerformers} />
      <RevenueChart data={spaceOwnerAnalytics.spacePerformance} />
      <PerformanceTable data={spaceOwnerAnalytics.spacePerformance} />
    </div>
  );
}
