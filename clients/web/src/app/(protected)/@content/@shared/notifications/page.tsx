import api from "@/api/server";
import { graphql } from "@/types/gql";
import assert from "node:assert";
import NotificationsContent from "./notifications-content";
import Placeholder from "./placeholder";
import MaybePlaceholder from "@/components/status/maybe-placeholder";

export default async function Page() {
  const data = await api
    .query({
      query: graphql(`
        query NotificationsPage {
          me {
            id
          }
          myNotifications(first: 20, order: [{ createdAt: DESC }]) {
            nodes {
              id
              title
              body
              type
              isRead
              createdAt
              readAt
              entityId
              entityType
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
          unreadNotificationsCount
        }
      `),
    })
    .then((res) => {
      assert(!!res.data?.me);
      return {
        userId: res.data.me.id,
        notifications: res.data.myNotifications?.nodes ?? [],
        pageInfo: res.data.myNotifications?.pageInfo,
        unreadCount: res.data.unreadNotificationsCount ?? 0,
      };
    });

  return (
    <MaybePlaceholder data={data.notifications} placeholder={<Placeholder />}>
      <NotificationsContent
        userId={data.userId}
        initialNotifications={data.notifications}
        initialUnreadCount={data.unreadCount}
        initialPageInfo={data.pageInfo}
      />
    </MaybePlaceholder>
  );
}
