import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { spacing, fontSize, colors } from "@/constants/theme";
import { formatDistanceToNow } from "date-fns";

/**
 * Shape of a conversation node from the myConversations GraphQL query.
 */
export interface ConversationListItem {
  id: string;
  bookingId?: string | null;
  updatedAt: string;
  booking?: {
    id: string;
    space?: {
      title: string;
    } | null;
  } | null;
  participants: Array<{
    userId: string;
    lastReadAt?: string | null;
    user: {
      id: string;
      name: string;
      avatar?: string | null;
    };
  }>;
  /** We request messages(last:1) to get the latest message */
  messages?: {
    nodes?: Array<{
      id: string;
      content: string;
      createdAt: string;
      senderUserId: string;
    }> | null;
  } | null;
}

interface MessagesListProps {
  conversations: ConversationListItem[];
  currentUserId: string;
  loading?: boolean;
  onRefresh?: () => void;
  onConversationPress?: (conversation: ConversationListItem) => void;
  onLoadMore?: () => void;
}

function getOtherParticipant(
  conversation: ConversationListItem,
  currentUserId: string,
) {
  return conversation.participants.find((p) => p.userId !== currentUserId);
}

function getUnreadCount(
  conversation: ConversationListItem,
  currentUserId: string,
): number {
  const myParticipant = conversation.participants.find(
    (p) => p.userId === currentUserId,
  );
  if (!myParticipant?.lastReadAt) return 1; // never read = unread
  const lastMsg = conversation.messages?.nodes?.[0];
  if (!lastMsg) return 0;
  return new Date(lastMsg.createdAt) > new Date(myParticipant.lastReadAt) ? 1 : 0;
}

/**
 * MessagesList - Shared conversation list component
 * Used in both advertiser and owner Messages screens
 */
export default function MessagesList({
  conversations,
  currentUserId,
  loading,
  onRefresh,
  onConversationPress,
  onLoadMore,
}: MessagesListProps) {
  const { theme } = useTheme();

  const handlePress = (conversation: ConversationListItem) => {
    if (onConversationPress) {
      onConversationPress(conversation);
    }
  };

  const renderConversation = ({ item }: { item: ConversationListItem }) => {
    const other = getOtherParticipant(item, currentUserId);
    const unread = getUnreadCount(item, currentUserId);
    const lastMsg = item.messages?.nodes?.[0];
    const spaceTitle = item.booking?.space?.title;

    return (
      <Card onPress={() => handlePress(item)} style={styles.conversationCard}>
        <View style={styles.conversationContent}>
          <View style={styles.avatarContainer}>
            <Avatar
              source={other?.user.avatar ?? undefined}
              name={other?.user.name ?? "User"}
              size="md"
            />
            {unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unread > 9 ? "9+" : unread}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.textContainer}>
            <View style={styles.headerRow}>
              <Text
                style={[
                  styles.participantName,
                  { color: theme.text },
                  unread > 0 && styles.unreadText,
                ]}
                numberOfLines={1}
              >
                {other?.user.name ?? "Unknown"}
              </Text>
              <Text style={[styles.timestamp, { color: theme.textMuted }]}>
                {lastMsg
                  ? formatDistanceToNow(new Date(lastMsg.createdAt), {
                      addSuffix: true,
                    })
                  : ""}
              </Text>
            </View>

            {spaceTitle && (
              <Text
                style={[styles.spaceTitle, { color: theme.textSecondary }]}
                numberOfLines={1}
              >
                {spaceTitle}
              </Text>
            )}

            <Text
              style={[
                styles.lastMessage,
                { color: theme.textSecondary },
                unread > 0 && styles.unreadText,
              ]}
              numberOfLines={1}
            >
              {lastMsg?.content ?? "No messages yet"}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  if (conversations.length === 0 && !loading) {
    return (
      <EmptyState
        icon="chatbubbles-outline"
        title="No messages yet"
        subtitle="When you book a space or receive a booking request, you can message the other party here."
      />
    );
  }

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      renderItem={renderConversation}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!loading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        ) : undefined
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
  conversationCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  conversationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  unreadBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  participantName: {
    fontSize: fontSize.md,
    fontWeight: "500",
    flex: 1,
    marginRight: spacing.sm,
  },
  timestamp: {
    fontSize: fontSize.xs,
  },
  spaceTitle: {
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: fontSize.sm,
  },
  unreadText: {
    fontWeight: "600",
  },
});
