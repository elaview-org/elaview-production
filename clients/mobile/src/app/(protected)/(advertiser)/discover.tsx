import { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import Map from "@/components/ui/Map";
import SpaceCard from "@/components/features/SpaceCard";
import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import api from "@/api";
import { Query, Space, SpaceType } from "@/types/graphql";

const DEFAULT_REGION = {
  latitude: 33.7175,
  longitude: -117.8311,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_MIN_HEIGHT = 180;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.7;

type FilterType = "all" | SpaceType;

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "All Types" },
  { key: SpaceType.WindowDisplay, label: "Windows" },
  { key: SpaceType.Billboard, label: "Billboards" },
  { key: SpaceType.Storefront, label: "Storefronts" },
  { key: SpaceType.DigitalDisplay, label: "Digital" },
  { key: SpaceType.VehicleWrap, label: "Vehicles" },
];

export default function Discover() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const { data } = api.query<Pick<Query, "spaces">>(
    api.gql`
      query {
        spaces(first: 50, where: { status: { eq: ACTIVE } }) {
          nodes {
            id
            title
            description
            address
            city
            state
            latitude
            longitude
            pricePerDay
            type
            images
            dimensionsText
            averageRating
            totalBookings
            status
            spaceOwnerProfile {
              id
              user {
                name
              }
            }
          }
        }
      }
    `,
    { fetchPolicy: "cache-and-network" }
  );

  const spaces = useMemo(() => {
    if (!data?.spaces?.nodes) return [];
    return data.spaces.nodes as Space[];
  }, [data]);

  // Bottom sheet animation
  const sheetHeight = useRef(new Animated.Value(SHEET_MIN_HEIGHT)).current;
  const currentHeight = useRef(SHEET_MIN_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        sheetHeight.setOffset(currentHeight.current);
        sheetHeight.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        const newHeight = -gestureState.dy;
        const totalHeight = currentHeight.current + newHeight;
        if (totalHeight >= SHEET_MIN_HEIGHT && totalHeight <= SHEET_MAX_HEIGHT) {
          sheetHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        sheetHeight.flattenOffset();
        const targetHeight =
          gestureState.dy < -50
            ? SHEET_MAX_HEIGHT
            : gestureState.dy > 50
              ? SHEET_MIN_HEIGHT
              : currentHeight.current;
        currentHeight.current = targetHeight;
        Animated.spring(sheetHeight, {
          toValue: targetHeight,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      const matchesSearch =
        searchQuery === "" ||
        space.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === "all" || space.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [spaces, searchQuery, activeFilter]);

  const handleSpacePress = (space: Space) => {
    router.push({
      pathname: "/(protected)/(advertiser)/space/[id]",
      params: { id: String(space.id) },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Bar */}
      <View
        style={[styles.searchContainer, { backgroundColor: theme.background }]}
      >
        <View
          style={[
            styles.searchBar,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Ionicons name="search-outline" size={20} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search spaces..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
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
              {
                backgroundColor:
                  activeFilter === filter.key
                    ? colors.primary
                    : theme.backgroundSecondary,
              },
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                {
                  color:
                    activeFilter === filter.key ? colors.white : theme.text,
                },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Map */}
      <View style={styles.mapContainer}>
        <Map
          initialRegion={DEFAULT_REGION}
          markers={filteredSpaces.map((space) => ({
            id: String(space.id),
            latitude: space.latitude,
            longitude: space.longitude,
            price: Number(space.pricePerDay),
          }))}
          onMarkerPress={(id) => {
            const space = filteredSpaces.find((s) => String(s.id) === id);
            if (space) handleSpacePress(space);
          }}
        />
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
          <View
            style={[styles.dragHandle, { backgroundColor: theme.border }]}
          />
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
          keyExtractor={(item) => String(item.id)}
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
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    fontWeight: "500",
  },
  mapContainer: {
    flex: 1,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  dragHandleContainer: {
    alignItems: "center",
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
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
