import { View } from "react-native";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ApolloWrapper } from "@/api";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { AuthProvider } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <ApolloWrapper>
        <AuthProvider>
          <ThemeProvider>
            <RoleProvider>
              <Slot />
            </RoleProvider>
          </ThemeProvider>
        </AuthProvider>
      </ApolloWrapper>
    </View>
  );
}
