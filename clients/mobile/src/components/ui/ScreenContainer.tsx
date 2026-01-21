import { View, StyleSheet, ViewStyle, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
  /** If true, uses regular View instead of SafeAreaView */
  unsafe?: boolean;
}

/**
 * ScreenContainer - Consistent screen wrapper with theme support
 * Use this as the root component for all screens
 */
export default function ScreenContainer({
  children,
  style,
  edges = ["bottom"],
  unsafe = false,
}: ScreenContainerProps) {
  const { theme, isDark } = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: theme.background },
    style,
  ];

  if (unsafe) {
    return (
      <>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View style={containerStyle}>{children}</View>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={containerStyle} edges={edges}>
        {children}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
