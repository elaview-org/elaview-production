import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import BookingCard from '@/components/features/BookingCard';
import EmptyState from '@/components/ui/EmptyState';
import { spacing, fontSize, colors, borderRadius } from '@/constants/theme';
import { mockAdvertiserBookings, filterBookingsByStatus } from '@/mocks/bookings';
import { BookingStatus } from '@/components/ui/StatusBadge';

type TabFilter = 'all' | 'active' | 'pending' | 'completed';

const tabs: { key: TabFilter; label: string; statuses: BookingStatus[] }[] = [
  { key: 'all', label: 'All', statuses: [] },
  { key: 'pending', label: 'Pending', statuses: ['pending', 'accepted', 'paid'] },
  { key: 'active', label: 'Active', statuses: ['active', 'verification_pending'] },
  { key: 'completed', label: 'Past', statuses: ['completed', 'cancelled', 'declined'] },
];

export default function Bookings() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredBookings = useMemo(() => {
    const tab = tabs.find((t) => t.key === activeTab);
    if (!tab || tab.statuses.length === 0) {
      return mockAdvertiserBookings;
    }
    return filterBookingsByStatus(mockAdvertiserBookings, tab.statuses);
  }, [activeTab]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Filter Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: theme.background }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.key ? colors.primary : theme.textSecondary },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            perspective="advertiser"
            onPress={() => {
              // TODO: Navigate to booking detail
            }}
          />
        )}
        contentContainerStyle={[
          styles.listContainer,
          filteredBookings.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No bookings found"
            subtitle={
              activeTab === 'all'
                ? "You haven't made any bookings yet. Discover spaces to get started!"
                : `No ${activeTab} bookings to show.`
            }
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.textMuted}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray200,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.xs,
    borderRadius: borderRadius.full,
  },
  tabActive: {
    backgroundColor: colors.primaryLight,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
  },
});
