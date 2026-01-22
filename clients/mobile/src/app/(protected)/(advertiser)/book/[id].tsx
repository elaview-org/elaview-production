import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { spacing, fontSize, colors, borderRadius } from "@/constants/theme";
import api from "@/api";
import { Query } from "@/types/graphql";
import { formatPrice } from "@/mocks/spaces";

/**
 * Book Space Screen (Placeholder)
 * Allows advertisers to request a booking for a space
 */
export default function BookSpace() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch space details for booking summary
  const { data, loading, error } = api.query<Pick<Query, "spaceById">>(
    api.gql`
      query GetSpaceForBooking($id: ID!) {
        spaceById(id: $id) {
          id
          title
          pricePerDay
          installationFee
          minDuration
          maxDuration
          images
          owner {
            businessName
            user {
              name
            }
          }
        }
      }
    `,
    {
      variables: { id },
      skip: !id,
    }
  );

  const space = data?.spaceById;

  const handleRequestBooking = () => {
    Alert.alert(
      "Coming Soon",
      "The booking request feature is currently under development. You'll be able to select dates, add campaign details, and submit booking requests soon!",
      [{ text: "OK" }]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!space || error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.textMuted} />
        <Text style={[styles.errorText, { color: theme.text }]}>Space not found</Text>
        <Button title="Go Back" onPress={() => router.back()} variant="outline" />
      </View>
    );
  }

  const ownerName = space.owner?.businessName || space.owner?.user?.name || "Space Owner";

  return (
    <>
      <Stack.Screen
        options={{
          title: "Request Booking",
          headerBackTitle: "Space",
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Space Summary */}
        <Card style={styles.summaryCard}>
          <Text style={[styles.spaceTitle, { color: theme.text }]}>{space.title}</Text>
          <Text style={[styles.ownerName, { color: theme.textSecondary }]}>
            by {ownerName}
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Daily Rate</Text>
            <Text style={[styles.priceValue, { color: theme.text }]}>
              {formatPrice(Number(space.pricePerDay))}
            </Text>
          </View>
          {Number(space.installationFee) > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>
                Installation Fee
              </Text>
              <Text style={[styles.priceValue, { color: theme.text }]}>
                {formatPrice(Number(space.installationFee))}
              </Text>
            </View>
          )}
          <View style={styles.durationRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.durationText, { color: theme.textSecondary }]}>
              Min: {space.minDuration} {space.minDuration === 1 ? "day" : "days"}
              {space.maxDuration && ` • Max: ${space.maxDuration} days`}
            </Text>
          </View>
        </Card>

        {/* Coming Soon Notice */}
        <Card style={styles.comingSoonCard}>
          <View style={styles.comingSoonContent}>
            <Ionicons name="construct-outline" size={48} color={colors.primary} />
            <Text style={[styles.comingSoonTitle, { color: theme.text }]}>
              Booking Feature Coming Soon
            </Text>
            <Text style={[styles.comingSoonDescription, { color: theme.textSecondary }]}>
              We're working hard to bring you a seamless booking experience. Soon you'll be able to:
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Select your preferred dates
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Attach your campaign creative
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Submit booking requests to owners
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Pay securely through the platform
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Notify Me When Available"
            onPress={handleRequestBooking}
            variant="primary"
            fullWidth
            leftIcon={<Ionicons name="notifications-outline" size={20} color={colors.white} />}
          />
          <Button
            title="Go Back to Space"
            onPress={() => router.back()}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  errorText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  spaceTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  ownerName: {
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  priceLabel: {
    fontSize: fontSize.sm,
  },
  priceValue: {
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  durationText: {
    fontSize: fontSize.sm,
  },
  comingSoonCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryLight,
  },
  comingSoonContent: {
    alignItems: "center",
    gap: spacing.md,
  },
  comingSoonTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    textAlign: "center",
  },
  comingSoonDescription: {
    fontSize: fontSize.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  featureList: {
    width: "100%",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  featureText: {
    fontSize: fontSize.sm,
    flex: 1,
  },
  actions: {
    gap: spacing.md,
  },
});
