import { graphql } from "@/types/gql";
import api from "../api";
import RecentActivity from "./recent-activity";

const OverviewRecentActivity_QueryFragment = graphql(`
  fragment OverviewRecentActivity_QueryFragment on Query {
    myNotifications(first: 10, order: [{ createdAt: DESC }]) {
      nodes {
        id
        type
        title
        body
        createdAt
        isRead
      }
    }
  }
`);

export default async function Page() {
  const notifications = await api
    .getMyOverview(OverviewRecentActivity_QueryFragment)
    .then((res) => res.myNotifications?.nodes ?? []);

  return <RecentActivity data={notifications} />;
}
