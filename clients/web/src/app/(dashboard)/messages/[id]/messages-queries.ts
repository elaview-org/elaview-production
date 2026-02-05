import type {
  Conversation,
  Message,
  ThreadContext,
} from "@/types/messages";

/**
 * Fetches all conversations for the current user
 */
export async function getConversationsQuery(): Promise<{
  conversations: Conversation[];
}> {
  try {
    // TODO: Replace with actual GraphQL query when backend is ready
    const { mockConversations } =
      await import("@/app/(dashboard)/messages/mock-data");
    return { conversations: mockConversations };
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return { conversations: [] };
  }
}

/**
 * Fetches messages for a specific booking
 */
export async function getMessagesQuery(bookingId: string): Promise<{
  messages: Message[];
  threadContext: ThreadContext | null;
}> {
  try {
    // TODO: Replace with actual GraphQL query when backend is ready
    // const { data } = await api.query({
    //   query: graphql(`
    //     query GetMessages($bookingId: ID!) {
    //       messages(bookingId: $bookingId) {
    //         id
    //         content
    //         sender
    //         type
    //         createdAt
    //         attachments {
    //           id
    //           fileName
    //           fileUrl
    //         }
    //       }
    //       booking(id: $bookingId) {
    //         id
    //         space {
    //           id
    //           title
    //         }
    //         status
    //       }
    //     }
    //   `),
    //   variables: { bookingId },
    // });

    // For now, return mock data
    const { mockMessages, mockConversations } =
      await import("@/app/(dashboard)/messages/mock-data");

    const bookingMessages = mockMessages.filter(
      (msg) => msg.bookingId === bookingId
    );

    const conversation = mockConversations.find(
      (conv) => conv.bookingId === bookingId
    );

    const threadContext: ThreadContext | null = conversation
      ? {
          bookingId: conversation.bookingId,
          spaceName: conversation.spaceName,
          bookingStatus: conversation.bookingStatus,
          spaceId: "space-456", // In real app, fetch from booking
        }
      : null;

    return { messages: bookingMessages, threadContext };
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return { messages: [], threadContext: null };
  }
}
