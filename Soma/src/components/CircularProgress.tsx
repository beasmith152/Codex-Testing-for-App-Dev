import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 100
  totalMinutes: number;
  color?: string;
  textColor?: string;
  labelColor?: string;
}

export default function CircularProgress({
  size = 140,
  strokeWidth = 12,
  progress,
  totalMinutes,
  color = "#ffb92eff",
  textColor = "#403F3A",
  labelColor = "#507050",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          stroke="#ffffffff"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={[styles.minutesText, { color: textColor }]}>{totalMinutes}</Text>
      <Text style={[styles.label, { color: labelColor }]}>Minutes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  minutesText: {
    fontSize: 30,
    fontWeight: "700",
  },
  label: {
    fontSize: 18,
    marginTop: -4,
  },
});
