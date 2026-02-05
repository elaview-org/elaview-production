import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";
import assert from "node:assert";
import MessagesHeader from "./messages-header";
import ConversationList from "./conversation-list";
import Placeholder from "./placeholder";
import { WelcomeChat } from "./welcome-chat";
import MaybePlaceholder from "@/components/status/maybe-placeholder";

export default async function Page() {
  const data = await api
    .query({
      query: graphql(`
        query MessagesData {
          me {
            id
          }
          myConversations(first: 50, order: [{ updatedAt: DESC }]) {
            nodes {
              id
              updatedAt
              booking {
                id
                status
                space {
                  id
                  title
                }
              }
              participants {
                user {
                  id
                  name
                  avatar
                }
                lastReadAt
              }
              messages(first: 1, order: [{ createdAt: DESC }]) {
                nodes {
                  id
                  content
                  type
                  createdAt
                  senderUser {
                    id
                  }
                }
              }
            }
          }
          unreadConversationsCount
        }
      `),
    })
    .then((res) => {
      assert(!!res.data?.me);
      return res.data;
    });

  const conversations = data.myConversations?.nodes ?? [];
  const currentUserId = data.me!.id;

  return (
    <div className="flex h-full overflow-hidden">
      <div className="bg-background flex w-full flex-col border-r md:max-w-sm">
        <MessagesHeader
          conversationCount={conversations.length}
          unreadCount={data.unreadConversationsCount}
        />
        <MaybePlaceholder data={conversations} placeholder={<Placeholder />}>
          <ConversationList
            conversations={conversations}
            currentUserId={currentUserId}
          />
        </MaybePlaceholder>
      </div>
      <WelcomeChat className="hidden md:flex" />
    </div>
  );
}
