import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SlideToStartProps {
  onSlideComplete: () => void;
  label?: string;
  containerPadding?: number;
}

const BUTTON_SIZE = 58;
const TRACK_PADDING = 6;
const COMPLETE_THRESHOLD = 0.85;

// Arrow component embedded for self-containment
function ArrowIcon({ size = 58 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 58 58" fill="none">
      <Circle
        cx="29"
        cy="29"
        r="27.5"
        fill="#0088FF"
        stroke="#FFFFFF"
        strokeWidth="3"
      />
      <Path
        d="M24 17L36 29L24 41"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * SlideToStart - Expo Go compatible version
 * 
 * Uses React Native's built-in Animated API + PanResponder
 * instead of react-native-reanimated (which requires a dev build).
 */
export default function SlideToStart({
  onSlideComplete,
  label = 'Get Started',
  containerPadding = 24,
}: SlideToStartProps) {
  const trackWidth = SCREEN_WIDTH - containerPadding * 2;
  const maxSlide = trackWidth - BUTTON_SIZE - TRACK_PADDING * 2;

  const translateX = useRef(new Animated.Value(0)).current;
  const isComplete = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Stop any running animation when touch starts
        translateX.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        if (isComplete.current) return;
        // Clamp translation between 0 and maxSlide
        const newValue = Math.max(0, Math.min(gestureState.dx, maxSlide));
        translateX.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isComplete.current) return;

        const currentValue = Math.max(0, Math.min(gestureState.dx, maxSlide));

        // If dragged past threshold, complete the action
        if (currentValue > maxSlide * COMPLETE_THRESHOLD) {
          isComplete.current = true;
          Animated.spring(translateX, {
            toValue: maxSlide,
            useNativeDriver: true,
            damping: 15,
            stiffness: 150,
            mass: 1,
          }).start(() => {
            onSlideComplete();
          });
        } else {
          // Spring back to start
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            stiffness: 150,
            mass: 1,
          }).start();
        }
      },
    })
  ).current;

  // Fade out text as slider moves
  const textOpacity = translateX.interpolate({
    inputRange: [0, maxSlide * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.track, { width: trackWidth }]}>
      {/* Label text - fades as you slide */}
      <Animated.View style={[styles.labelContainer, { opacity: textOpacity }]}>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>

      {/* Draggable button */}
      <Animated.View
        style={[
          styles.button,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <ArrowIcon size={BUTTON_SIZE} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: BUTTON_SIZE + TRACK_PADDING * 2,
    backgroundColor: '#1A1A1A',
    borderRadius: (BUTTON_SIZE + TRACK_PADDING * 2) / 2,
    justifyContent: 'center',
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  button: {
    position: 'absolute',
    left: TRACK_PADDING,
    top: TRACK_PADDING,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
