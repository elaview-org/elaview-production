import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter, Href } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useSession } from "@/contexts/SessionContext";
import { ProfileType } from "@/types/graphql";
import Avatar from "@/components/ui/Avatar";
import ListItem from "@/components/ui/ListItem";
import Card from "@/components/ui/Card";
import { spacing, fontSize, colors } from "@/constants/theme";
import { User, PaymentMethod } from "@/mocks/user";

interface ProfileContentProps {
  user: User;
  paymentMethods?: PaymentMethod[];
  perspective: "owner" | "advertiser";
}

export default function ProfileContent({
  user,
  paymentMethods = [],
  perspective,
}: ProfileContentProps) {
  const { theme } = useTheme();
  const { switchProfile, logout } = useSession();
  const router = useRouter();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchRole = async () => {
    if (isSwitching) return;
    setIsSwitching(true);
    try {
      const targetType =
        perspective === "advertiser"
          ? ProfileType.SpaceOwner
          : ProfileType.Advertiser;
      await switchProfile(targetType);
      const route =
        targetType === ProfileType.Advertiser
          ? "/(protected)/(advertiser)/discover"
          : "/(protected)/(owner)/listings";
      router.replace(route as Href);
    } catch (error) {
      console.error("Failed to switch profile:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* User Header */}
      <View style={styles.header}>
        <Avatar source={user.avatarUrl} name={user.fullName} size="xl" />
        <Text style={[styles.name, { color: theme.text }]}>
          {user.fullName}
        </Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>
          {user.email}
        </Text>
        {user.phone && (
          <Text style={[styles.phone, { color: theme.textSecondary }]}>
            {user.phone}
          </Text>
        )}
      </View>

      {/* Role Badge */}
      <View
        style={[styles.roleBadge, { backgroundColor: colors.primaryLight }]}
      >
        <Text style={styles.roleText}>
          {perspective === "advertiser"
            ? "📣 Advertiser Mode"
            : "🏠 Owner Mode"}
        </Text>
      </View>

      {/* Account Section */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          ACCOUNT
        </Text>
        <ListItem
          title="Edit Profile"
          leftIcon="person-outline"
          onPress={() => {}}
        />
        <ListItem
          title="Payment Methods"
          leftIcon="card-outline"
          subtitle={
            paymentMethods.length > 0
              ? `${paymentMethods.length} card(s) saved`
              : "No cards added"
          }
          onPress={() => {}}
        />
        <ListItem
          title="Notifications"
          leftIcon="notifications-outline"
          onPress={() => {}}
        />
        <ListItem
          title="Security"
          leftIcon="lock-closed-outline"
          onPress={() => {}}
          showBorder={false}
        />
      </Card>

      {/* Preferences Section */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          PREFERENCES
        </Text>
        <ListItem
          title="Appearance"
          leftIcon="moon-outline"
          subtitle="System default"
          onPress={() => {}}
        />
        <ListItem
          title="Language"
          leftIcon="globe-outline"
          subtitle="English"
          onPress={() => {}}
          showBorder={false}
        />
      </Card>

      {/* Support Section */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          SUPPORT
        </Text>
        <ListItem
          title="Help Center"
          leftIcon="help-circle-outline"
          onPress={() => router.push("/help")}
        />
        <ListItem
          title="Contact Support"
          leftIcon="mail-outline"
          onPress={() => {}}
        />
        <ListItem
          title="Terms of Service"
          leftIcon="document-text-outline"
          onPress={() => {}}
        />
        <ListItem
          title="Privacy Policy"
          leftIcon="shield-checkmark-outline"
          onPress={() => {}}
          showBorder={false}
        />
      </Card>

      {/* Actions Section */}
      <Card style={styles.section}>
        <ListItem
          title={`Switch to ${perspective === "advertiser" ? "Owner" : "Advertiser"} Mode`}
          leftIcon="swap-horizontal-outline"
          leftIconColor={colors.primary}
          onPress={handleSwitchRole}
        />
        <ListItem
          title="Log Out"
          leftIcon="log-out-outline"
          onPress={handleLogout}
          destructive
          showBorder={false}
        />
      </Card>

      {/* App Version */}
      <Text style={[styles.version, { color: theme.textMuted }]}>
        Elaview v1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    marginTop: spacing.md,
  },
  email: {
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },
  phone: {
    fontSize: fontSize.sm,
    marginTop: 4,
  },
  roleBadge: {
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginBottom: spacing.lg,
  },
  roleText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  section: {
    marginBottom: spacing.md,
    padding: 0,
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    letterSpacing: 0.5,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  version: {
    fontSize: fontSize.xs,
    textAlign: "center",
    marginTop: spacing.md,
  },
});
