import { useMemo, useState } from "react";
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
import api from "@/api";
import { Query, Space } from "@/types/graphql";

export default function Listings() {
  const { theme } = useTheme();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const { data, loading, refetch } = api.query<Pick<Query, "mySpaces">>(
    api.gql`
      query {
        mySpaces(first: 50) {
          nodes {
            id
            title
            type
            city
            state
            pricePerDay
            images
            dimensionsText
            averageRating
            totalBookings
            status
          }
        }
      }
    `,
    { fetchPolicy: "cache-and-network" }
  );

  const spaces = useMemo(() => {
    if (!data?.mySpaces?.nodes) return [];
    return data.mySpaces.nodes as Space[];
  }, [data]);

  const handleAddListing = () => {
    router.push("/(protected)/(owner)/new-listing");
  };

  const renderSpace = ({ item }: { item: Space }) => (
    <SpaceCard
      space={item}
      compact={viewMode === "list"}
      gridMode={viewMode === "grid"}
      onPress={() => {
        router.push({
          pathname: "/(owner)/space/[id]" as const,
          params: { id: String(item.id) },
        });
      }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with view toggle */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {spaces.length} {spaces.length === 1 ? "Space" : "Spaces"}
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
        data={spaces}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderSpace}
        numColumns={viewMode === "grid" ? 2 : 1}
        key={viewMode}
        columnWrapperStyle={viewMode === "grid" ? styles.gridRow : undefined}
        contentContainerStyle={[
          styles.listContainer,
          spaces.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="business-outline"
              title="No listings yet"
              subtitle="Add your first advertising space to start earning."
              actionLabel="Add Space"
              onAction={handleAddListing}
            />
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => refetch()}
            tintColor={theme.textMuted}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB for adding new listing */}
      {spaces.length > 0 && (
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
