import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import MessagesList from '@/components/features/MessagesList';
import { mockConversations } from '@/mocks/messages';

export default function Messages() {
  const { theme } = useTheme();


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MessagesList conversations={mockConversations} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
