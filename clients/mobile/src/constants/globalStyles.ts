import { StyleSheet } from "react-native";
import { spacing, fontSize, borderRadius } from "./theme";

// Reusable style patterns
export const globalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Spacing
  paddingHorizontal: {
    paddingHorizontal: spacing.lg,
  },
  paddingVertical: {
    paddingVertical: spacing.md,
  },
  padding: {
    padding: spacing.lg,
  },

  // Typography
  textCenter: {
    textAlign: "center",
  },
});

// Helper to create themed input styles
export const createInputStyles = (theme: {
  backgroundSecondary: string;
  borderFocus: string;
  text: string;
  textMuted: string;
}) =>
  StyleSheet.create({
    input: {
      backgroundColor: theme.backgroundSecondary,
      borderWidth: 1,
      borderColor: theme.borderFocus,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: fontSize.md,
      color: theme.text,
    },
  });

// Helper to create themed button styles
export const createButtonStyles = (theme: { primary: string; text: string }) =>
  StyleSheet.create({
    primary: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: "center",
    },
    primaryText: {
      color: "#FFFFFF",
      fontSize: fontSize.md,
      fontWeight: "600",
    },
    secondary: {
      backgroundColor: "transparent",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.primary,
      alignItems: "center",
    },
    secondaryText: {
      color: theme.primary,
      fontSize: fontSize.md,
      fontWeight: "600",
    },
  });
