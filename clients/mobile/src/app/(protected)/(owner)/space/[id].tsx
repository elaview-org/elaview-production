import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Switch,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { spacing, fontSize, colors, borderRadius } from "@/constants/theme";
import {
  mockSpaces,
  spaceTypeLabels,
  spaceTypeIcons,
  formatPrice,
  formatDimensions,
} from "@/mocks/spaces";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function SpaceDetail() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const flatListRef = useRef<FlatList>(null);

  // Find space from mock data (will be replaced with GraphQL query)
  const space = mockSpaces.find((s) => s.id === id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isActive, setIsActive] = useState(space?.isActive ?? true);

  if (!space) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.textMuted} />
        <Text style={[styles.notFoundText, { color: theme.text }]}>Space not found</Text>
        <Button title="Go Back" onPress={() => router.back()} variant="outline" />
      </View>
    );
  }

  const handleEdit = () => {
    // TODO: Navigate to edit screen
    Alert.alert("Edit", "Navigate to edit space screen");
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Space",
      "Are you sure you want to delete this space? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Call delete mutation
            router.back();
          },
        },
      ]
    );
  };

  const handleToggleActive = (value: boolean) => {
    setIsActive(value);
    // TODO: Call mutation to update space status
  };

  const trafficLevelColors = {
    low: colors.warning,
    medium: colors.primary,
    high: colors.success,
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Space Details",
          headerBackTitle: "Listings",
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <FlatList
            ref={flatListRef}
            data={space.photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentImageIndex(index);
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.galleryImage} />
            )}
            keyExtractor={(_, index) => index.toString()}
          />
          {space.photos.length > 1 && (
            <View style={styles.pagination}>
              {space.photos.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
          <View style={styles.imageCount}>
            <Ionicons name="images-outline" size={14} color={colors.white} />
            <Text style={styles.imageCountText}>
              {currentImageIndex + 1}/{space.photos.length}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.typeTag}>
                <Ionicons
                  name={spaceTypeIcons[space.type] as any}
                  size={14}
                  color={colors.primary}
                />
                <Text style={styles.typeTagText}>{spaceTypeLabels[space.type]}</Text>
              </View>
              <Text style={[styles.title, { color: theme.text }]}>{space.title}</Text>
            </View>
          </View>

          {/* Active Toggle */}
          <Card style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusLeft}>
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: isActive ? colors.success : colors.gray400 },
                  ]}
                />
                <Text style={[styles.statusText, { color: theme.text }]}>
                  {isActive ? "Active" : "Inactive"}
                </Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={handleToggleActive}
                trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                thumbColor={isActive ? colors.primary : colors.gray100}
              />
            </View>
            <Text style={[styles.statusHint, { color: theme.textMuted }]}>
              {isActive
                ? "Your space is visible to advertisers"
                : "Your space is hidden from advertisers"}
            </Text>
          </Card>

          {/* Location */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Location</Text>
            <Card style={styles.locationCard}>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <View style={styles.locationText}>
                  <Text style={[styles.address, { color: theme.text }]}>{space.address}</Text>
                  <Text style={[styles.cityState, { color: theme.textSecondary }]}>
                    {space.city}, {space.state} {space.zipCode}
                  </Text>
                </View>
              </View>
              {/* Map placeholder */}
              <View style={[styles.mapPlaceholder, { backgroundColor: theme.card }]}>
                <Ionicons name="map-outline" size={32} color={theme.textMuted} />
                <Text style={[styles.mapPlaceholderText, { color: theme.textMuted }]}>
                  Map preview
                </Text>
              </View>
            </Card>
          </View>

          {/* Pricing */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Pricing</Text>
            <View style={styles.pricingGrid}>
              <Card style={styles.priceCard}>
                <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Daily</Text>
                <Text style={[styles.priceValue, { color: theme.text }]}>
                  {formatPrice(space.dailyRate)}
                </Text>
              </Card>
              {space.weeklyRate && (
                <Card style={styles.priceCard}>
                  <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Weekly</Text>
                  <Text style={[styles.priceValue, { color: theme.text }]}>
                    {formatPrice(space.weeklyRate)}
                  </Text>
                </Card>
              )}
              {space.monthlyRate && (
                <Card style={styles.priceCard}>
                  <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Monthly</Text>
                  <Text style={[styles.priceValue, { color: theme.text }]}>
                    {formatPrice(space.monthlyRate)}
                  </Text>
                </Card>
              )}
            </View>
          </View>

          {/* Dimensions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Dimensions</Text>
            <Card style={styles.dimensionsCard}>
              <Ionicons name="resize-outline" size={24} color={colors.primary} />
              <Text style={[styles.dimensionsText, { color: theme.text }]}>
                {formatDimensions(space.dimensions)}
              </Text>
            </Card>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {space.description}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Performance</Text>
            <View style={styles.statsGrid}>
              {space.impressionsPerDay && (
                <Card style={styles.statCard}>
                  <Ionicons name="eye-outline" size={24} color={colors.primary} />
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {space.impressionsPerDay.toLocaleString()}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                    Impressions/day
                  </Text>
                </Card>
              )}
              {space.trafficLevel && (
                <Card style={styles.statCard}>
                  <Ionicons
                    name="people-outline"
                    size={24}
                    color={trafficLevelColors[space.trafficLevel]}
                  />
                  <Text
                    style={[
                      styles.statValue,
                      { color: trafficLevelColors[space.trafficLevel] },
                    ]}
                  >
                    {space.trafficLevel.charAt(0).toUpperCase() + space.trafficLevel.slice(1)}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                    Traffic Level
                  </Text>
                </Card>
              )}
              {space.rating && (
                <Card style={styles.statCard}>
                  <Ionicons name="star" size={24} color="#FFB800" />
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {space.rating.toFixed(1)}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                    Rating ({space.reviewCount})
                  </Text>
                </Card>
              )}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Edit Space"
              onPress={handleEdit}
              variant="primary"
              fullWidth
              leftIcon={<Ionicons name="create-outline" size={20} color={colors.white} />}
            />
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
              <Text style={styles.deleteButtonText}>Delete Space</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  notFoundText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
  imageGallery: {
    position: "relative",
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: colors.gray100,
  },
  pagination: {
    position: "absolute",
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  paginationDotActive: {
    backgroundColor: colors.white,
    width: 24,
  },
  imageCount: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  imageCountText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  typeTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
    gap: 4,
    marginBottom: spacing.sm,
  },
  typeTagText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
  statusCard: {
    marginBottom: spacing.lg,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  statusHint: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  locationCard: {
    gap: spacing.md,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  locationText: {
    flex: 1,
  },
  address: {
    fontSize: fontSize.md,
    fontWeight: "500",
  },
  cityState: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  mapPlaceholder: {
    height: 120,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
  },
  mapPlaceholderText: {
    fontSize: fontSize.sm,
  },
  pricingGrid: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  priceCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  priceLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  priceValue: {
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
  dimensionsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  dimensionsText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  description: {
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: "30%",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: fontSize.xs,
    textAlign: "center",
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  deleteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});
