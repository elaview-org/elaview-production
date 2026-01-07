import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  /** Adds blue border (used for selected/interactive cards) */
  highlighted?: boolean;
  /** Removes shadow */
  flat?: boolean;
  /** Custom padding */
  padding?: number;
}

/**
 * Card - Reusable card component with shadow and border options
 * Following Elaview design: borderRadius 12, subtle shadow, white background
 */
export default function Card({
  children,
  style,
  onPress,
  highlighted = false,
  flat = false,
  padding = spacing.md,
}: CardProps) {
  const { theme, isDark } = useTheme();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.card,
      padding,
    },
    highlighted && styles.highlighted,
    !flat && !isDark && styles.shadow,
    !flat && isDark && styles.darkBorder,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  darkBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  highlighted: {
    borderWidth: 1,
    borderColor: '#0088FF',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
