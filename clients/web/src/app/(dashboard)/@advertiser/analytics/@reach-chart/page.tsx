import ReachChart from "./reach-chart";
import mock from "./mock.json";

export default function Page() {
  return <ReachChart data={mock.reachTrend} />;
}
