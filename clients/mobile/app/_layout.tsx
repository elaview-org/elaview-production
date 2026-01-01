import { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';

SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function AuthGate() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const init = async () => {
      // Show splash for minimum 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      const inAuthGroup = segments[0] === '(auth)';

      if (isSignedIn && inAuthGroup) {
        router.replace('/(app)');
      } else if (!isSignedIn && !inAuthGroup) {
        router.replace('/(auth)/login');
      }

      setShowSplash(false);
      await SplashScreen.hideAsync();
    };

    init();
  }, [isSignedIn, isLoaded, segments]);

  if (showSplash) {
    return (
      <View style={styles.splash}>
        <Text style={styles.logo}>Elaview</Text>
        <Text style={styles.tagline}>The marketplace for real-world advertising</Text>
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <ClerkLoaded>
        <AuthGate />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 16,
    color: '#888',
  },
});