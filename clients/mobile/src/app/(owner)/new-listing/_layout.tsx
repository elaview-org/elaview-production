import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@/constants/theme';

/**
 * New Listing Stack Layout
 * Multi-step flow for creating a new space listing
 * Steps: Photos → Details → Location → Pricing → Preview
 */
export default function NewListingLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Add Photos',
          headerBackTitle: 'Cancel',
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: 'Space Details',
          headerBackTitle: 'Photos',
        }}
      />
      <Stack.Screen
        name="location"
        options={{
          title: 'Location',
          headerBackTitle: 'Details',
        }}
      />
      <Stack.Screen
        name="pricing"
        options={{
          title: 'Pricing',
          headerBackTitle: 'Location',
        }}
      />
      <Stack.Screen
        name="preview"
        options={{
          title: 'Review & Publish',
          headerBackTitle: 'Pricing',
        }}
      />
    </Stack>
  );
}
