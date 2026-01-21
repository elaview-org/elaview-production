import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { spacing, fontSize, colors, borderRadius } from "@/constants/theme";

type DimensionUnit = "in" | "ft" | "cm" | "m";

const DIMENSION_UNITS: { value: DimensionUnit; label: string }[] = [
  { value: "in", label: "Inches" },
  { value: "ft", label: "Feet" },
  { value: "cm", label: "cm" },
  { value: "m", label: "Meters" },
];

/**
 * Step 4: Pricing & Dimensions
 * Set daily rate and space dimensions
 */
export default function NewListingPricing() {
  const { theme } = useTheme();
  const router = useRouter();
  const [dailyRate, setDailyRate] = useState("");
  const [weeklyRate, setWeeklyRate] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState<DimensionUnit>("in");
  const [errors, setErrors] = useState<{
    dailyRate?: string;
    width?: string;
    height?: string;
  }>({});

  // Auto-calculate suggested rates
  const suggestWeeklyRate = (daily: number) => Math.round(daily * 6); // ~15% discount
  const suggestMonthlyRate = (daily: number) => Math.round(daily * 22); // ~27% discount

  const handleDailyRateChange = (text: string) => {
    const cleaned = text.replace(/[^\d.]/g, "");
    setDailyRate(cleaned);
    setErrors((prev) => ({ ...prev, dailyRate: undefined }));

    const amount = parseFloat(cleaned);
    if (!isNaN(amount) && amount > 0) {
      if (!weeklyRate) setWeeklyRate(suggestWeeklyRate(amount).toString());
      if (!monthlyRate) setMonthlyRate(suggestMonthlyRate(amount).toString());
    }
  };

  const validateAndContinue = () => {
    const newErrors: typeof errors = {};

    const daily = parseFloat(dailyRate);
    if (!dailyRate || isNaN(daily) || daily <= 0) {
      newErrors.dailyRate = "Please enter a valid daily rate";
    } else if (daily < 5) {
      newErrors.dailyRate = "Minimum daily rate is $5";
    }

    const w = parseFloat(width);
    if (!width || isNaN(w) || w <= 0) {
      newErrors.width = "Please enter width";
    }

    const h = parseFloat(height);
    if (!height || isNaN(h) || h <= 0) {
      newErrors.height = "Please enter height";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // TODO: Store in context/state management
      router.push({
        pathname: "./preview",
        params: {
          dailyRate,
          weeklyRate: weeklyRate || suggestWeeklyRate(daily).toString(),
          monthlyRate: monthlyRate || suggestMonthlyRate(daily).toString(),
          width,
          height,
          unit,
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
          <View style={[styles.progressDot, styles.progressDotCompleted]} />
          <View style={[styles.progressLine, styles.progressLineCompleted]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View
            style={[styles.progressLine, { backgroundColor: theme.border }]}
          />
          <View style={[styles.progressDot, { borderColor: theme.border }]} />
        </View>

        {/* Pricing Section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          💰 Set your pricing
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
          Set competitive rates to attract advertisers. You can always adjust
          later.
        </Text>

        {/* Daily Rate (Required) */}
        <Text style={[styles.label, { color: theme.text }]}>
          Daily Rate <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.priceInputContainer}>
          <Text style={[styles.currencySymbol, { color: theme.text }]}>$</Text>
          <Input
            placeholder="25"
            value={dailyRate}
            onChangeText={handleDailyRateChange}
            keyboardType="decimal-pad"
            error={errors.dailyRate}
            containerStyle={styles.priceInput}
          />
          <Text style={[styles.perUnit, { color: theme.textSecondary }]}>
            /day
          </Text>
        </View>

        {/* Weekly Rate (Optional) */}
        <Text style={[styles.label, { color: theme.text }]}>
          Weekly Rate (optional)
        </Text>
        <View style={styles.priceInputContainer}>
          <Text style={[styles.currencySymbol, { color: theme.text }]}>$</Text>
          <Input
            placeholder={
              dailyRate
                ? suggestWeeklyRate(parseFloat(dailyRate) || 0).toString()
                : "150"
            }
            value={weeklyRate}
            onChangeText={(text) => setWeeklyRate(text.replace(/[^\d.]/g, ""))}
            keyboardType="decimal-pad"
            containerStyle={styles.priceInput}
          />
          <Text style={[styles.perUnit, { color: theme.textSecondary }]}>
            /week
          </Text>
        </View>

        {/* Monthly Rate (Optional) */}
        <Text style={[styles.label, { color: theme.text }]}>
          Monthly Rate (optional)
        </Text>
        <View style={styles.priceInputContainer}>
          <Text style={[styles.currencySymbol, { color: theme.text }]}>$</Text>
          <Input
            placeholder={
              dailyRate
                ? suggestMonthlyRate(parseFloat(dailyRate) || 0).toString()
                : "500"
            }
            value={monthlyRate}
            onChangeText={(text) => setMonthlyRate(text.replace(/[^\d.]/g, ""))}
            keyboardType="decimal-pad"
            containerStyle={styles.priceInput}
          />
          <Text style={[styles.perUnit, { color: theme.textSecondary }]}>
            /month
          </Text>
        </View>

        {/* Dimensions Section */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, marginTop: spacing.xl },
          ]}
        >
          📐 Space Dimensions
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
          Accurate dimensions help advertisers prepare the right creative files.
        </Text>

        {/* Unit Selector */}
        <View style={styles.unitSelector}>
          {DIMENSION_UNITS.map((u) => (
            <TouchableOpacity
              key={u.value}
              style={[
                styles.unitButton,
                {
                  backgroundColor:
                    unit === u.value
                      ? colors.primary
                      : theme.backgroundSecondary,
                  borderColor: unit === u.value ? colors.primary : theme.border,
                },
              ]}
              onPress={() => setUnit(u.value)}
            >
              <Text
                style={[
                  styles.unitButtonText,
                  { color: unit === u.value ? colors.white : theme.text },
                ]}
              >
                {u.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Width & Height */}
        <View style={styles.dimensionRow}>
          <View style={styles.dimensionInput}>
            <Text style={[styles.label, { color: theme.text }]}>
              Width <Text style={styles.required}>*</Text>
            </Text>
            <Input
              placeholder="48"
              value={width}
              onChangeText={(text) => {
                setWidth(text.replace(/[^\d.]/g, ""));
                setErrors((prev) => ({ ...prev, width: undefined }));
              }}
              keyboardType="decimal-pad"
              error={errors.width}
              rightIcon="swap-horizontal-outline"
            />
          </View>
          <View style={styles.dimensionSeparator}>
            <Ionicons name="close" size={20} color={theme.textMuted} />
          </View>
          <View style={styles.dimensionInput}>
            <Text style={[styles.label, { color: theme.text }]}>
              Height <Text style={styles.required}>*</Text>
            </Text>
            <Input
              placeholder="36"
              value={height}
              onChangeText={(text) => {
                setHeight(text.replace(/[^\d.]/g, ""));
                setErrors((prev) => ({ ...prev, height: undefined }));
              }}
              keyboardType="decimal-pad"
              error={errors.height}
              rightIcon="swap-vertical-outline"
            />
          </View>
        </View>

        {/* Dimension Preview */}
        {width && height && (
          <View
            style={[
              styles.dimensionPreview,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Text style={[styles.dimensionPreviewText, { color: theme.text }]}>
              {width} × {height} {unit}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomActions, { borderTopColor: theme.border }]}>
        <Button
          title="Preview Listing"
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "transparent",
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
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "500",
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  required: {
    color: colors.error,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: fontSize.xl,
    fontWeight: "600",
    marginRight: spacing.sm,
  },
  priceInput: {
    flex: 1,
  },
  perUnit: {
    fontSize: fontSize.md,
    marginLeft: spacing.sm,
  },
  unitSelector: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  unitButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  unitButtonText: {
    fontSize: fontSize.sm,
    fontWeight: "500",
  },
  dimensionRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  dimensionInput: {
    flex: 1,
  },
  dimensionSeparator: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
  },
  dimensionPreview: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  dimensionPreviewText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  bottomActions: {
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
