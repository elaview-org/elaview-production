import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Slot, useRouter, useSegments, Href } from "expo-router";
import { useSession } from "@/contexts/SessionContext";
import { ProfileType } from "@/types/graphql";
import { colors, spacing, fontSize } from "@/constants/theme";

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <Text style={styles.retryButton} onPress={retry}>
        Try Again
      </Text>
    </View>
  );
}

export default function ProtectedLayout() {
  const { isLoading, isAuthenticated, profileType } = useSession();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }

    if (!profileType) {
      router.replace("/(protected)/profile-select" as Href);
      return;
    }

    const currentGroup = segments[1] as string | undefined;
    const isInAdvertiser = currentGroup === "(advertiser)";
    const isInOwner = currentGroup === "(owner)";
    const shouldBeInOwner = profileType === ProfileType.SpaceOwner;

    if (shouldBeInOwner && isInAdvertiser) {
      router.replace("/(protected)/(owner)/listings" as Href);
    } else if (!shouldBeInOwner && isInOwner) {
      router.replace("/(protected)/(advertiser)/discover" as Href);
    }
  }, [isLoading, isAuthenticated, profileType, segments, router]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  errorTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.black,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontSize: fontSize.md,
    color: colors.gray600,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  retryButton: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.primary,
    padding: spacing.md,
  },
});