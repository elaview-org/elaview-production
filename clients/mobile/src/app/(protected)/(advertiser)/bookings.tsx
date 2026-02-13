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

type TabFilter = "all" | "pending" | "active" | "past";

const tabs: { key: TabFilter; label: string; statuses: BookingStatus[] }[] = [
  { key: "all", label: "All", statuses: [] },
  {
    key: "pending",
    label: "Pending",
    statuses: [
      BookingStatus.PendingApproval,
      BookingStatus.Approved,
      BookingStatus.Paid,
    ],
  },
  {
    key: "active",
    label: "Active",
    statuses: [
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

const GET_MY_BOOKINGS = api.gql`
  query GetMyBookingsAsAdvertiser($first: Int, $where: BookingFilterInput) {
    myBookingsAsAdvertiser(
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

export default function Bookings() {
  const { theme } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const tab = tabs.find((t) => t.key === activeTab)!;
  const whereFilter =
    tab.statuses.length > 0
      ? { status: { in: tab.statuses } }
      : undefined;

  const { data, loading, refetch, networkStatus } = api.query<
    Pick<Query, "myBookingsAsAdvertiser">
  >(GET_MY_BOOKINGS, {
    variables: { first: 50, where: whereFilter },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const bookings: BookingListItem[] = useMemo(() => {
    return (data?.myBookingsAsAdvertiser?.nodes ?? []) as BookingListItem[];
  }, [data]);

  const refreshing = networkStatus === 4; // NetworkStatus.refetch

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
              perspective="advertiser"
              onPress={() => {
                router.push(
                  `/(protected)/(advertiser)/booking/${item.id}` as Href
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
              icon="calendar-outline"
              title="No bookings found"
              subtitle={
                activeTab === "all"
                  ? "You haven't made any bookings yet. Discover spaces to get started!"
                  : `No ${activeTab} bookings to show.`
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
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
  },
});
