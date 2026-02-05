import getConversationsQuery from "./messages-queries";
import MessagesClient from "./messages-client";

export default async function Page() {
  const { conversations } = await getConversationsQuery();

  return <MessagesClient conversations={conversations} />;
}
