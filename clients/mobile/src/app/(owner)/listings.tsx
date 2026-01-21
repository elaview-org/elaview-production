import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import SpaceCard from "@/components/features/SpaceCard";
import EmptyState from "@/components/ui/EmptyState";
import { spacing, fontSize, colors, borderRadius } from "@/constants/theme";
import { mockSpaces, Space } from "@/mocks/spaces";

const PAGE_SIZE = 10;

export default function Listings() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [displayedSpaces, setDisplayedSpaces] = useState<Space[]>(
    mockSpaces.slice(0, PAGE_SIZE)
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(mockSpaces.length > PAGE_SIZE);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setDisplayedSpaces(mockSpaces.slice(0, PAGE_SIZE));
      setHasMore(mockSpaces.length > PAGE_SIZE);
      setRefreshing(false);
    }, 1000);
  }, []);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    // TODO: Replace with HotChocolate GraphQL query using [UsePaging]
    // Example: useSpacesQuery({ first: PAGE_SIZE, after: cursor })
    // The backend SpaceQueries.cs already has [UsePaging] configured
    // See: backend/Features/Spaces/SpaceQueries.cs - GetSpaces query
    setTimeout(() => {
      const currentLength = displayedSpaces.length;
      const nextSpaces = mockSpaces.slice(
        currentLength,
        currentLength + PAGE_SIZE
      );
      setDisplayedSpaces((prev) => [...prev, ...nextSpaces]);
      setHasMore(currentLength + nextSpaces.length < mockSpaces.length);
      setIsLoadingMore(false);
    }, 500);
  }, [displayedSpaces.length, isLoadingMore, hasMore]);

  const handleAddListing = () => {
    router.push("/(owner)/new-listing");
  };

  const renderSpace = ({ item }: { item: Space }) => (
    <SpaceCard
      space={item}
      compact={viewMode === "list"}
      gridMode={viewMode === "grid"}
      onPress={() => {
        // TODO: Navigate to listing detail/edit
      }}
    />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: theme.textMuted }]}>
          Loading more...
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with view toggle */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {displayedSpaces.length}{" "}
          {displayedSpaces.length === 1 ? "Space" : "Spaces"}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.viewToggle,
              viewMode === "list" && { backgroundColor: colors.primaryLight },
            ]}
            onPress={() => setViewMode("list")}
          >
            <Ionicons
              name="list-outline"
              size={18}
              color={viewMode === "list" ? colors.primary : theme.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggle,
              viewMode === "grid" && { backgroundColor: colors.primaryLight },
            ]}
            onPress={() => setViewMode("grid")}
          >
            <Ionicons
              name="grid-outline"
              size={18}
              color={viewMode === "grid" ? colors.primary : theme.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Listings */}
      <FlatList
        data={displayedSpaces}
        keyExtractor={(item) => item.id}
        renderItem={renderSpace}
        numColumns={viewMode === "grid" ? 2 : 1}
        key={viewMode} // Force re-render when switching modes
        columnWrapperStyle={viewMode === "grid" ? styles.gridRow : undefined}
        contentContainerStyle={[
          styles.listContainer,
          displayedSpaces.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          <EmptyState
            icon="business-outline"
            title="No listings yet"
            subtitle="Add your first advertising space to start earning."
            actionLabel="Add Space"
            onAction={handleAddListing}
          />
        }
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.textMuted}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB for adding new listing */}
      {displayedSpaces.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddListing}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
  },
  viewToggle: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.xs,
  },
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
  },
  gridRow: {
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  loadingFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: fontSize.sm,
  },
  fab: {
    position: "absolute",
    bottom: spacing.lg,
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
