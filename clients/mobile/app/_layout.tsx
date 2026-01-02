import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Slot, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeProvider } from '../contexts/ThemeContext';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';
import ElaviewLogo from '../components/ElaviewLogo';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

function WelcomeScreen({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <LinearGradient
        colors={[colors.primary, 'transparent']}
        style={styles.gradientBlur}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <ElaviewLogo width={180} height={43} color={colors.white} />
          <Text style={styles.tagline}>
            The marketplace for{'\n'}
            <Text style={styles.taglineAccent}>real-world advertising</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RootLayoutContent() {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      // TODO: Check for existing auth token here later
      // const token = await SecureStore.getItemAsync('auth_token');
      // if (token) { router.replace('/(app)'); setShowWelcome(false); }
      
      setIsReady(true);
      await SplashScreen.hideAsync();
    };

    init();
  }, []);

  const handleGetStarted = () => {
    setShowWelcome(false);
    router.replace('/(auth)/login');
  };

  if (!isReady) {
    return null;
  }

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  gradientBlur: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: width * 1.5,
    height: height * 0.6,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: height * 0.35,
    paddingBottom: spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: spacing.md,
  },
  taglineAccent: {
    color: colors.primary,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    paddingLeft: spacing.lg,
    paddingRight: 6,
  },
  getStartedText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.white,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 24,
    color: colors.primary,
    marginTop: -2,
  },
});