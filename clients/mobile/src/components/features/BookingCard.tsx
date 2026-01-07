import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '@/components/ui/Card';
import StatusBadge, { BookingStatus } from '@/components/ui/StatusBadge';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, fontSize, colors } from '@/constants/theme';
import { Booking, formatDateRange } from '@/mocks/bookings';

interface BookingCardProps {
  booking: Booking;
  onPress?: () => void;
  /** Shows accept/decline preview for owners */
  showActions?: boolean;
  /** Whether viewing as owner or advertiser */
  perspective?: 'owner' | 'advertiser';
}

/**
 * BookingCard - Display a booking with status
 * Used in Bookings screens for both roles
 */
export default function BookingCard({
  booking,
  onPress,
  showActions = false,
  perspective = 'advertiser',
}: BookingCardProps) {
  const { theme } = useTheme();

  const counterpartyName =
    perspective === 'advertiser' ? booking.ownerName : booking.advertiserName;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: booking.spacePhoto }} style={styles.image} />
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {booking.spaceTitle}
          </Text>
          <Text style={[styles.counterparty, { color: theme.textSecondary }]}>
            {perspective === 'advertiser' ? 'Owner:' : 'Advertiser:'} {counterpartyName}
          </Text>
          <StatusBadge status={booking.status} />
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]}>
            {formatDateRange(booking.startDate, booking.endDate)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="pricetag-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.detailText, { color: theme.text }]}>
            ${booking.totalPrice.toFixed(0)}
          </Text>
        </View>
      </View>

      {booking.message && perspective === 'owner' && booking.status === 'pending' && (
        <View style={[styles.messageBox, { backgroundColor: theme.backgroundSecondary }]}>
          <Ionicons name="chatbubble-outline" size={14} color={theme.textSecondary} />
          <Text style={[styles.messageText, { color: theme.textSecondary }]} numberOfLines={2}>
            "{booking.message}"
          </Text>
        </View>
      )}

      {showActions && booking.status === 'pending' && (
        <View style={styles.actionHint}>
          <Ionicons name="hand-right-outline" size={14} color={colors.primary} />
          <Text style={[styles.actionHintText, { color: colors.primary }]}>
            Tap to review request
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: colors.gray100,
  },
  headerContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  counterparty: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.md,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: fontSize.sm,
    marginLeft: 6,
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  messageText: {
    fontSize: fontSize.sm,
    marginLeft: spacing.sm,
    flex: 1,
    fontStyle: 'italic',
  },
  actionHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray200,
  },
  actionHintText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
});
