import { graphql } from "@/types/gql";
import api from "../api";
import HeatmapChart from "./heatmap-chart";

const AnalyticsHeatmapChart_QueryFragment = graphql(`
  fragment AnalyticsHeatmapChart_QueryFragment on Query {
    spaceOwnerAnalytics(startDate: $startDate, endDate: $endDate) {
      bookingHeatmap
    }
  }
`);

export default async function Page() {
  const bookingHeatmap = await api
    .getAnalytics(AnalyticsHeatmapChart_QueryFragment)
    .then((res) => res.spaceOwnerAnalytics.bookingHeatmap);

  const heatmapData = bookingHeatmap.flatMap((dayData, day) =>
    dayData.map((count, hour) => ({ day, hour: hour + 9, count }))
  );

  return <HeatmapChart data={heatmapData} />;
}
