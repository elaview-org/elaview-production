// TODO: Replace mock data with real API call once the backend implements
// reach/impressions analytics (e.g. a `campaignReachAnalytics` query that returns
// weekly reach and impression counts for the current advertiser's campaigns).
import ReachChart from "./reach-chart";
import mock from "./mock.json";

export default function Page() {
  return <ReachChart data={mock.reachTrend} />;
}
