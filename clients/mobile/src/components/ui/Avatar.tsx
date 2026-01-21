import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { colors, fontSize } from "@/constants/theme";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

/**
 * Avatar - User avatar display
 * Shows image if available, otherwise initials fallback
 */
export default function Avatar({
  source,
  name = "",
  size = "md",
  style,
}: AvatarProps) {
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(" ");
    if (names.length === 0) return "?";
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getDimensions = () => {
    switch (size) {
      case "sm":
        return { dimension: 32, fontSize: fontSize.xs };
      case "md":
        return { dimension: 48, fontSize: fontSize.md };
      case "lg":
        return { dimension: 64, fontSize: fontSize.xl };
      case "xl":
        return { dimension: 96, fontSize: fontSize.xxxl };
    }
  };

  const { dimension, fontSize: textSize } = getDimensions();

  const sizeStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
  };

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={[
          styles.image,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
          },
        ]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[styles.container, sizeStyle, styles.fallback, style]}>
      <Text style={[styles.initials, { fontSize: textSize }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  image: {
    overflow: "hidden",
  },
  fallback: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: colors.white,
    fontWeight: "600",
  },
});
