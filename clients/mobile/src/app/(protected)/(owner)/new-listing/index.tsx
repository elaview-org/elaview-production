import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";
import { spacing, fontSize, colors, borderRadius } from "@/constants/theme";

const MIN_PHOTOS = 1;
const MAX_PHOTOS = 5;

/**
 * Step 1: Photo Upload
 * Upload photos of the advertising space
 */
export default function NewListingPhotos() {
  const { theme } = useTheme();
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);

  const pickImage = async () => {
    
    if (photos.length >= MAX_PHOTOS) {
      
      Alert.alert(
        "Maximum Photos",
        `You can upload up to ${MAX_PHOTOS} photos.`
      );
      return;
    }


    // TODO: Fix perissions crashes on asking for permission from ios and android 

    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    // if (status !== "granted") {
    //   Alert.alert(
    //     "Permission Required",
    //     "Please allow access to your photo library to upload images."
    //   );
    //   return;
    // }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map(
        (asset: { uri: string }) => asset.uri
      );
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, MAX_PHOTOS));
    }
  };

  const takePhoto = async () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert(
        "Maximum Photos",
        `You can upload up to ${MAX_PHOTOS} photos.`
      );
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your camera to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos((prev) => [...prev, result.assets[0].uri].slice(0, MAX_PHOTOS));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (photos.length < MIN_PHOTOS) {
      Alert.alert(
        "Photos Required",
        "Please add at least one photo of your space."
      );
      return;
    }
    // TODO: Store photos in context/state management
    // For now, pass via params (limited for demo)
    router.push({
      pathname: "/(protected)/(owner)/new-listing/details",
      params: { photoCount: photos.length },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
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
          <View
            style={[styles.progressLine, { backgroundColor: theme.border }]}
          />
          <View style={[styles.progressDot, { borderColor: theme.border }]} />
        </View>

        {/* Instructions */}
        <Text style={[styles.title, { color: theme.text }]}>
          Add photos of your space
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          High-quality photos help attract more advertisers. Add up to{" "}
          {MAX_PHOTOS} photos showing different angles.
        </Text>

        {/* Photo Grid */}
        <View style={styles.photoGrid}>
          {photos.map((uri, index) => (
            <View key={uri} style={styles.photoWrapper}>
              <Image source={{ uri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePhoto(index)}
              >
                <Ionicons name="close-circle" size={24} color={colors.error} />
              </TouchableOpacity>
              {index === 0 && (
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryBadgeText}>Cover</Text>
                </View>
              )}
            </View>
          ))}

          {photos.length < MAX_PHOTOS && (
            <TouchableOpacity
              style={[styles.addPhotoButton, { borderColor: theme.border }]}
              onPress={pickImage}
            >
              <Ionicons name="add" size={32} color={colors.primary} />
              <Text
                style={[styles.addPhotoText, { color: theme.textSecondary }]}
              >
                Add Photo
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Photo Tips */}
        <View
          style={[
            styles.tipsContainer,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Text style={[styles.tipsTitle, { color: theme.text }]}>
            📸 Photo Tips
          </Text>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            • Show the full advertising space clearly
          </Text>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            • Include surrounding context (street view, foot traffic)
          </Text>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            • Use good lighting - avoid dark or blurry images
          </Text>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            • Show dimensions with a reference object
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
          <Ionicons name="camera-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Button
          title={`Continue ${photos.length > 0 ? `(${photos.length} photo${photos.length !== 1 ? "s" : ""})` : ""}`}
          onPress={handleContinue}
          disabled={photos.length < MIN_PHOTOS}
          fullWidth
          style={styles.continueButton}
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
  progressLine: {
    width: 24,
    height: 2,
    marginHorizontal: 4,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  photoWrapper: {
    width: "48%",
    aspectRatio: 4 / 3,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  primaryBadge: {
    position: "absolute",
    bottom: spacing.xs,
    left: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  primaryBadgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  addPhotoButton: {
    width: "48%",
    aspectRatio: 4 / 3,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoText: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  tipsContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  tipsTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: 4,
  },
  bottomActions: {
    flexDirection: "row",
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  cameraButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButton: {
    flex: 1,
  },
});
