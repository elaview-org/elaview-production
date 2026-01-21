import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Button - Reusable button component following Elaview design system
 * Primary: Black background, white text
 * Secondary: Blue background, white text
 * Outline: White background, blue border, blue text
 * Ghost: Transparent background, primary text
 */
export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.gray300;
    switch (variant) {
      case "primary":
        return colors.black;
      case "secondary":
        return colors.primary;
      case "outline":
      case "ghost":
        return "transparent";
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.gray500;
    switch (variant) {
      case "primary":
      case "secondary":
        return colors.white;
      case "outline":
        return colors.primary;
      case "ghost":
        return theme.text;
    }
  };

  const getBorderStyle = () => {
    if (variant === "outline") {
      return {
        borderWidth: 1,
        borderColor: disabled ? colors.gray300 : colors.primary,
      };
    }
    return {};
  };

  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return styles.sizeSm;
      case "lg":
        return styles.sizeLg;
      default:
        return styles.sizeMd;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return styles.textSm;
      case "lg":
        return styles.textLg;
      default:
        return styles.textMd;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSizeStyle(),
        { backgroundColor: getBackgroundColor() },
        getBorderStyle(),
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.text,
              getTextSize(),
              { color: getTextColor() },
              leftIcon ? styles.textWithLeftIcon : undefined,
              rightIcon ? styles.textWithRightIcon : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
  },
  sizeSm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sizeMd: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sizeLg: {
    paddingVertical: spacing.lg - 4,
    paddingHorizontal: spacing.xl,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    fontWeight: "600",
  },
  textSm: {
    fontSize: fontSize.sm,
  },
  textMd: {
    fontSize: fontSize.md,
  },
  textLg: {
    fontSize: fontSize.lg,
  },
  textWithLeftIcon: {
    marginLeft: spacing.sm,
  },
  textWithRightIcon: {
    marginRight: spacing.sm,
  },
});
