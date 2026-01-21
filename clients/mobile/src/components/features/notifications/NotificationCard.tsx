import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Href } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Notification, NotificationType } from "@/types/notifications";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface NotificationCardProps {
  notification: Notification;
  onPress?: (notification: Notification) => void;
}

// Map notification types to icons and colors
function getNotificationIcon(type: NotificationType): {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
} {
  switch (type) {
    case "BOOKING_ACCEPTED":
      return {
        name: "checkmark-circle",
        color: colors.success,
        backgroundColor: "#E8F5E9",
      };

    case "BOOKING_DECLINED":
      return {
        name: "close-circle",
        color: colors.error,
        backgroundColor: "#FFEBEE",
      };

    case "VERIFICATION_SUBMITTED":
      return {
        name: "camera",
        color: colors.primary,
        backgroundColor: colors.primaryLight,
      };

    case "AUTO_APPROVAL_WARNING":
      return {
        name: "time",
        color: colors.warning,
        backgroundColor: "#FFF9C4",
      };

    case "PAYMENT_RECEIVED":
    case "PAYOUT_SENT":
      return {
        name: "cash",
        color: colors.success,
        backgroundColor: "#E8F5E9",
      };

    case "PAYMENT_FAILED":
    case "PAYOUT_FAILED":
      return {
        name: "alert-circle",
        color: colors.error,
        backgroundColor: "#FFEBEE",
      };

    case "BOOKING_APPROVED":
    case "BOOKING_AUTO_APPROVED":
      return {
        name: "checkmark-done",
        color: colors.success,
        backgroundColor: "#E8F5E9",
      };

    case "BOOKING_COMPLETED":
      return {
        name: "checkmark-circle-outline",
        color: colors.gray600,
        backgroundColor: colors.gray100,
      };

    case "DISPUTE_OPENED":
      return {
        name: "warning",
        color: colors.warning,
        backgroundColor: "#FFF9C4",
      };

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
  const router = useRouter();
  const iconConfig = getNotificationIcon(notification.type);

  const handlePress = () => {
    if (onPress) {
      onPress(notification);
    }

    // Navigate to route if provided
    if (notification.data.route) {
      router.push(notification.data.route as Href);
    }
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
          backgroundColor: notification.read
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
                fontWeight: notification.read ? "500" : "700",
              },
            ]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          {!notification.read && <View style={styles.unreadDot} />}
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
