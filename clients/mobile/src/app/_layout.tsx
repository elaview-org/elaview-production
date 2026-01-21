import { View } from "react-native";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ApolloWrapper } from "@/api";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SessionProvider } from "@/contexts/SessionContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <ApolloWrapper>
        <SessionProvider>
          <ThemeProvider>
            <Slot />
          </ThemeProvider>
        </SessionProvider>
      </ApolloWrapper>
    </View>
  );
}
