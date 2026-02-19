import "server-only";
import api from "@/api/server";
import { graphql } from "@/types/gql";
import assert from "node:assert";

const MessagesData = graphql(`
  query MessagesData {
    me {
      id
    }
    myConversations(first: 50, order: [{ updatedAt: DESC }]) {
      nodes {
        ...ConversationItem_ConversationFragment
      }
    }
    unreadConversationsCount
  }
`);

async function getMessages() {
  return api.query({ query: MessagesData }).then((res) => {
    assert(!!res.data?.me);
    return {
      currentUserId: res.data.me.id,
      conversations: res.data.myConversations?.nodes ?? [],
      unreadCount: res.data.unreadConversationsCount,
    };
  });
}

const ThreadData = graphql(`
  query ThreadData($conversationId: ID!) {
    me {
      id
    }
    myConversations(first: 50, order: [{ updatedAt: DESC }]) {
      nodes {
        ...ConversationItem_ConversationFragment
        ...ThreadHeader_ConversationFragment
      }
    }
    unreadConversationsCount
    messagesByConversation(
      conversationId: $conversationId
      first: 50
      order: [{ createdAt: ASC }]
    ) {
      nodes {
        ...MessageBubble_MessageFragment
      }
      pageInfo {
        hasPreviousPage
        startCursor
      }
    }
  }
`);

async function getThread(conversationId: string) {
  return api
    .query({ query: ThreadData, variables: { conversationId } })
    .then((res) => {
      assert(!!res.data?.me);
      return {
        currentUserId: res.data.me.id,
        conversations: res.data.myConversations?.nodes ?? [],
        unreadCount: res.data.unreadConversationsCount,
        messages: res.data.messagesByConversation?.nodes ?? [],
        pageInfo: res.data.messagesByConversation?.pageInfo,
      };
    });
}

Object.assign(api, { getMessages, getThread });

export default api as typeof api & {
  getMessages: typeof getMessages;
  getThread: typeof getThread;
};
