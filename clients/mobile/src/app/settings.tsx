import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Card from '@/components/ui/Card';
import ListItem from '@/components/ui/ListItem';
import { spacing, fontSize, colors } from '@/constants/theme';

export default function Settings() {
  const { theme, isDark, setThemeMode } = useTheme();
  const router = useRouter();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear cached data and images. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          APPEARANCE
        </Text>
        <Card style={styles.section}>
          <ListItem
            title="Dark Mode"
            leftIcon="moon-outline"
            rightElement="toggle"
            toggleValue={isDark}
            onToggleChange={(value) => setThemeMode(value ? 'dark' : 'light')}
            showBorder={false}
          />
        </Card>

        {/* Notifications */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          NOTIFICATIONS
        </Text>
        <Card style={styles.section}>
          <ListItem
            title="Push Notifications"
            leftIcon="notifications-outline"
            rightElement="toggle"
            toggleValue={pushNotifications}
            onToggleChange={setPushNotifications}
          />
          <ListItem
            title="Email Notifications"
            leftIcon="mail-outline"
            rightElement="toggle"
            toggleValue={emailNotifications}
            onToggleChange={setEmailNotifications}
          />
          <ListItem
            title="Booking Updates"
            leftIcon="calendar-outline"
            rightElement="toggle"
            toggleValue={bookingUpdates}
            onToggleChange={setBookingUpdates}
          />
          <ListItem
            title="Marketing Emails"
            leftIcon="megaphone-outline"
            rightElement="toggle"
            toggleValue={marketingEmails}
            onToggleChange={setMarketingEmails}
            showBorder={false}
          />
        </Card>

        {/* Privacy */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          PRIVACY & SECURITY
        </Text>
        <Card style={styles.section}>
          <ListItem
            title="Change Password"
            leftIcon="lock-closed-outline"
            onPress={() => {}}
          />
          <ListItem
            title="Two-Factor Authentication"
            leftIcon="shield-checkmark-outline"
            subtitle="Not enabled"
            onPress={() => {}}
          />
          <ListItem
            title="Login Activity"
            leftIcon="time-outline"
            onPress={() => {}}
            showBorder={false}
          />
        </Card>

        {/* Data */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          DATA
        </Text>
        <Card style={styles.section}>
          <ListItem
            title="Clear Cache"
            leftIcon="trash-outline"
            onPress={handleClearCache}
          />
          <ListItem
            title="Download My Data"
            leftIcon="download-outline"
            onPress={() => {}}
          />
          <ListItem
            title="Delete Account"
            leftIcon="warning-outline"
            onPress={() => {}}
            destructive
            showBorder={false}
          />
        </Card>

        {/* About */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          ABOUT
        </Text>
        <Card style={styles.section}>
          <ListItem
            title="App Version"
            leftIcon="information-circle-outline"
            rightElement={
              <Text style={[styles.versionText, { color: theme.textMuted }]}>
                1.0.0
              </Text>
            }
            showBorder={false}
          />
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    marginLeft: spacing.xs,
  },
  section: {
    padding: 0,
  },
  versionText: {
    fontSize: fontSize.sm,
  },
});
