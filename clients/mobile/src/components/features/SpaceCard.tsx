import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeContext";
import { spacing, fontSize, colors, borderRadius } from "@/constants/theme";
import {
  Space,
  spaceTypeLabels,
  formatPrice,
  formatDimensions,
} from "@/mocks/spaces";

const screenWidth = Dimensions.get("window").width;
const GRID_GAP = spacing.sm;
const GRID_PADDING = spacing.md;
const GRID_CARD_WIDTH = (screenWidth - GRID_PADDING * 2 - GRID_GAP) / 2;

interface SpaceCardProps {
  space: Space;
  onPress?: () => void;
  compact?: boolean;
  gridMode?: boolean;
}

/**
 * SpaceCard - Display a space listing
 * Used in Discover, Owner Listings
 */
export default function SpaceCard({
  space,
  onPress,
  compact = false,
  gridMode = false,
}: SpaceCardProps) {
  const { theme } = useTheme();

  // Grid mode - simplified vertical layout for 2-column grids
  if (gridMode) {
    return (
      <Card onPress={onPress} style={styles.gridCard}>
        <Image source={{ uri: space.photos[0] }} style={styles.gridImage} />
        <View style={styles.gridContent}>
          <Text
            style={[styles.gridTitle, { color: theme.text }]}
            numberOfLines={1}
          >
            {space.title}
          </Text>
          <View style={styles.gridFooter}>
            <View style={styles.gridTypeTag}>
              <Text style={styles.gridTypeTagText}>
                {spaceTypeLabels[space.type]}
              </Text>
            </View>
            <Text style={[styles.gridPrice, { color: theme.text }]}>
              {formatPrice(space.dailyRate)}
              <Text
                style={[styles.gridPriceUnit, { color: theme.textSecondary }]}
              >
                /day
              </Text>
            </Text>
          </View>
        </View>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card onPress={onPress} style={styles.compactCard}>
        <Image source={{ uri: space.photos[0] }} style={styles.compactImage} />
        <View style={styles.compactContent}>
          <Text
            style={[styles.compactTitle, { color: theme.text }]}
            numberOfLines={1}
          >
            {space.title}
          </Text>
          <Text style={[styles.compactType, { color: theme.textSecondary }]}>
            {spaceTypeLabels[space.type]}
          </Text>
          <Text style={[styles.compactPrice, { color: colors.primary }]}>
            {formatPrice(space.dailyRate)}/day
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card onPress={onPress} style={styles.card}>
      <Image source={{ uri: space.photos[0] }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {space.title}
          </Text>
          {space.rating && (
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={[styles.ratingText, { color: theme.text }]}>
                {space.rating.toFixed(1)}
              </Text>
              <Text style={[styles.reviewCount, { color: theme.textMuted }]}>
                ({space.reviewCount})
              </Text>
            </View>
          )}
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={theme.textSecondary}
            />
            <Text
              style={[styles.detailText, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {space.city}, {space.state}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name="resize-outline"
              size={14}
              color={theme.textSecondary}
            />
            <Text style={[styles.detailText, { color: theme.textSecondary }]}>
              {formatDimensions(space.dimensions)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>
              {spaceTypeLabels[space.type]}
            </Text>
          </View>
          <Text style={[styles.price, { color: theme.text }]}>
            <Text style={styles.priceAmount}>
              {formatPrice(space.dailyRate)}
            </Text>
            <Text style={[styles.priceUnit, { color: theme.textSecondary }]}>
              /day
            </Text>
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: colors.gray100,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    flex: 1,
    marginRight: spacing.sm,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: fontSize.xs,
    marginLeft: 2,
  },
  details: {
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: fontSize.sm,
    marginLeft: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  typeTagText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  price: {
    fontSize: fontSize.lg,
  },
  priceAmount: {
    fontWeight: "700",
  },
  priceUnit: {
    fontSize: fontSize.sm,
    fontWeight: "400",
  },
  // Compact variant
  compactCard: {
    flexDirection: "row",
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.gray100,
  },
  compactContent: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: "center",
  },
  compactTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
    marginBottom: 4,
  },
  compactType: {
    fontSize: fontSize.sm,
    marginBottom: 4,
  },
  compactPrice: {
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  // Grid mode variant
  gridCard: {
    width: GRID_CARD_WIDTH,
    marginBottom: spacing.sm,
    padding: 0,
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: GRID_CARD_WIDTH * 0.75, // 4:3 aspect ratio
    backgroundColor: colors.gray100,
  },
  gridContent: {
    padding: spacing.sm,
  },
  gridTitle: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  gridFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gridTypeTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gridTypeTagText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  gridPrice: {
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  gridPriceUnit: {
    fontSize: fontSize.xs,
    fontWeight: "400",
  },
});
