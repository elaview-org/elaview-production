import { useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useSession } from "@/contexts/SessionContext";
import api from "@/api";
import NotificationCard from "@/components/features/notifications/NotificationCard";
import EmptyNotifications from "@/components/features/notifications/EmptyNotifications";
import { NotificationNode } from "@/types/notifications";
import { colors, spacing, fontSize } from "@/constants/theme";

const GET_MY_NOTIFICATIONS = api.gql`
  query GetOwnerNotifications($first: Int, $after: String) {
    myNotifications(
      first: $first
      after: $after
      order: { createdAt: DESC }
    ) {
      edges {
        cursor
        node {
          id
          type
          title
          body
          entityType
          entityId
          isRead
          readAt
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const MARK_NOTIFICATION_READ = api.gql`
  mutation MarkOwnerNotificationRead($input: MarkNotificationReadInput!) {
    markNotificationRead(input: $input) {
      notification {
        id
        isRead
        readAt
      }
      errors {
        ... on NotFoundError {
          message
        }
      }
    }
  }
`;

const MARK_ALL_READ = api.gql`
  mutation MarkAllOwnerNotificationsRead {
    markAllNotificationsRead {
      count
    }
  }
`;

const ON_NOTIFICATION = api.gql`
  subscription OnOwnerNotification($userId: ID!) {
    onNotification(userId: $userId) {
      id
      type
      title
      body
      entityType
      entityId
      isRead
      readAt
      createdAt
    }
  }
`;

export default function OwnerAlerts() {
  const { theme } = useTheme();
  const { user } = useSession();

  const { data, loading, refetch, fetchMore } = api.query<{ myNotifications: any }>(GET_MY_NOTIFICATIONS, {
    variables: { first: 20 },
    fetchPolicy: "cache-and-network",
  });

  // Real-time: subscribe to new notifications
  api.subscription(ON_NOTIFICATION, {
    variables: { userId: user?.id ?? "" },
    skip: !user?.id,
    onData: () => {
      refetch();
    },
  });

  const [markRead] = api.mutation(MARK_NOTIFICATION_READ);
  const [markAllRead] = api.mutation(MARK_ALL_READ);

  const edges = data?.myNotifications?.edges ?? [];
  const notifications: NotificationNode[] = edges.map((e: any) => e.node);
  const pageInfo = data?.myNotifications?.pageInfo;

  const handleNotificationPress = useCallback(
    (notification: NotificationNode) => {
      if (!notification.isRead) {
        markRead({
          variables: { input: { id: notification.id } },
          optimisticResponse: {
            markNotificationRead: {
              notification: {
                __typename: "Notification",
                id: notification.id,
                isRead: true,
                readAt: new Date().toISOString(),
              },
              errors: null,
            },
          },
        });
      }
    },
    [markRead],
  );

  const handleMarkAllRead = useCallback(() => {
    markAllRead({
      update: (cache) => {
        notifications.forEach((n) => {
          if (!n.isRead) {
            cache.modify({
              id: cache.identify({ __typename: "Notification", id: n.id }),
              fields: {
                isRead: () => true,
                readAt: () => new Date().toISOString(),
              },
            });
          }
        });
      },
    });
  }, [markAllRead, notifications]);

  const handleLoadMore = useCallback(() => {
    if (pageInfo?.hasNextPage) {
      fetchMore({
        variables: { after: pageInfo.endCursor },
      });
    }
  }, [fetchMore, pageInfo]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading && notifications.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {unreadCount > 0 && (
        <TouchableOpacity
          style={[styles.markAllRow, { borderBottomColor: theme.border }]}
          onPress={handleMarkAllRead}
        >
          <Text style={[styles.markAllText, { color: colors.primary }]}>
            Mark all as read ({unreadCount})
          </Text>
        </TouchableOpacity>
      )}
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
            refreshing={loading}
            onRefresh={() => refetch()}
            tintColor={theme.textMuted}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
  },
  markAllRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    alignItems: "flex-end",
  },
  markAllText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
});
