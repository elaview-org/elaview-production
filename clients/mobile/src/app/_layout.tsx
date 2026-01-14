import { useEffect } from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { AuthProvider } from '@/contexts/AuthContext';

// Prevent auto-hide so we control when splash disappears
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider>
          <RoleProvider>
            <Slot />
          </RoleProvider>
        </ThemeProvider>
      </AuthProvider>
    </View>
  );
}