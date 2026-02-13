import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter, Href } from "expo-router";
import api from "@/api";
import { useTheme } from "@/contexts/ThemeContext";
import BookingCard from "@/components/features/BookingCard";
import EmptyState from "@/components/ui/EmptyState";
import { spacing, fontSize, colors, borderRadius } from "@/constants/theme";
import { BookingStatus } from "@/types/graphql";
import type { BookingListItem } from "@/components/features/BookingCard";
import type { Query } from "@/types/graphql";

type TabFilter = "requests" | "active" | "past";

const tabs: { key: TabFilter; label: string; statuses: BookingStatus[] }[] = [
  {
    key: "requests",
    label: "Requests",
    statuses: [BookingStatus.PendingApproval],
  },
  {
    key: "active",
    label: "Active",
    statuses: [
      BookingStatus.Approved,
      BookingStatus.Paid,
      BookingStatus.FileDownloaded,
      BookingStatus.Installed,
      BookingStatus.Verified,
    ],
  },
  {
    key: "past",
    label: "Past",
    statuses: [
      BookingStatus.Completed,
      BookingStatus.Cancelled,
      BookingStatus.Rejected,
    ],
  },
];

const GET_MY_BOOKINGS_AS_OWNER = api.gql`
  query GetMyBookingsAsOwner($first: Int, $where: BookingFilterInput) {
    myBookingsAsOwner(
      first: $first
      where: $where
      order: { createdAt: DESC }
    ) {
      nodes {
        id
        status
        startDate
        endDate
        totalAmount
        pricePerDay
        advertiserNotes
        space {
          id
          title
          type
          images
          spaceOwnerProfile {
            user { name }
          }
        }
        campaign {
          advertiserProfile {
            user { name }
          }
        }
      }
    }
  }
`;

const GET_PENDING_COUNT = api.gql`
  query GetPendingCount {
    myBookingsAsOwner(
      first: 0
      where: { status: { eq: PENDING_APPROVAL } }
    ) {
      totalCount
    }
  }
`;

export default function Bookings() {
  const { theme } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabFilter>("requests");

  const tab = tabs.find((t) => t.key === activeTab)!;
  const whereFilter = { status: { in: tab.statuses } };

  const { data, loading, refetch, networkStatus } = api.query<
    Pick<Query, "myBookingsAsOwner">
  >(GET_MY_BOOKINGS_AS_OWNER, {
    variables: { first: 50, where: whereFilter },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // Separate query for the pending badge count
  const { data: pendingData } = api.query<Pick<Query, "myBookingsAsOwner">>(
    GET_PENDING_COUNT,
    { fetchPolicy: "cache-and-network" }
  );

  const bookings: BookingListItem[] = useMemo(() => {
    return (data?.myBookingsAsOwner?.nodes ?? []) as BookingListItem[];
  }, [data]);

  const pendingCount = (pendingData?.myBookingsAsOwner as any)?.totalCount ?? 0;
  const refreshing = networkStatus === 4;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Filter Tabs */}
      <View
        style={[styles.tabsContainer, { backgroundColor: theme.background }]}
      >
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === t.key
                      ? colors.primary
                      : theme.textSecondary,
                },
              ]}
            >
              {t.label}
            </Text>
            {t.key === "requests" && pendingCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Loading state for initial load */}
      {loading && !data ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              perspective="owner"
              showActions={item.status === BookingStatus.PendingApproval}
              onPress={() => {
                router.push(
                  `/(protected)/(owner)/booking/${item.id}` as Href
                );
              }}
            />
          )}
          contentContainerStyle={[
            styles.listContainer,
            bookings.length === 0 && styles.emptyContainer,
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
              onRefresh={() => refetch()}
              tintColor={theme.textMuted}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
