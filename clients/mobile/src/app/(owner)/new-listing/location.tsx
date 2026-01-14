import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { spacing, fontSize, colors, borderRadius } from '@/constants/theme';

// US States for picker
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

/**
 * Step 3: Location
 * Enter address and location details
 * TODO: Add map picker with expo-location and react-native-maps
 */
export default function NewListingLocation() {
  const { theme } = useTheme();
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [errors, setErrors] = useState<{
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }>({});

  const validateAndContinue = () => {
    const newErrors: typeof errors = {};

    if (!address.trim()) {
      newErrors.address = 'Please enter the street address';
    }
    if (!city.trim()) {
      newErrors.city = 'Please enter the city';
    }
    if (!state.trim()) {
      newErrors.state = 'Please enter the state';
    } else if (!US_STATES.includes(state.toUpperCase())) {
      newErrors.state = 'Please enter a valid US state abbreviation';
    }
    if (!zipCode.trim()) {
      newErrors.zipCode = 'Please enter the ZIP code';
    } else if (!/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // TODO: Store in context/state management and geocode address
      router.push({
        pathname: '/(owner)/new-listing/pricing',
        params: {
          address: address.trim(),
          city: city.trim(),
          state: state.toUpperCase().trim(),
          zipCode: zipCode.trim(),
        },
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotCompleted]} />
          <View style={[styles.progressLine, styles.progressLineCompleted]} />
          <View style={[styles.progressDot, styles.progressDotCompleted]} />
          <View style={[styles.progressLine, styles.progressLineCompleted]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressLine, { backgroundColor: theme.border }]} />
          <View style={[styles.progressDot, { borderColor: theme.border }]} />
          <View style={[styles.progressLine, { backgroundColor: theme.border }]} />
          <View style={[styles.progressDot, { borderColor: theme.border }]} />
        </View>

        {/* Instructions */}
        <Text style={[styles.title, { color: theme.text }]}>
          Where is your space located?
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Enter the address of your advertising space. This helps advertisers find local opportunities.
        </Text>

        {/* Address Input */}
        <Text style={[styles.label, { color: theme.text }]}>Street Address</Text>
        <Input
          placeholder="123 Main Street"
          value={address}
          onChangeText={(text) => {
            setAddress(text);
            setErrors((prev) => ({ ...prev, address: undefined }));
          }}
          error={errors.address}
          leftIcon="location-outline"
          autoComplete="street-address"
        />

        {/* City Input */}
        <Text style={[styles.label, { color: theme.text }]}>City</Text>
        <Input
          placeholder="San Francisco"
          value={city}
          onChangeText={(text) => {
            setCity(text);
            setErrors((prev) => ({ ...prev, city: undefined }));
          }}
          error={errors.city}
          autoComplete="postal-address"
        />

        {/* State & ZIP Row */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={[styles.label, { color: theme.text }]}>State</Text>
            <Input
              placeholder="CA"
              value={state}
              onChangeText={(text) => {
                setState(text.toUpperCase().slice(0, 2));
                setErrors((prev) => ({ ...prev, state: undefined }));
              }}
              error={errors.state}
              maxLength={2}
              autoCapitalize="characters"
              autoComplete="postal-address"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={[styles.label, { color: theme.text }]}>ZIP Code</Text>
            <Input
              placeholder="94102"
              value={zipCode}
              onChangeText={(text) => {
                setZipCode(text.replace(/[^\d-]/g, '').slice(0, 10));
                setErrors((prev) => ({ ...prev, zipCode: undefined }));
              }}
              error={errors.zipCode}
              keyboardType="number-pad"
              maxLength={10}
              autoComplete="postal-code"
            />
          </View>
        </View>

        {/* Map Preview Placeholder */}
        <View style={[styles.mapPlaceholder, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
          <Text style={[styles.mapPlaceholderText, { color: theme.textMuted }]}>
            📍 Map preview will appear here
          </Text>
          <Text style={[styles.mapPlaceholderHint, { color: theme.textMuted }]}>
            TODO: Integrate react-native-maps with expo-location
          </Text>
        </View>

        {/* Tips */}
        <View style={[styles.tipsContainer, { backgroundColor: theme.backgroundSecondary }]}>
          <Text style={[styles.tipsTitle, { color: theme.text }]}>
            📍 Location Tips
          </Text>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            • Use the exact street address where the space is visible
          </Text>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            • Cross streets help advertisers find your location
          </Text>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            • Accurate locations get more booking requests
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomActions, { borderTopColor: theme.border }]}>
        <Button
          title="Continue"
          onPress={validateAndContinue}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  progressDotCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  progressLine: {
    width: 24,
    height: 2,
    marginHorizontal: 4,
  },
  progressLineCompleted: {
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  mapPlaceholder: {
    height: 160,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  mapPlaceholderText: {
    fontSize: fontSize.md,
    marginBottom: spacing.xs,
  },
  mapPlaceholderHint: {
    fontSize: fontSize.xs,
  },
  tipsContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  tipsTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: 4,
  },
  bottomActions: {
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
