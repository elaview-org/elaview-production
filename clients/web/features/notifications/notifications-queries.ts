// import api from "@/api/gql/server";
// import { graphql } from "@/types/gql";
import type { TNotification } from "./components/mock-notification";

export default async function getNotificationsQuery(): Promise<{
  notifications: TNotification[];
}> {
  try {
    // TODO: Replace with actual GraphQL query when backend is ready
    // const { data } = await api.query({
    //   query: graphql(`
    //     query GetMyNotifications {
    //       myNotifications(first: 50, order: { createdAt: DESC }) {
    //         nodes {
    //           id
    //           title
    //           body
    //           type
    //           isRead
    //           createdAt
    //           readAt
    //           entityId
    //           entityType
    //           userId
    //           user {
    //             id
    //             email
    //             name
    //           }
    //         }
    //       }
    //     }
    //   `),
    // });

    // For now, return mock data
    // In production, this would be: return { notifications: data?.myNotifications?.nodes || [] };
    const { mockNotifications } =
      await import("./components/mock-notification");
    return { notifications: mockNotifications };
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return { notifications: [] };
  }
}
