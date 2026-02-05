import ActivityChart from "./activity-chart";
import mock from "./mock.json";

export default function Page() {
  return <ActivityChart data={mock} />;
}
