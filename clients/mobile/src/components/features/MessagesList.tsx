import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { spacing, fontSize, colors } from "@/constants/theme";
import { Conversation, formatMessageTime } from "@/mocks/messages";

interface MessagesListProps {
  conversations: Conversation[];
  onConversationPress?: (conversation: Conversation) => void;
}

/**
 * MessagesList - Shared conversation list component
 * Used in both advertiser and owner Messages screens
 */
export default function MessagesList({
  conversations,
  onConversationPress,
}: MessagesListProps) {
  const { theme } = useTheme();
  const router = useRouter();

  const handlePress = (conversation: Conversation) => {
    if (onConversationPress) {
      onConversationPress(conversation);
    }
    // TODO: Navigate to conversation detail
    // router.push(`/messages/${conversation.id}`);
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <Card onPress={() => handlePress(item)} style={styles.conversationCard}>
      <View style={styles.conversationContent}>
        <View style={styles.avatarContainer}>
          <Avatar
            source={item.participantAvatar}
            name={item.participantName}
            size="md"
          />
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {item.unreadCount > 9 ? "9+" : item.unreadCount}
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
                item.unreadCount > 0 && styles.unreadText,
              ]}
              numberOfLines={1}
            >
              {item.participantName}
            </Text>
            <Text style={[styles.timestamp, { color: theme.textMuted }]}>
              {formatMessageTime(item.lastMessageTime)}
            </Text>
          </View>

          {item.spaceTitle && (
            <Text
              style={[styles.spaceTitle, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {item.spaceTitle}
            </Text>
          )}

          <Text
            style={[
              styles.lastMessage,
              { color: theme.textSecondary },
              item.unreadCount > 0 && styles.unreadText,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
        </View>
      </View>
    </Card>
  );

  if (conversations.length === 0) {
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
