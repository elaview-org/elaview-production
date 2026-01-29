import getConversationsQuery from "../../../../features/conversations/messages-queries";
import MessagesClient from "../../../../features/conversations/components/messages-client";

export default async function Page() {
  const { conversations } = await getConversationsQuery();

  return <MessagesClient conversations={conversations} />;
}
