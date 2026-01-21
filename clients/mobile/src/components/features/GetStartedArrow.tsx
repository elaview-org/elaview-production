import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

interface GetStartedArrowProps {
  size?: number;
  circleColor?: string;
  strokeColor?: string;
  arrowColor?: string;
}

export default function GetStartedArrow({
  size = 58,
  circleColor = "#0088FF",
  strokeColor = "#FFFFFF",
  arrowColor = "#FFFFFF",
}: GetStartedArrowProps) {
  // Scale factor based on original 58px design
  const scale = size / 58;

  return (
    <Svg width={size} height={size} viewBox="0 0 58 58" fill="none">
      {/* Blue circle with white border */}
      <Circle
        cx="29"
        cy="29"
        r="27.5"
        fill={circleColor}
        stroke={strokeColor}
        strokeWidth="3"
      />
      {/* Chevron arrow pointing right */}
      <Path
        d="M24 17L36 29L24 41"
        stroke={arrowColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
