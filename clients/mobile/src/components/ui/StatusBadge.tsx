import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fontSize, spacing, borderRadius } from '@/constants/theme';

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'paid'
  | 'active'
  | 'verification_pending'
  | 'completed'
  | 'cancelled'
  | 'declined'
  | 'disputed';

interface StatusBadgeProps {
  status: BookingStatus;
  style?: ViewStyle;
}

const statusConfig: Record<BookingStatus, { label: string; color: string; backgroundColor: string }> = {
  pending: {
    label: 'Pending',
    color: colors.warning,
    backgroundColor: `${colors.warning}20`,
  },
  accepted: {
    label: 'Accepted',
    color: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  paid: {
    label: 'Paid',
    color: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  active: {
    label: 'Active',
    color: colors.success,
    backgroundColor: `${colors.success}20`,
  },
  verification_pending: {
    label: 'Awaiting Review',
    color: colors.warning,
    backgroundColor: `${colors.warning}20`,
  },
  completed: {
    label: 'Completed',
    color: colors.gray600,
    backgroundColor: colors.gray100,
  },
  cancelled: {
    label: 'Cancelled',
    color: colors.gray600,
    backgroundColor: colors.gray100,
  },
  declined: {
    label: 'Declined',
    color: colors.error,
    backgroundColor: `${colors.error}20`,
  },
  disputed: {
    label: 'Disputed',
    color: colors.error,
    backgroundColor: `${colors.error}20`,
  },
};

/**
 * StatusBadge - Colored status indicator pill
 */
export default function StatusBadge({ status, style }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.backgroundColor },
        style,
      ]}
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
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
