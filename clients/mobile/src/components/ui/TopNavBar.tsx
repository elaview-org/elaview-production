import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { colors } from '@/constants/theme';

interface TopNavBarProps {
  onMenuPress: () => void;
  onCartPress?: () => void;
}

export default function TopNavBar({ onMenuPress, onCartPress }: TopNavBarProps) {
  const { theme } = useTheme();
  const { role } = useRole();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
          paddingTop: insets.top + 12, // Add safe area top inset
        }
      ]}
    >
      <Text style={[styles.logo, { color: theme.text }]}>ELAVIEW</Text>

      <View style={styles.rightActions}>
        {role === 'advertiser' && onCartPress && (
          <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
            <Ionicons name="cart-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Ionicons name="menu" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
});
