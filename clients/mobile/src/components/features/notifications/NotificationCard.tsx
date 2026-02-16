import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { NotificationType } from "@/types/graphql";
import { NotificationNode } from "@/types/notifications";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface NotificationCardProps {
  notification: NotificationNode;
  onPress?: (notification: NotificationNode) => void;
}

// Map notification types to icons and colors
function getNotificationIcon(type: NotificationType): {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
} {
  switch (type) {
    case NotificationType.BookingRequested:
      return {
        name: "calendar",
        color: colors.primary,
        backgroundColor: colors.primaryLight,
      };

    case NotificationType.BookingApproved:
      return {
        name: "checkmark-circle",
        color: colors.success,
        backgroundColor: "#E8F5E9",
      };

    case NotificationType.BookingRejected:
      return {
        name: "close-circle",
        color: colors.error,
        backgroundColor: "#FFEBEE",
      };

    case NotificationType.BookingCancelled:
      return {
        name: "ban",
        color: colors.error,
        backgroundColor: "#FFEBEE",
      };

    case NotificationType.PaymentReceived:
    case NotificationType.PayoutProcessed:
      return {
        name: "cash",
        color: colors.success,
        backgroundColor: "#E8F5E9",
      };

    case NotificationType.PaymentFailed:
    case NotificationType.PaymentReminder:
      return {
        name: "alert-circle",
        color: colors.error,
        backgroundColor: "#FFEBEE",
      };

    case NotificationType.ProofUploaded:
      return {
        name: "camera",
        color: colors.primary,
        backgroundColor: colors.primaryLight,
      };

    case NotificationType.ProofApproved:
      return {
        name: "checkmark-done",
        color: colors.success,
        backgroundColor: "#E8F5E9",
      };

    case NotificationType.ProofDisputed:
    case NotificationType.ProofRejected:
      return {
        name: "warning",
        color: colors.warning,
        backgroundColor: "#FFF9C4",
      };

    case NotificationType.DisputeFiled:
    case NotificationType.DisputeResolved:
      return {
        name: "shield",
        color: colors.warning,
        backgroundColor: "#FFF9C4",
      };

    case NotificationType.MessageReceived:
      return {
        name: "chatbubble",
        color: colors.primary,
        backgroundColor: colors.primaryLight,
      };

    case NotificationType.SpaceApproved:
    case NotificationType.SpaceReactivated:
      return {
        name: "business",
        color: colors.success,
        backgroundColor: "#E8F5E9",
      };

    case NotificationType.SpaceRejected:
    case NotificationType.SpaceSuspended:
      return {
        name: "business",
        color: colors.error,
        backgroundColor: "#FFEBEE",
      };

    case NotificationType.RefundProcessed:
      return {
        name: "card",
        color: colors.success,
        backgroundColor: "#E8F5E9",
      };

    case NotificationType.SessionExpired:
      return {
        name: "log-out",
        color: colors.warning,
        backgroundColor: "#FFF9C4",
      };

    case NotificationType.SystemUpdate:
    default:
      return {
        name: "notifications",
        color: colors.primary,
        backgroundColor: colors.primaryLight,
      };
  }
}

export default function NotificationCard({
  notification,
  onPress,
}: NotificationCardProps) {
  const { theme } = useTheme();
  const iconConfig = getNotificationIcon(notification.type);

  const handlePress = () => {
    if (onPress) onPress(notification);
  };

  const formattedTime = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: notification.isRead
            ? theme.background
            : theme.backgroundSecondary,
          borderColor: theme.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: iconConfig.backgroundColor },
        ]}
      >
        <Ionicons name={iconConfig.name} size={24} color={iconConfig.color} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: theme.text,
                fontWeight: notification.isRead ? "500" : "700",
              },
            ]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>

        <Text
          style={[styles.body, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {notification.body}
        </Text>

        <Text style={[styles.time, { color: theme.textMuted }]}>
          {formattedTime}
        </Text>
      </View>

      {/* Chevron */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.textMuted}
        style={styles.chevron}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  body: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  time: {
    fontSize: fontSize.xs,
  },
  chevron: {
    marginLeft: spacing.xs,
  },
});
