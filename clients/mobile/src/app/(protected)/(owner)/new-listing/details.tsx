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
import { SpaceType, spaceTypeLabels, spaceTypeIcons } from "@/mocks/spaces";

const spaceTypes: SpaceType[] = [
  "window",
  "storefront",
  "wall",
  "poster",
  "billboard",
  "digital_screen",
  "vehicle",
  "other",
];

/**
 * Step 2: Space Details
 * Enter space type, title, and description
 */
export default function NewListingDetails() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<SpaceType | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ type?: string; title?: string }>({});

  const validateAndContinue = () => {
    const newErrors: typeof errors = {};

    if (!selectedType) {
      newErrors.type = "Please select a space type";
    }
    if (!title.trim()) {
      newErrors.title = "Please enter a title";
    } else if (title.trim().length < 10) {
      newErrors.title = "Title should be at least 10 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // TODO: Store in context/state management
      router.push({
        pathname: "/(owner)/new-listing/location",
        params: { type: selectedType, title: title.trim() },
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
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View
            style={[styles.progressLine, { backgroundColor: theme.border }]}
          />
          <View style={[styles.progressDot, { borderColor: theme.border }]} />
          <View
            style={[styles.progressLine, { backgroundColor: theme.border }]}
          />
          <View style={[styles.progressDot, { borderColor: theme.border }]} />
          <View
            style={[styles.progressLine, { backgroundColor: theme.border }]}
          />
          <View style={[styles.progressDot, { borderColor: theme.border }]} />
        </View>

        {/* Space Type Selection */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          What type of space is this?
        </Text>
        {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
        <View style={styles.typeGrid}>
          {spaceTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeCard,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor:
                    selectedType === type ? colors.primary : theme.border,
                  borderWidth: selectedType === type ? 2 : 1,
                },
              ]}
              onPress={() => {
                setSelectedType(type);
                setErrors((prev) => ({ ...prev, type: undefined }));
              }}
            >
              <Ionicons
                name={spaceTypeIcons[type] as keyof typeof Ionicons.glyphMap}
                size={28}
                color={
                  selectedType === type ? colors.primary : theme.textSecondary
                }
              />
              <Text
                style={[
                  styles.typeLabel,
                  {
                    color: selectedType === type ? colors.primary : theme.text,
                    fontWeight: selectedType === type ? "600" : "400",
                  },
                ]}
                numberOfLines={2}
              >
                {spaceTypeLabels[type]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Title Input */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, marginTop: spacing.lg },
          ]}
        >
          Give your space a title
        </Text>
        <Input
          placeholder="e.g., Downtown Coffee Shop Window"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (text.trim().length >= 10) {
              setErrors((prev) => ({ ...prev, title: undefined }));
            }
          }}
          error={errors.title}
          maxLength={100}
        />
        <Text style={[styles.charCount, { color: theme.textMuted }]}>
          {title.length}/100 characters
        </Text>

        {/* Description Input */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, marginTop: spacing.md },
          ]}
        >
          Describe your space (optional)
        </Text>
        <Input
          placeholder="Tell advertisers about foot traffic, visibility, surrounding businesses..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          maxLength={500}
          style={styles.descriptionInput}
        />
        <Text style={[styles.charCount, { color: theme.textMuted }]}>
          {description.length}/500 characters
        </Text>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomActions, { borderTopColor: theme.border }]}>
        <Button title="Continue" onPress={validateAndContinue} fullWidth />
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
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  typeCard: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.sm,
  },
  typeLabel: {
    fontSize: fontSize.xs,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  charCount: {
    fontSize: fontSize.xs,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  bottomActions: {
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
