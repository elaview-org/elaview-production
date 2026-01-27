import getConversationsQuery from "./messages-queries";
import MessagesHeader from "./messages-header";
import InboxPanel from "@/app/(dashboard)/@advertiser/messages/inbox-panel";
import { WelcomeChat } from "./welcome-chat";

export default async function Page() {
  const { conversations } = await getConversationsQuery();

  return (
    <div className="flex h-full overflow-hidden">
      <InboxPanel
        conversations={conversations}
        initialSelectedBookingId={undefined}
      >
        <MessagesHeader conversationCount={conversations.length} />
      </InboxPanel>
      <WelcomeChat />
    </div>
  );
}
