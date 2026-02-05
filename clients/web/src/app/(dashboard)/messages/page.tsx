import api from "./api";
import MessagesContent from "./messages-content";
import { WelcomeChat } from "./welcome-chat";

export default async function Page() {
  const { conversations, currentUserId, unreadCount } = await api.getMessages();

  return (
    <div className="flex h-full overflow-hidden">
      <div className="bg-background flex w-full flex-col border-r md:max-w-sm">
        <MessagesContent
          conversations={conversations}
          currentUserId={currentUserId}
          unreadCount={unreadCount}
        />
      </div>
      <WelcomeChat className="hidden md:flex" />
    </div>
  );
}
