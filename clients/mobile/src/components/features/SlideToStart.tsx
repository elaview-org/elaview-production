import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SlideToStartProps {
  onSlideComplete: () => void;
  label?: string;
  containerPadding?: number;
}

const BUTTON_SIZE = 58;
const TRACK_PADDING = 6;
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

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

export default function SlideToStart({
  onSlideComplete,
  label = "Get Started",
  containerPadding = 24,
}: SlideToStartProps) {
  const trackWidth = SCREEN_WIDTH - containerPadding * 2;
  const maxSlide = trackWidth - BUTTON_SIZE - TRACK_PADDING * 2;

  const translateX = useSharedValue(0);
  const isComplete = useSharedValue(false);

  const handleComplete = () => {
    onSlideComplete();
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isComplete.value) return;
      // Clamp translation between 0 and maxSlide
      translateX.value = Math.max(0, Math.min(event.translationX, maxSlide));
    })
    .onEnd(() => {
      if (isComplete.value) return;

      // If dragged past 85% threshold, complete the action
      if (translateX.value > maxSlide * 0.85) {
        translateX.value = withSpring(maxSlide, SPRING_CONFIG);
        isComplete.value = true;
        runOnJS(handleComplete)();
      } else {
        // Spring back to start
        translateX.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, maxSlide * 0.5],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <View style={[styles.track, { width: trackWidth }]}>
      {/* Label text - fades as you slide */}
      <Animated.View style={[styles.labelContainer, textAnimatedStyle]}>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>

      {/* Draggable button */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.button, buttonAnimatedStyle]}>
          <ArrowIcon size={BUTTON_SIZE} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: BUTTON_SIZE + TRACK_PADDING * 2,
    backgroundColor: "#1A1A1A",
    borderRadius: (BUTTON_SIZE + TRACK_PADDING * 2) / 2,
    justifyContent: "center",
    paddingHorizontal: TRACK_PADDING,
  },
  labelContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
  },
});
