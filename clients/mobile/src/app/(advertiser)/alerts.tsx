import { useState, useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import NotificationCard from '@/components/features/notifications/NotificationCard';
import EmptyNotifications from '@/components/features/notifications/EmptyNotifications';
import { mockNotifications, markAsRead as markAsReadHelper } from '@/mocks/notifications';
import { Notification } from '@/types/notifications';

export default function Alerts() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate fetching fresh notifications
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Simulate API call
    setTimeout(() => {
      // In production, this would fetch from API
      setNotifications(mockNotifications);
      setRefreshing(false);
    }, 1000);
  }, []);

  // Mark notification as read when tapped
  const handleNotificationPress = useCallback((notification: Notification) => {
    if (!notification.read) {
      setNotifications((prev) => markAsReadHelper(prev, notification.id));
    }
  }, []);

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NotificationCard
          notification={item}
          onPress={handleNotificationPress}
        />
      )}
      contentContainerStyle={[
        styles.listContainer,
        notifications.length === 0 && styles.emptyContainer,
      ]}
      ListEmptyComponent={<EmptyNotifications />}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.textMuted}
        />
      }
      style={[styles.container, { backgroundColor: theme.background }]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
  },
});
