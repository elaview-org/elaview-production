import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";
import assert from "node:assert";
import { notFound } from "next/navigation";
import MessagesHeader from "../messages-header";
import ConversationList from "../conversation-list";
import ThreadHeader from "./thread-header";
import MessageThread from "./message-thread";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id: conversationId } = await params;

  const data = await api
    .query({
      query: graphql(`
        query ThreadData($conversationId: ID!) {
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
          messagesByConversation(
            conversationId: $conversationId
            first: 100
            order: [{ createdAt: ASC }]
          ) {
            nodes {
              id
              content
              type
              attachments
              createdAt
              senderUser {
                id
                name
                avatar
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `),
      variables: { conversationId },
    })
    .then((res) => {
      assert(!!res.data?.me);
      return res.data;
    });

  const currentUserId = data.me!.id;
  const conversations = data.myConversations?.nodes ?? [];
  const currentConversation = conversations.find((c) => c.id === conversationId);

  if (!currentConversation) {
    notFound();
  }

  const messages = data.messagesByConversation?.nodes ?? [];

  return (
    <div className="flex h-full overflow-hidden">
      <div className="bg-background hidden w-full flex-col border-r md:flex md:max-w-sm">
        <MessagesHeader conversationCount={conversations.length} />
        <ConversationList
          conversations={conversations}
          selectedConversationId={conversationId}
          currentUserId={currentUserId}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <ThreadHeader conversation={currentConversation} showBackButton />
        <MessageThread
          conversation={currentConversation}
          messages={messages}
          currentUserId={currentUserId}
          conversationId={conversationId}
        />
      </div>
    </div>
  );
}
