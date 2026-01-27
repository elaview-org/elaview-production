import { getConversationsQuery, getMessagesQuery } from "./messages-queries";
import DisplayMessages from "./display-messages";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id: bookingId } = await params;

  const [{ conversations }, { messages, threadContext }] = await Promise.all([
    getConversationsQuery(),
    getMessagesQuery(bookingId),
  ]);

  return (
    <DisplayMessages
      conversations={conversations}
      initialMessages={messages}
      initialThreadContext={threadContext}
      bookingId={bookingId}
    />
  );
}
