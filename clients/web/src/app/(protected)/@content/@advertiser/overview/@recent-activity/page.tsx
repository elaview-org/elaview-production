import { graphql } from "@/types/gql";
import api from "../api";
import RecentActivity from "./recent-activity";

const AdvertiserOverviewRecentActivity_QueryFragment = graphql(`
  fragment AdvertiserOverviewRecentActivity_QueryFragment on Query {
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
    .getAdvertiserOverview(AdvertiserOverviewRecentActivity_QueryFragment)
    .then((res) => res.myNotifications?.nodes ?? []);

  return <RecentActivity data={notifications} />;
}
