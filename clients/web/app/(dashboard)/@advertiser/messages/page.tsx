import getConversationsQuery from "./messages-queries";
import MessagesClient from "./messages-client";
import MessagesHeader from "./messages-header";

export default async function MessagesPage() {
  const { conversations } = await getConversationsQuery();

  return (
    <MessagesClient
      conversations={conversations}
      initialSelectedBookingId={undefined}
    >
      <MessagesHeader conversationCount={conversations.length} />
    </MessagesClient>
  );
}
