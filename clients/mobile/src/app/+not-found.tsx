import { View, Text, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";
import { colors, spacing, fontSize } from "@/constants/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.message}>
          The page you're looking for doesn't exist.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.black,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSize.md,
    color: colors.gray600,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  link: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  linkText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});