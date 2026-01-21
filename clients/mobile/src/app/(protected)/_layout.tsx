import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { useSession } from "@/contexts/SessionContext";
import { ProfileType } from "@/types/graphql";
import { colors } from "@/constants/theme";

export default function ProtectedLayout() {
  const { user, isLoading, isAuthenticated, profileType } = useSession();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }

    if (!profileType) {
      router.replace("/(protected)/profile-select" as any);
      return;
    }

    const currentGroup = segments[1] as string | undefined;
    const isInAdvertiser = currentGroup === "(advertiser)";
    const isInOwner = currentGroup === "(owner)";
    const shouldBeInOwner = profileType === ProfileType.SpaceOwner;

    if (shouldBeInOwner && isInAdvertiser) {
      router.replace("/(protected)/(owner)/listings" as any);
    } else if (!shouldBeInOwner && isInOwner) {
      router.replace("/(protected)/(advertiser)/discover" as any);
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
});