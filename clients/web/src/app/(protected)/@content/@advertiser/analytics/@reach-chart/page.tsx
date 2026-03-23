import api from "@/api/server";
import { gql } from "@apollo/client";
import ReachChart from "./reach-chart";

type ReachTrendData = {
  advertiserReachTrend: Array<{ date: string; reach: number; impressions: number }>;
};
type ReachTrendVars = { startDate: string; endDate: string };

const AdvertiserReachTrendQuery = gql`
  query AdvertiserReachTrend($startDate: DateTime!, $endDate: DateTime!) {
    advertiserReachTrend(startDate: $startDate, endDate: $endDate) {
      date
      reach
      impressions
    }
  }
`;

export default async function Page() {
  const endDate = new Date().toISOString();
  const startDate = new Date(
    Date.now() - 90 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data } = await api.query<ReachTrendData, ReachTrendVars>({
    query: AdvertiserReachTrendQuery,
    variables: { startDate, endDate },
    tags: ["reach-trend"],
    revalidate: 300,
  });

  const reachTrend = (data?.advertiserReachTrend ?? []).map((point) => ({
    date: new Date(point.date).toISOString().split("T")[0],
    reach: Number(point.reach),
    impressions: Number(point.impressions),
  }));

  return <ReachChart data={reachTrend} />;
}
