import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, fontSize, borderRadius, colors } from '@/constants/theme';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  leftIconColor?: string;
  rightElement?: 'chevron' | 'toggle' | React.ReactNode;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  onPress?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  showBorder?: boolean;
}

/**
 * ListItem - Settings/menu row component
 * Icon + label + optional chevron/toggle/custom element
 */
export default function ListItem({
  title,
  subtitle,
  leftIcon,
  leftIconColor,
  rightElement = 'chevron',
  toggleValue,
  onToggleChange,
  onPress,
  destructive = false,
  disabled = false,
  showBorder = true,
}: ListItemProps) {
  const { theme } = useTheme();

  const textColor = destructive
    ? colors.error
    : disabled
    ? theme.textMuted
    : theme.text;

  const iconColor = leftIconColor || (destructive ? colors.error : theme.textSecondary);

  const renderRightElement = () => {
    if (rightElement === 'chevron') {
      return (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.textMuted}
        />
      );
    }
    if (rightElement === 'toggle') {
      return (
        <Switch
          value={toggleValue}
          onValueChange={onToggleChange}
          trackColor={{ false: colors.gray300, true: colors.primary }}
          thumbColor={colors.white}
          disabled={disabled}
        />
      );
    }
    return rightElement;
  };

  const content = (
    <View
      style={[
        styles.container,
        showBorder && { borderBottomColor: theme.border },
        showBorder && styles.border,
      ]}
    >
      {leftIcon && (
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <Ionicons name={leftIcon} size={20} color={iconColor} />
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {renderRightElement()}
    </View>
  );

  if (onPress && rightElement !== 'toggle') {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
});
