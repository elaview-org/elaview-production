import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useRole } from "@/contexts/RoleContext";

const { width, height } = Dimensions.get("window");

export default function RoleSelect() {
  const router = useRouter();
  const { setRole } = useRole();

  const handleRoleSelect = async (role: "advertiser" | "owner") => {
    try {
      await setRole(role);
      // Navigate to the appropriate route group
      const route =
        role === "advertiser" ? "/(advertiser)/discover" : "/(owner)/listings";
      router.replace(route);
    } catch (error) {
      console.error("Failed to save role:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={["#0088FF", "transparent"]}
        style={styles.gradientBlur}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Header */}
      <Text style={styles.logo}>ELAVIEW</Text>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>
          Don't worry, you can change this later
        </Text>

        {/* Role Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleRoleSelect("advertiser")}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>I want to browse</Text>
              <Text style={styles.optionTitle}>spaces</Text>
            </View>
            <View style={styles.optionIcon}>
              <Text style={styles.iconText}>☰</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleRoleSelect("owner")}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>I want to list a</Text>
              <Text style={styles.optionTitle}>space</Text>
            </View>
            <View style={styles.optionIcon}>
              <Text style={styles.iconText}>↑</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  gradientBlur: {
    position: "absolute",
    top: -100,
    left: -50,
    width: width * 1.5,
    height: height * 0.35,
    opacity: 0.4,
  },
  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 1,
    marginTop: 60,
    marginLeft: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#0088FF",
    borderRadius: 12,
    padding: 20,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    lineHeight: 22,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  iconText: {
    fontSize: 20,
    color: "#0088FF",
  },
});
