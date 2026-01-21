import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useSession } from "@/contexts/SessionContext";
import { ProfileType } from "@/types/graphql";
import { colors, spacing, fontSize } from "@/constants/theme";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const { profileType, switchProfile, logout } = useSession();
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleSwitchRole = async () => {
    if (isSwitching) return;
    setIsSwitching(true);
    try {
      const targetType =
        profileType === ProfileType.SpaceOwner
          ? ProfileType.Advertiser
          : ProfileType.SpaceOwner;
      await switchProfile(targetType);
      onClose();
      const route =
        targetType === ProfileType.SpaceOwner
          ? "/(protected)/(owner)/listings"
          : "/(protected)/(advertiser)/discover";
      router.replace(route as any);
    } catch (error) {
      console.error("Failed to switch profile:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleSettings = () => {
    onClose();
    router.push("/settings");
  };

  const handleHelp = () => {
    onClose();
    router.push("/help");
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    router.replace("/(auth)/login");
  };

  const menuItems = [
    { icon: "settings-outline", label: "Settings", onPress: handleSettings },
    { icon: "help-circle-outline", label: "Help", onPress: handleHelp },
    {
      icon: "swap-horizontal-outline",
      label: "Switch Role",
      onPress: handleSwitchRole,
    },
    {
      icon: "log-out-outline",
      label: "Logout",
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: theme.background,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: theme.text }]}>Menu</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { borderBottomColor: theme.border }]}
                onPress={item.onPress}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.danger ? colors.error : theme.text}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    { color: item.danger ? colors.error : theme.text },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + 12,
    paddingBottom: spacing.lg,
  },
  headerText: {
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
  menuItems: {
    paddingTop: spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 4,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  menuItemText: {
    fontSize: fontSize.md,
    fontWeight: "500",
  },
});
