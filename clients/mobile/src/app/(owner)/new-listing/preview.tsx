import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import Button from '@/components/ui/Button';
import { spacing, fontSize, colors, borderRadius } from '@/constants/theme';

/**
 * Step 5: Preview & Submit
 * Review all listing details before publishing
 */
export default function NewListingPreview() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In a real app, we'd get this from context/state management
  // For now, we're receiving pricing params from the previous step
  const { dailyRate, weeklyRate, monthlyRate, width, height, unit } = params;

  // Placeholder data - would come from shared state
  const previewData = {
    photos: [
      'https://via.placeholder.com/400x300',
      'https://via.placeholder.com/400x300',
    ],
    spaceType: 'Storefront Window',
    title: 'Premium Downtown Window Space',
    description:
      'High-traffic location on Main Street. Perfect for brand awareness campaigns.',
    address: '123 Main St, San Francisco, CA 94102',
    dailyRate: dailyRate || '25',
    weeklyRate: weeklyRate || '150',
    monthlyRate: monthlyRate || '500',
    dimensions: {
      width: width || '48',
      height: height || '36',
      unit: unit || 'in',
    },
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // TODO: Call GraphQL mutation to create listing
      // await createSpace({ ... });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        '🎉 Listing Created!',
        'Your space is now live and visible to advertisers.',
        [
          {
            text: 'View Listings',
            onPress: () => router.replace('/(owner)/listings'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to create listing. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (step: string) => {
    // Navigate back to specific step to edit
    switch (step) {
      case 'photos':
        router.push('/(owner)/new-listing');
        break;
      case 'details':
        router.push('/(owner)/new-listing/details');
        break;
      case 'location':
        router.push('/(owner)/new-listing/location');
        break;
      case 'pricing':
        router.push('/(owner)/new-listing/pricing');
        break;
    }
  };

  const PreviewSection = ({
    title,
    editStep,
    children,
  }: {
    title: string;
    editStep: string;
    children: React.ReactNode;
  }) => (
    <View style={[styles.section, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
        <Button
          title="Edit"
          variant="ghost"
          size="sm"
          onPress={() => handleEdit(editStep)}
        />
      </View>
      {children}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator - All Complete */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4, 5].map((step, index) => (
            <View key={step} style={styles.progressStep}>
              {index > 0 && (
                <View style={[styles.progressLine, styles.progressLineCompleted]} />
              )}
              <View style={[styles.progressDot, styles.progressDotCompleted]}>
                <Ionicons name="checkmark" size={8} color={colors.white} />
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.pageTitle, { color: theme.text }]}>
          Review Your Listing
        </Text>
        <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
          Make sure everything looks good before publishing.
        </Text>

        {/* Photos Preview */}
        <PreviewSection title="📸 Photos" editStep="photos">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photosRow}
          >
            {previewData.photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.previewPhoto}
              />
            ))}
          </ScrollView>
        </PreviewSection>

        {/* Details Preview */}
        <PreviewSection title="📝 Details" editStep="details">
          <View style={styles.detailRow}>
            <Ionicons name="pricetag-outline" size={18} color={theme.textMuted} />
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {previewData.spaceType}
            </Text>
          </View>
          <Text style={[styles.previewTitle, { color: theme.text }]}>
            {previewData.title}
          </Text>
          <Text style={[styles.previewDescription, { color: theme.textSecondary }]}>
            {previewData.description}
          </Text>
        </PreviewSection>

        {/* Location Preview */}
        <PreviewSection title="📍 Location" editStep="location">
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color={theme.textMuted} />
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {previewData.address}
            </Text>
          </View>
        </PreviewSection>

        {/* Pricing Preview */}
        <PreviewSection title="💰 Pricing & Size" editStep="pricing">
          <View style={styles.pricingGrid}>
            <View style={styles.priceBox}>
              <Text style={[styles.priceLabel, { color: theme.textMuted }]}>Daily</Text>
              <Text style={[styles.priceValue, { color: theme.text }]}>
                ${previewData.dailyRate}
              </Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={[styles.priceLabel, { color: theme.textMuted }]}>Weekly</Text>
              <Text style={[styles.priceValue, { color: theme.text }]}>
                ${previewData.weeklyRate}
              </Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={[styles.priceLabel, { color: theme.textMuted }]}>Monthly</Text>
              <Text style={[styles.priceValue, { color: theme.text }]}>
                ${previewData.monthlyRate}
              </Text>
            </View>
          </View>
          <View style={[styles.dimensionsBadge, { backgroundColor: theme.backgroundSecondary }]}>
            <Ionicons name="expand-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.dimensionsText, { color: theme.textSecondary }]}>
              {previewData.dimensions.width} × {previewData.dimensions.height}{' '}
              {previewData.dimensions.unit}
            </Text>
          </View>
        </PreviewSection>

        {/* Terms Notice */}
        <View style={[styles.termsNotice, { borderColor: theme.border }]}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.termsText, { color: theme.textSecondary }]}>
            By publishing, you agree to our Terms of Service and Listing Guidelines.
            Your space will be reviewed within 24 hours.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { borderTopColor: theme.border }]}>
        <Button
          title="Save as Draft"
          variant="outline"
          onPress={() => {
            Alert.alert('Saved', 'Your listing has been saved as a draft.');
            router.replace('/(owner)/listings');
          }}
          style={styles.draftButton}
        />
        <Button
          title={isSubmitting ? 'Publishing...' : '🚀 Publish Listing'}
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={styles.publishButton}
        />
      </View>

      {/* Loading Overlay */}
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingCard, { backgroundColor: theme.card }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: theme.text }]}>
              Creating your listing...
            </Text>
          </View>
        </View>
      )}
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
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotCompleted: {
    backgroundColor: colors.primary,
  },
  progressLine: {
    width: 24,
    height: 2,
    marginHorizontal: 4,
  },
  progressLineCompleted: {
    backgroundColor: colors.primary,
  },
  pageTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  pageSubtitle: {
    fontSize: fontSize.md,
    marginBottom: spacing.lg,
  },
  section: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  photosRow: {
    gap: spacing.sm,
  },
  previewPhoto: {
    width: 120,
    height: 90,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray200,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: fontSize.sm,
    flex: 1,
  },
  previewTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  previewDescription: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  pricingGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  priceBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '10',
  },
  priceLabel: {
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  dimensionsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  dimensionsText: {
    fontSize: fontSize.sm,
  },
  termsNotice: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  termsText: {
    flex: 1,
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  draftButton: {
    flex: 1,
  },
  publishButton: {
    flex: 2,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
});
