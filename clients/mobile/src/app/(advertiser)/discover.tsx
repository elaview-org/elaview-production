import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import SpaceCard from '@/components/features/SpaceCard';
import Card from '@/components/ui/Card';
import { spacing, fontSize, colors, borderRadius } from '@/constants/theme';
import {
  mockSpaces,
  Space,
  SpaceType,
  spaceTypeLabels,
  spaceTypeIcons,
} from '@/mocks/spaces';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_MIN_HEIGHT = 180;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.7;

type FilterType = 'all' | SpaceType;

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All Types' },
  { key: 'window', label: 'Windows' },
  { key: 'billboard', label: 'Billboards' },
  { key: 'poster', label: 'Posters' },
  { key: 'digital_screen', label: 'Digital' },
  { key: 'vehicle', label: 'Vehicles' },
];

export default function Discover() {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  // Bottom sheet animation
  const sheetHeight = useRef(new Animated.Value(SHEET_MIN_HEIGHT)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = SHEET_MIN_HEIGHT - gestureState.dy;
        if (newHeight >= SHEET_MIN_HEIGHT && newHeight <= SHEET_MAX_HEIGHT) {
          sheetHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          // Swipe up - expand
          Animated.spring(sheetHeight, {
            toValue: SHEET_MAX_HEIGHT,
            useNativeDriver: false,
          }).start();
        } else if (gestureState.dy > 50) {
          // Swipe down - collapse
          Animated.spring(sheetHeight, {
            toValue: SHEET_MIN_HEIGHT,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Filter spaces
  const filteredSpaces = mockSpaces.filter((space) => {
    const matchesSearch =
      searchQuery === '' ||
      space.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || space.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSpacePress = (space: Space) => {
    setSelectedSpace(space);
    // TODO: Navigate to space detail
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.backgroundSecondary }]}>
          <Ionicons name="search-outline" size={20} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search spaces..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              activeFilter === filter.key && styles.filterChipActive,
              { backgroundColor: activeFilter === filter.key ? colors.primary : theme.backgroundSecondary },
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: activeFilter === filter.key ? colors.white : theme.text },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Map Placeholder */}
      <View style={[styles.mapContainer, { backgroundColor: isDark ? '#2D2D2D' : '#E8F4FD' }]}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={48} color={theme.textMuted} />
          <Text style={[styles.mapPlaceholderText, { color: theme.textSecondary }]}>
            Map View
          </Text>
          <Text style={[styles.mapPlaceholderSubtext, { color: theme.textMuted }]}>
            {filteredSpaces.length} spaces in this area
          </Text>
        </View>

        {/* Mock map pins */}
        {filteredSpaces.slice(0, 5).map((space, index) => (
          <TouchableOpacity
            key={space.id}
            style={[
              styles.mapPin,
              {
                top: 60 + (index * 40) % 150,
                left: 40 + (index * 70) % 250,
              },
            ]}
            onPress={() => handleSpacePress(space)}
          >
            <View style={styles.mapPinIcon}>
              <Ionicons name="location" size={24} color={colors.primary} />
            </View>
            <View style={styles.mapPinPrice}>
              <Text style={styles.mapPinPriceText}>${space.dailyRate}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            height: sheetHeight,
            backgroundColor: theme.background,
          },
        ]}
      >
        {/* Drag Handle */}
        <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
          <View style={[styles.dragHandle, { backgroundColor: theme.border }]} />
        </View>

        {/* Sheet Header */}
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: theme.text }]}>
            {filteredSpaces.length} Spaces Available
          </Text>
        </View>

        {/* Spaces List */}
        <FlatList
          data={filteredSpaces}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SpaceCard
              space={item}
              compact
              onPress={() => handleSpacePress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    marginLeft: spacing.sm,
    paddingVertical: spacing.xs,
  },
  filtersContainer: {
    maxHeight: 50,
  },
  filtersContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  mapPlaceholderSubtext: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  mapPinIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mapPinPrice: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: -4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mapPinPriceText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.black,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  sheetHeader: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  sheetTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
