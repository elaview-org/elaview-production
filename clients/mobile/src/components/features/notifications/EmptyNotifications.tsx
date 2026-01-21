import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { colors, spacing, fontSize } from "@/constants/theme";

export default function EmptyNotifications() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons
        name="notifications-off-outline"
        size={80}
        color={theme.textMuted}
      />
      <Text style={[styles.title, { color: theme.text }]}>
        No notifications yet
      </Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        When you receive booking updates, payment confirmations, or installation
        alerts, they'll appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl * 2,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  description: {
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 22,
  },
});
