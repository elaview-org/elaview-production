import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import ElaviewLogo from '@/components/features/ElaviewLogo';
import SlideToStart from '@/components/features/SlideToStartExpoGo';
import { colors, spacing } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Hide the native splash screen once this component mounts
    SplashScreen.hideAsync();
  }, []);

  const handleSlideComplete = () => {
    // Navigate to login (or check auth and go to app)
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background gradient - blue to white fade */}
      <LinearGradient
        colors={['#7BB8E0', '#A8D0ED', '#FFFFFF', '#FFFFFF']}
        locations={[0, 0.25, 0.45, 1]}
        style={styles.gradient}
      />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <ElaviewLogo width={220} height={52} color="#1A1A1A" />
          <Text style={styles.tagline}>
            The marketplace for{'\n'}
            real-world <Text style={styles.taglineAccent}>advertising</Text>
          </Text>
        </View>
      </View>

      {/* Slide to start button */}
      <View style={styles.buttonContainer}>
        <SlideToStart
          onSlideComplete={handleSlideComplete}
          label="Get Started"
          containerPadding={24}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.55,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 20,
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 28,
    marginTop: spacing.md,
  },
  taglineAccent: {
    color: colors.primary,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
});