import RecentActivity, { type ActivityData } from "./recent-activity";
import mock from "./mock.json";

export default function Page() {
  return <RecentActivity data={mock as ActivityData[]} />;
}
