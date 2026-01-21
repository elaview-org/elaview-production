import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ApolloWrapper } from "@/api";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { colors, spacing, fontSize } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

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

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <ApolloWrapper>
        <SessionProvider>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(protected)" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="help" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </SessionProvider>
      </ApolloWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
