import { useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import TopNavBar from "@/components/ui/TopNavBar";
import DrawerMenu from "@/components/ui/DrawerMenu";
import api from "@/api";
import { colors } from "@/constants/theme";

const GET_UNREAD_COUNT = api.gql`
  query GetUnreadNotificationsCount {
    unreadNotificationsCount
  }
`;

export default function AdvertiserLayout() {
  const { theme } = useTheme();
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Fetch real unread notification count
  const { data } = api.query<{ unreadNotificationsCount: number }>(GET_UNREAD_COUNT, {
    fetchPolicy: "cache-and-network",
    pollInterval: 30_000, // poll every 30s as fallback
  });
  const unreadCount: number = data?.unreadNotificationsCount ?? 0;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
            borderTopWidth: 1,
          },
          header: () => (
            <TopNavBar
              onMenuPress={() => setDrawerVisible(true)}
              onCartPress={() => {
                // TODO: Navigate to cart
              }}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="discover"
          options={{
            title: "Discover",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: "Bookings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="alerts"
          options={{
            title: "Alerts",
            tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="notifications-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="space/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="book/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="booking/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="conversation/[id]"
          options={{
            href: null,
          }}
        />
      </Tabs>

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
  );
}
