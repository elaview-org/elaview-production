import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { format, isToday, isYesterday } from "date-fns";
import api from "@/api";
import { useTheme } from "@/contexts/ThemeContext";
import { useSession } from "@/contexts/SessionContext";
import Avatar from "@/components/ui/Avatar";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

// ── Queries & Mutations ──────────────────────────────────────────────

const GET_CONVERSATION = api.gql`
  query GetConversation($id: UUID!) {
    myConversations(where: { id: { eq: $id } }) {
      nodes {
        id
        bookingId
        booking {
          id
          space {
            title
          }
        }
        participants {
          userId
          lastReadAt
          user {
            id
            name
            avatar
          }
        }
      }
    }
  }
`;

const GET_MESSAGES = api.gql`
  query GetMessages($conversationId: ID!, $first: Int, $after: String) {
    messagesByConversation(
      conversationId: $conversationId
      first: $first
      after: $after
      order: { createdAt: DESC }
    ) {
      edges {
        cursor
        node {
          id
          content
          type
          senderUserId
          senderUser {
            id
            name
            avatar
          }
          attachments
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const SEND_MESSAGE = api.gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      message {
        id
        content
        type
        senderUserId
        senderUser {
          id
          name
          avatar
        }
        attachments
        createdAt
      }
      errors {
        ... on ForbiddenError {
          message
        }
      }
    }
  }
`;

const MARK_CONVERSATION_READ = api.gql`
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
`;

const ON_MESSAGE = api.gql`
  subscription OnMessage($conversationId: ID!) {
    onMessage(conversationId: $conversationId) {
      id
      content
      type
      senderUserId
      senderUser {
        id
        name
        avatar
      }
      attachments
      createdAt
    }
  }
`;

// ── Types ────────────────────────────────────────────────────────────

interface MessageNode {
  id: string;
  content: string;
  type: string;
  senderUserId: string;
  senderUser: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  attachments?: string[] | null;
  createdAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────────

function formatMessageTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday " + format(d, "h:mm a");
  return format(d, "MMM d, h:mm a");
}

function shouldShowDateSeparator(
  current: string,
  previous: string | null,
): boolean {
  if (!previous) return true;
  const c = new Date(current).toDateString();
  const p = new Date(previous).toDateString();
  return c !== p;
}

function formatDateSeparator(dateStr: string): string {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMMM d, yyyy");
}

// ── Component ────────────────────────────────────────────────────────

export default function ConversationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { user } = useSession();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  // ── Fetch conversation metadata ──────────────────────────────────
  const { data: convData } = api.query<{ myConversations: any }>(GET_CONVERSATION, {
    variables: { id },
    skip: !id,
  });
  const conversation = convData?.myConversations?.nodes?.[0];
  const otherParticipant = conversation?.participants?.find(
    (p: any) => p.userId !== user?.id,
  );

  // ── Fetch messages (newest first, we invert the FlatList) ────────
  const {
    data: msgData,
    loading: msgLoading,
    fetchMore,
    refetch: refetchMessages,
  } = api.query<{ messagesByConversation: any }>(GET_MESSAGES, {
    variables: { conversationId: id, first: 30 },
    skip: !id,
    fetchPolicy: "cache-and-network",
  });

  const edges = msgData?.messagesByConversation?.edges ?? [];
  // Messages come DESC from server, FlatList is inverted so this is correct
  const messages: MessageNode[] = edges.map((e: any) => e.node);
  const pageInfo = msgData?.messagesByConversation?.pageInfo;

  // ── Real-time messages ───────────────────────────────────────────
  api.subscription(ON_MESSAGE, {
    variables: { conversationId: id },
    skip: !id,
    onData: ({ data: subData }: any) => {
      const newMsg = subData?.data?.onMessage;
      if (newMsg && newMsg.senderUserId !== user?.id) {
        refetchMessages();
      }
    },
  });

  // ── Mark as read on mount ────────────────────────────────────────
  const [markRead] = api.mutation(MARK_CONVERSATION_READ);
  useEffect(() => {
    if (id) {
      markRead({ variables: { input: { conversationId: id } } });
    }
  }, [id, markRead]);

  // ── Send message ─────────────────────────────────────────────────
  const [sendMessageMutation] = api.mutation(SEND_MESSAGE);

  const handleSend = useCallback(async () => {
    const text = messageText.trim();
    if (!text || sending) return;

    setSending(true);
    try {
      await sendMessageMutation({
        variables: {
          input: {
            conversationId: id,
            content: text,
          },
        },
        update: (cache, { data: mutData }: any) => {
          const sent = mutData?.sendMessage?.message;
          if (!sent) return;

          // Add the new message to the cache
          const existing = cache.readQuery({
            query: GET_MESSAGES,
            variables: { conversationId: id, first: 30 },
          }) as any;

          if (existing?.messagesByConversation) {
            cache.writeQuery({
              query: GET_MESSAGES,
              variables: { conversationId: id, first: 30 },
              data: {
                messagesByConversation: {
                  ...existing.messagesByConversation,
                  edges: [
                    { __typename: "MessagesByConversationEdge", cursor: "", node: sent },
                    ...existing.messagesByConversation.edges,
                  ],
                },
              },
            });
          }
        },
      });
      setMessageText("");
    } finally {
      setSending(false);
    }
  }, [messageText, sending, sendMessageMutation, id]);

  // ── Load older messages ──────────────────────────────────────────
  const handleLoadMore = useCallback(() => {
    if (pageInfo?.hasNextPage) {
      fetchMore({ variables: { after: pageInfo.endCursor } });
    }
  }, [fetchMore, pageInfo]);

  // ── Render a single message bubble ───────────────────────────────
  const renderMessage = ({
    item,
    index,
  }: {
    item: MessageNode;
    index: number;
  }) => {
    const isMe = item.senderUserId === user?.id;
    // Since list is inverted and sorted DESC, the "previous" message
    // (visually above) is actually the next index
    const prevMsg = index < messages.length - 1 ? messages[index + 1] : null;
    const showDate = shouldShowDateSeparator(
      item.createdAt,
      prevMsg?.createdAt ?? null,
    );

    return (
      <>
        {/* Message bubble */}
        <View
          style={[
            styles.messageRow,
            isMe ? styles.messageRowRight : styles.messageRowLeft,
          ]}
        >
          {!isMe && (
            <Avatar
              source={item.senderUser.avatar ?? undefined}
              name={item.senderUser.name}
              size="sm"
            />
          )}
          <View
            style={[
              styles.bubble,
              isMe
                ? [styles.bubbleRight, { backgroundColor: colors.primary }]
                : [
                    styles.bubbleLeft,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ],
            ]}
          >
            {!isMe && (
              <Text style={[styles.senderName, { color: colors.primary }]}>
                {item.senderUser.name}
              </Text>
            )}
            <Text
              style={[
                styles.messageText,
                { color: isMe ? colors.white : theme.text },
              ]}
            >
              {item.content}
            </Text>
            <Text
              style={[
                styles.messageTime,
                {
                  color: isMe
                    ? "rgba(255,255,255,0.7)"
                    : theme.textMuted,
                },
              ]}
            >
              {formatMessageTime(item.createdAt)}
            </Text>
          </View>
        </View>

        {/* Date separator (rendered below because list is inverted) */}
        {showDate && (
          <View style={styles.dateSeparator}>
            <View style={[styles.dateLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dateText, { color: theme.textMuted }]}>
              {formatDateSeparator(item.createdAt)}
            </Text>
            <View style={[styles.dateLine, { backgroundColor: theme.border }]} />
          </View>
        )}
      </>
    );
  };

  // ── Header ───────────────────────────────────────────────────────
  const headerTitle = otherParticipant?.user?.name ?? "Conversation";
  const headerSubtitle = conversation?.booking?.space?.title;

  // ── Loading state ────────────────────────────────────────────────
  if (msgLoading && messages.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Chat header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Avatar
          source={otherParticipant?.user?.avatar ?? undefined}
          name={headerTitle}
          size="sm"
        />
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {headerTitle}
          </Text>
          {headerSubtitle && (
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
              {headerSubtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Messages list (inverted so newest at bottom) */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.messagesList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color={theme.textMuted} />
            <Text style={[styles.emptyChatText, { color: theme.textSecondary }]}>
              Start the conversation!
            </Text>
          </View>
        }
      />

      {/* Input bar */}
      <View style={[styles.inputBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.backgroundSecondary,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor={theme.textMuted}
          multiline
          maxLength={5000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: messageText.trim()
                ? colors.primary
                : theme.backgroundSecondary,
            },
          ]}
          onPress={handleSend}
          disabled={!messageText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Ionicons
              name="send"
              size={20}
              color={messageText.trim() ? colors.white : theme.textMuted}
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: fontSize.xs,
    marginTop: 1,
  },

  // Messages
  messagesList: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  messageRowLeft: {
    justifyContent: "flex-start",
    marginRight: spacing.xxl,
  },
  messageRowRight: {
    justifyContent: "flex-end",
    marginLeft: spacing.xxl,
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  bubbleLeft: {
    borderWidth: 1,
    borderTopLeftRadius: 4,
  },
  bubbleRight: {
    borderTopRightRadius: 4,
  },
  senderName: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    marginBottom: 2,
  },
  messageText: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },

  // Date separator
  dateSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.md,
    gap: spacing.sm,
  },
  dateLine: {
    flex: 1,
    height: 1,
  },
  dateText: {
    fontSize: fontSize.xs,
    fontWeight: "500",
  },

  // Empty chat
  emptyChat: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl * 2,
    // Inverted list: flip so it appears right-side-up
    transform: [{ scaleY: -1 }],
  },
  emptyChatText: {
    fontSize: fontSize.md,
    marginTop: spacing.md,
  },

  // Input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    maxHeight: 120,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
