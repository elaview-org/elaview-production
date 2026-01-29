// import api from "@/api/gql/server";
// import { graphql } from "@/types/gql";

import type { Conversation } from "@/types/messages";

export default async function getConversationsQuery(): Promise<{
  conversations: Conversation[];
}> {
  try {
    // TODO: Replace with actual GraphQL query when backend is ready
    // const { data } = await api.query({
    //   query: graphql(`
    //     query GetMyConversations {
    //       myConversations {
    //         bookingId
    //         spaceName
    //         bookingStatus
    //         unreadCount
    //         updatedAt
    //         lastMessage {
    //           id
    //           content
    //           sender
    //           createdAt
    //         }
    //       }
    //     }
    //   `),
    // });

    // For now, return mock data
    // In production, this would be: return { conversations: data?.myConversations || [] };
    const { mockConversations } =
      await import("@/features/conversations/mock-data");
    return { conversations: mockConversations };
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return { conversations: [] };
  }
}
