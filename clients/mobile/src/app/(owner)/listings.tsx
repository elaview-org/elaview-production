import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import SpaceCard from '@/components/features/SpaceCard';
import EmptyState from '@/components/ui/EmptyState';
import { spacing, fontSize, colors, borderRadius } from '@/constants/theme';
import { mockSpaces, Space } from '@/mocks/spaces';

export default function Listings() {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filter to show only "owner's" spaces (first 3 for demo)
  const ownerSpaces = mockSpaces.slice(0, 3);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAddListing = () => {
    // TODO: Navigate to create listing flow
  };

  const renderSpace = ({ item }: { item: Space }) => (
    <SpaceCard
      space={item}
      compact={viewMode === 'list'}
      onPress={() => {
        // TODO: Navigate to listing detail/edit
      }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with view toggle */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {ownerSpaces.length} {ownerSpaces.length === 1 ? 'Space' : 'Spaces'}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.viewToggle,
              viewMode === 'list' && { backgroundColor: colors.primaryLight },
            ]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons
              name="list-outline"
              size={18}
              color={viewMode === 'list' ? colors.primary : theme.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggle,
              viewMode === 'grid' && { backgroundColor: colors.primaryLight },
            ]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons
              name="grid-outline"
              size={18}
              color={viewMode === 'grid' ? colors.primary : theme.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Listings */}
      <FlatList
        data={ownerSpaces}
        keyExtractor={(item) => item.id}
        renderItem={renderSpace}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when switching modes
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        contentContainerStyle={[
          styles.listContainer,
          ownerSpaces.length === 0 && styles.emptyContainer,
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
      {ownerSpaces.length > 0 && (
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
  },
  viewToggle: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
