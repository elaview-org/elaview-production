import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, fontSize, spacing, borderRadius } from "@/constants/theme";
import { BookingStatus } from "@/types/graphql";

export { BookingStatus };

interface StatusBadgeProps {
  status: BookingStatus;
  style?: ViewStyle;
}

const statusConfig: Record<
  BookingStatus,
  { label: string; color: string; backgroundColor: string }
> = {
  [BookingStatus.PendingApproval]: {
    label: "Pending",
    color: colors.warning,
    backgroundColor: `${colors.warning}20`,
  },
  [BookingStatus.Approved]: {
    label: "Approved",
    color: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  [BookingStatus.Paid]: {
    label: "Paid",
    color: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  [BookingStatus.FileDownloaded]: {
    label: "File Downloaded",
    color: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  [BookingStatus.Installed]: {
    label: "Active",
    color: colors.success,
    backgroundColor: `${colors.success}20`,
  },
  [BookingStatus.Verified]: {
    label: "Awaiting Review",
    color: colors.warning,
    backgroundColor: `${colors.warning}20`,
  },
  [BookingStatus.Completed]: {
    label: "Completed",
    color: colors.gray600,
    backgroundColor: colors.gray100,
  },
  [BookingStatus.Cancelled]: {
    label: "Cancelled",
    color: colors.gray600,
    backgroundColor: colors.gray100,
  },
  [BookingStatus.Rejected]: {
    label: "Declined",
    color: colors.error,
    backgroundColor: `${colors.error}20`,
  },
  [BookingStatus.Disputed]: {
    label: "Disputed",
    color: colors.error,
    backgroundColor: `${colors.error}20`,
  },
};

/**
 * StatusBadge - Colored status indicator pill
 */
export default function StatusBadge({ status, style }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    color: colors.gray600,
    backgroundColor: colors.gray100,
  };

  return (
    <View
      style={[styles.badge, { backgroundColor: config.backgroundColor }, style]}
    >
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
});
