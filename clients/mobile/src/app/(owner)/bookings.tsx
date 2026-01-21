import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import BookingCard from "@/components/features/BookingCard";
import EmptyState from "@/components/ui/EmptyState";
import { spacing, fontSize, colors, borderRadius } from "@/constants/theme";
import { mockOwnerBookings, filterBookingsByStatus } from "@/mocks/bookings";
import { BookingStatus } from "@/components/ui/StatusBadge";

type TabFilter = "requests" | "active" | "past";

const tabs: { key: TabFilter; label: string; statuses: BookingStatus[] }[] = [
  { key: "requests", label: "Requests", statuses: ["pending"] },
  {
    key: "active",
    label: "Active",
    statuses: ["accepted", "paid", "active", "verification_pending"],
  },
  {
    key: "past",
    label: "Past",
    statuses: ["completed", "cancelled", "declined"],
  },
];

export default function Bookings() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabFilter>("requests");
  const [refreshing, setRefreshing] = useState(false);

  const filteredBookings = useMemo(() => {
    const tab = tabs.find((t) => t.key === activeTab);
    if (!tab) return mockOwnerBookings;
    return filterBookingsByStatus(mockOwnerBookings, tab.statuses);
  }, [activeTab]);

  // Count pending requests for badge
  const pendingCount = useMemo(() => {
    return filterBookingsByStatus(mockOwnerBookings, ["pending"]).length;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Filter Tabs */}
      <View
        style={[styles.tabsContainer, { backgroundColor: theme.background }]}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === tab.key
                      ? colors.primary
                      : theme.textSecondary,
                },
              ]}
            >
              {tab.label}
            </Text>
            {tab.key === "requests" && pendingCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingCount}</Text>
              </View>
            )}
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
            perspective="owner"
            showActions={item.status === "pending"}
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
            icon={
              activeTab === "requests" ? "mail-outline" : "calendar-outline"
            }
            title={
              activeTab === "requests"
                ? "No pending requests"
                : activeTab === "active"
                  ? "No active bookings"
                  : "No past bookings"
            }
            subtitle={
              activeTab === "requests"
                ? "When advertisers request to book your spaces, they'll appear here."
                : undefined
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
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray200,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "500",
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.xs,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
  },
});
