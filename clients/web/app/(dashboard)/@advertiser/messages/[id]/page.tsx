import { getConversationsQuery, getMessagesQuery } from "./messages-queries";
import MessagesClient from "./messages-client";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function MessagesPage({ params }: PageProps) {
  const { id: bookingId } = await params;

  // Fetch data in parallel
  const [{ conversations }, { messages, threadContext }] = await Promise.all([
    getConversationsQuery(),
    getMessagesQuery(bookingId),
  ]);

  return (
    <MessagesClient
      conversations={conversations}
      initialMessages={messages}
      initialThreadContext={threadContext}
      bookingId={bookingId}
    />
  );
}
