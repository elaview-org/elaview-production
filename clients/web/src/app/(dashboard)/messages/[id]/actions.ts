"use server";

import api from "@/lib/gql/server";
import {
  graphql,
  MessageType,
  type LoadEarlierMessagesQuery,
} from "@/types/gql";
import { revalidatePath } from "next/cache";
import type { ActionState } from "@/types/actions";

const SendMessageMutation = graphql(`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      message {
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
      errors {
        ... on ForbiddenError {
          message
        }
      }
    }
  }
`);

const MarkConversationReadMutation = graphql(`
  mutation MarkConversationRead($input: MarkConversationReadInput!) {
    markConversationRead(input: $input) {
      participant {
        id
        lastReadAt
      }
      errors {
        ... on ForbiddenError {
          message
        }
      }
    }
  }
`);

type SendMessageResult = {
  messageId?: string;
};

export async function sendMessage(
  conversationId: string,
  content: string,
  attachments?: string[]
): Promise<ActionState<SendMessageResult | null>> {
  const result = await api.mutate({
    mutation: SendMessageMutation,
    variables: {
      input: {
        conversationId,
        content,
        type: MessageType.Text,
        attachments,
      },
    },
  });

  if (result.error || result.data?.sendMessage.errors?.length) {
    const errorMessage =
      result.error?.message ||
      (result.data?.sendMessage.errors?.[0] as { message?: string })?.message ||
      "Failed to send message";
    return { success: false, message: errorMessage, data: null };
  }

  revalidatePath("/messages", "layout");

  return {
    success: true,
    message: "",
    data: { messageId: result.data?.sendMessage.message?.id },
  };
}

export async function markConversationRead(
  conversationId: string
): Promise<ActionState<null>> {
  const result = await api.mutate({
    mutation: MarkConversationReadMutation,
    variables: {
      input: { conversationId },
    },
  });

  if (result.error || result.data?.markConversationRead.errors?.length) {
    const errorMessage =
      result.error?.message ||
      (result.data?.markConversationRead.errors?.[0] as { message?: string })
        ?.message ||
      "Failed to mark conversation as read";
    return { success: false, message: errorMessage, data: null };
  }

  revalidatePath("/messages", "layout");

  return { success: true, message: "", data: null };
}

const LoadEarlierMessagesQuery = graphql(`
  query LoadEarlierMessages($conversationId: ID!, $before: String) {
    messagesByConversation(
      conversationId: $conversationId
      last: 50
      before: $before
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
        hasPreviousPage
        startCursor
      }
    }
  }
`);

type LoadEarlierMessagesResult = {
  messages: NonNullable<
    NonNullable<LoadEarlierMessagesQuery["messagesByConversation"]>["nodes"]
  >;
  pageInfo: NonNullable<
    LoadEarlierMessagesQuery["messagesByConversation"]
  >["pageInfo"];
};

export async function loadEarlierMessages(
  conversationId: string,
  before?: string
): Promise<ActionState<LoadEarlierMessagesResult | null>> {
  const result = await api.query({
    query: LoadEarlierMessagesQuery,
    variables: {
      conversationId,
      before,
    },
  });

  if (result.error || !result.data?.messagesByConversation) {
    return {
      success: false,
      message: result.error?.message ?? "Failed to load messages",
      data: null,
    };
  }

  return {
    success: true,
    message: "",
    data: {
      messages: result.data.messagesByConversation.nodes ?? [],
      pageInfo: result.data.messagesByConversation.pageInfo,
    },
  };
}
