import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { spacing, fontSize, colors, borderRadius } from "@/constants/theme";
import api from "@/api";
import { Mutation, Query } from "@/types/graphql";

/**
 * Edit Space Screen
 * Allows space owners to update their listing details
 */
export default function EditSpace() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch existing space data
  const { data, loading, error } = api.query<Pick<Query, "spaceById">>(
    api.gql`
      query GetSpaceForEdit($id: ID!) {
        spaceById(id: $id) {
          id
          title
          description
          pricePerDay
          installationFee
          minDuration
          maxDuration
          dimensionsText
          traffic
          availableFrom
          availableTo
        }
      }
    `,
    {
      variables: { id },
      skip: !id,
    }
  );

  const [updateSpaceMutation, { loading: updating }] = api.mutation<
    Pick<Mutation, "updateSpace">
  >(
    api.gql`
      mutation UpdateSpace($id: ID!, $input: UpdateSpaceInput!) {
        updateSpace(id: $id, input: $input) {
          space {
            id
            title
            description
            pricePerDay
            installationFee
            minDuration
            maxDuration
            dimensionsText
            traffic
          }
          errors {
            ... on NotFoundError {
              message
            }
            ... on ForbiddenError {
              message
            }
            ... on ValidationError {
              message
            }
          }
        }
      }
    `
  );

  const space = data?.spaceById;

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [installationFee, setInstallationFee] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [traffic, setTraffic] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});

  // Populate form when space data loads
  useEffect(() => {
    if (space) {
      setTitle(space.title || "");
      setDescription(space.description || "");
      setPricePerDay(space.pricePerDay?.toString() || "");
      setInstallationFee(space.installationFee?.toString() || "");
      setMinDuration(space.minDuration?.toString() || "1");
      setMaxDuration(space.maxDuration?.toString() || "");
      setTraffic(space.traffic || "");
    }
  }, [space]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = "Title is required";
    }

    const price = parseFloat(pricePerDay);
    if (!pricePerDay || isNaN(price) || price <= 0) {
      errors.pricePerDay = "Please enter a valid daily rate";
    } else if (price < 5) {
      errors.pricePerDay = "Minimum daily rate is $5";
    }

    const minDur = parseInt(minDuration, 10);
    if (!minDuration || isNaN(minDur) || minDur < 1) {
      errors.minDuration = "Minimum duration must be at least 1 day";
    }

    if (maxDuration) {
      const maxDur = parseInt(maxDuration, 10);
      if (isNaN(maxDur) || maxDur < minDur) {
        errors.maxDuration = "Maximum must be greater than minimum";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const result = await updateSpaceMutation({
        variables: {
          id,
          input: {
            title: title.trim(),
            description: description.trim() || null,
            pricePerDay: parseFloat(pricePerDay),
            installationFee: installationFee ? parseFloat(installationFee) : null,
            minDuration: parseInt(minDuration, 10),
            maxDuration: maxDuration ? parseInt(maxDuration, 10) : null,
            traffic: traffic.trim() || null,
          },
        },
      });

      if (result.data?.updateSpace.errors?.length) {
        const errorMessage =
          (result.data.updateSpace.errors[0] as { message?: string })?.message ||
          "Failed to update space";
        Alert.alert("Error", errorMessage);
        return;
      }

      Alert.alert("Success", "Space updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Error", "Failed to update space. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!space || error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.textMuted} />
        <Text style={[styles.errorText, { color: theme.text }]}>Space not found</Text>
        <Button title="Go Back" onPress={() => router.back()} variant="outline" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Space",
          headerBackTitle: "Details",
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={[styles.container, { backgroundColor: theme.background }]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Basic Info</Text>
            <Input
              label="Title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setFormErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g., Prime Downtown Billboard"
              error={formErrors.title}
            />
            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your space..."
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </View>

          {/* Pricing */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Pricing</Text>
            <Input
              label="Daily Rate ($)"
              value={pricePerDay}
              onChangeText={(text) => {
                setPricePerDay(text.replace(/[^\d.]/g, ""));
                setFormErrors((prev) => ({ ...prev, pricePerDay: undefined }));
              }}
              placeholder="50"
              keyboardType="decimal-pad"
              error={formErrors.pricePerDay}
            />
            <Input
              label="Installation Fee (optional)"
              value={installationFee}
              onChangeText={(text) => setInstallationFee(text.replace(/[^\d.]/g, ""))}
              placeholder="0"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Duration */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Booking Duration</Text>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label="Min Days"
                  value={minDuration}
                  onChangeText={(text) => {
                    setMinDuration(text.replace(/\D/g, ""));
                    setFormErrors((prev) => ({ ...prev, minDuration: undefined }));
                  }}
                  placeholder="1"
                  keyboardType="number-pad"
                  error={formErrors.minDuration}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="Max Days (optional)"
                  value={maxDuration}
                  onChangeText={(text) => {
                    setMaxDuration(text.replace(/\D/g, ""));
                    setFormErrors((prev) => ({ ...prev, maxDuration: undefined }));
                  }}
                  placeholder="No limit"
                  keyboardType="number-pad"
                  error={formErrors.maxDuration}
                />
              </View>
            </View>
          </View>

          {/* Additional Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Additional Info</Text>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Traffic Level</Text>
            <View style={styles.trafficOptions}>
              {["Low", "Medium", "High"].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.trafficOption,
                    traffic === level && styles.trafficOptionSelected,
                    { borderColor: traffic === level ? colors.primary : theme.border },
                  ]}
                  onPress={() => setTraffic(level)}
                >
                  <Text
                    style={[
                      styles.trafficOptionText,
                      { color: traffic === level ? colors.primary : theme.text },
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Note about non-editable fields */}
          <Card style={styles.noteCard}>
            <View style={styles.noteRow}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
              <Text style={[styles.noteText, { color: theme.textSecondary }]}>
                Location, dimensions, and photos cannot be changed after listing creation.
                Contact support if you need to update these details.
              </Text>
            </View>
          </Card>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title={updating ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              variant="primary"
              fullWidth
              disabled={updating}
              leftIcon={
                updating ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Ionicons name="checkmark" size={20} color={colors.white} />
                )
              }
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={updating}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  errorText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  trafficOptions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  trafficOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  trafficOptionSelected: {
    backgroundColor: colors.primaryLight,
  },
  trafficOptionText: {
    fontSize: fontSize.sm,
    fontWeight: "500",
  },
  noteCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryLight,
  },
  noteRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  cancelButtonText: {
    fontSize: fontSize.md,
    fontWeight: "500",
  },
});
