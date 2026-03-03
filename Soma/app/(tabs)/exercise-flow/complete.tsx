import { View, Text, Pressable, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import ConfettiCannon from "react-native-confetti-cannon";
import { useFonts } from 'expo-font';
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Typography } from '@/constants/theme';
import Svg, { Rect, Text as SvgText, Path, G, Circle } from "react-native-svg";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// 👇 Hide top header (keeps bottom tabs visible)
export const unstable_settings = {
  headerShown: false,
};

const SCAN_POINTS = [
  { cx: 0, cy: -45, delay: 0, minR: 8, maxR: 15, idleOpacity: 0.34, peakOpacity: 1 },
  { cx: 12, cy: -25, delay: 220, minR: 6, maxR: 12, idleOpacity: 0.28, peakOpacity: 0.9 },
  { cx: -12, cy: -25, delay: 440, minR: 6, maxR: 12, idleOpacity: 0.28, peakOpacity: 0.9 },
  { cx: 0, cy: -5, delay: 660, minR: 9, maxR: 16, idleOpacity: 0.36, peakOpacity: 1 },
  { cx: 10, cy: 20, delay: 880, minR: 7, maxR: 13, idleOpacity: 0.3, peakOpacity: 0.92 },
  { cx: -10, cy: 20, delay: 1100, minR: 7, maxR: 13, idleOpacity: 0.3, peakOpacity: 0.92 },
  { cx: 0, cy: 45, delay: 1320, minR: 10, maxR: 18, idleOpacity: 0.38, peakOpacity: 1 },
];

const AURA_RINGS = [
  { baseRadius: 120, delay: 0 },
  { baseRadius: 160, delay: 520 },
  { baseRadius: 205, delay: 980 },
];

function withAlpha(color: string, alpha: number) {
  if (!color?.startsWith("#")) return color;

  const raw = color.slice(1);
  const hex =
    raw.length === 3
      ? raw
          .split("")
          .map((char) => char + char)
          .join("")
      : raw;

  if (hex.length !== 6) return color;

  const value = parseInt(hex, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function AuraRing({
  cx,
  cy,
  baseRadius,
  delay,
  color,
}: {
  cx: number;
  cy: number;
  baseRadius: number;
  delay: number;
  color: string;
}) {
  const radius = useSharedValue(baseRadius);
  const opacity = useSharedValue(0);

  useEffect(() => {
    radius.value = withRepeat(
      withSequence(
        withDelay(
          delay,
          withTiming(baseRadius + 42, {
            duration: 3400,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        withTiming(baseRadius, {
          duration: 3400,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withDelay(
          delay,
          withTiming(0.18, {
            duration: 3400,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        withTiming(0, {
          duration: 3400,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(radius);
      cancelAnimation(opacity);
    };
  }, [baseRadius, delay, opacity, radius]);

  const animatedProps = useAnimatedProps(() => ({
    r: radius.value,
    opacity: opacity.value,
  }));

  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      fill="none"
      stroke={color}
      strokeWidth={4.6}
      animatedProps={animatedProps}
    />
  );
}

function ScanPoint({
  cx,
  cy,
  delay,
  minR,
  maxR,
  idleOpacity,
  peakOpacity,
  color,
}: {
  cx: number;
  cy: number;
  delay: number;
  minR: number;
  maxR: number;
  idleOpacity: number;
  peakOpacity: number;
  color: string;
}) {
  const radius = useSharedValue(minR * 0.45);
  const opacity = useSharedValue(0);

  useEffect(() => {
    radius.value = withRepeat(
      withSequence(
        withDelay(
          delay,
          withTiming(maxR, {
            duration: 840,
            easing: Easing.out(Easing.cubic),
          })
        ),
        withTiming(minR, {
          duration: 980,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(minR, {
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withDelay(
          delay,
          withTiming(peakOpacity, {
            duration: 840,
            easing: Easing.out(Easing.cubic),
          })
        ),
        withTiming(idleOpacity + 0.28, {
          duration: 980,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(idleOpacity, {
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(radius);
      cancelAnimation(opacity);
    };
  }, [delay, idleOpacity, maxR, minR, opacity, peakOpacity, radius]);

  const animatedProps = useAnimatedProps(() => ({
    r: radius.value,
    opacity: opacity.value,
  }));

  return <AnimatedCircle cx={cx} cy={cy} fill={color} animatedProps={animatedProps} />;
}

function BodyScanBackground({
  colors,
}: {
  colors: ReturnType<typeof useThemeColors>;
}) {
  return (
    <View pointerEvents="none" style={styles.scanBackground}>
      <View style={styles.scanStage}>
        <Svg width="100%" height="100%" viewBox="0 0 420 720">
          <Rect x="20" y="20" width="380" height="680" rx="20" fill={colors.somaBackground} />
          

          <G transform="translate(210 398)">
            {AURA_RINGS.map((ring, index) => (
              <AuraRing
                key={index}
                cx={0}
                cy={20}
                baseRadius={ring.baseRadius}
                delay={ring.delay}
                color={
                  index % 3 === 0
                    ? withAlpha(colors.somaPrimary, 0.24)
                    : index % 3 === 1
                    ? withAlpha(colors.somaTime, 0.2)
                    : withAlpha(colors.somaTertiary, 0.22)
                }
              />
            ))}

            <Circle
              cx="0"
              cy="-176"
              r="40"
              fill={withAlpha(colors.somaSecondary, 0.08)}
              
            />
            <Path
              d="M-74 -104 C-48 -126, 48 -126, 74 -104 C66 -54, 44 -24, 0 -10 C-44 -24, -66 -54, -74 -104 Z"
              fill={withAlpha(colors.somaSecondary, 0.08)}
             
            />
            <Path
              d="M-54 -10 C-36 8, -32 36, -26 62 C-18 96, -8 120, 0 140 C8 120, 18 96, 26 62 C32 36, 36 8, 54 -10 C46 34, 48 76, 58 106 C42 124, 22 138, 0 146 C-22 138, -42 124, -58 106 C-48 76, -46 34, -54 -10 Z"
              fill={withAlpha(colors.somaSecondary, 0.08)}
              
            />
            <Path
              d="M-160 156 C-122 120, -84 104, -48 110 C-24 114, -8 124, 0 138 C-16 162, -40 178, -82 190 C-120 198, -146 188, -160 156 Z"
              fill={withAlpha(colors.somaSecondary, 0.08)}
              
            />
            <Path
              d="M160 156 C122 120, 84 104, 48 110 C24 114, 8 124, 0 138 C16 162, 40 178, 82 190 C120 198, 146 188, 160 156 Z"
              fill={withAlpha(colors.somaSecondary, 0.08)}
              
            />
            <Path
              d="M-86 132 C-44 112, 44 112, 86 132 C66 154, 38 170, 0 174 C-38 170, -66 154, -86 132 Z"
              fill={withAlpha(colors.somaSecondary, 0.08)}
              
            />

            {SCAN_POINTS.map((point, index) => (
              <ScanPoint
                key={index}
                cx={point.cx * 3.85}
                cy={point.cy * 3.45}
                delay={point.delay}
                minR={point.minR}
                maxR={point.maxR}
                idleOpacity={point.idleOpacity}
                peakOpacity={point.peakOpacity}
                color={withAlpha(colors.somaPrimary, 0.35)}
              />
            ))}
          </G>
        </Svg>
      </View>
    </View>
  );
}

export default function Complete() {
  const insets = useSafeAreaInsets();
  const confetti = useRef<any>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const { width } = Dimensions.get("window");
  const [fontsLoaded] = useFonts({
  Plante: require("../../../assets/fonts/Plante.ttf"), Biro: require("../../../assets/fonts/biro.otf")   // <-- update path if different
});
  const colors = useThemeColors();

    useEffect(() => {
    // small delay to ensure layout is ready, then mount confetti so it reliably plays
    const startTimer = setTimeout(() => setShowConfetti(true), 80);
    // stop after ~4s
    const stopTimer = setTimeout(() => setShowConfetti(false), 4080);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, []);
  return (
    <SafeAreaView
      style={[styles.container, { paddingBottom: insets.bottom || 16, backgroundColor: colors.somaBackground }]}
    >
      <BodyScanBackground colors={colors} />
      {showConfetti && (
        <ConfettiCannon
          ref={confetti}
          key={String(showConfetti)} // forces mount when toggled
          count={140}
          origin={{ x: width / 2, y: 0 }}
          fadeOut={true}
          fallSpeed={3000}
          colors={[colors.somaPrimary, colors.somaBackground, colors.somaSecondary, colors.somaTertiary]}
        />
      )}

      <Text style={[Typography.title, { color: colors.somaCardOutText }]}>Great Job!</Text>
      <Text style={[Typography.subtitle, { color: colors.somaTextMuted }]}>Take a moment to notice how you feel.</Text>

      <Pressable
        style={[styles.secondaryButton, { backgroundColor: colors.somaPrimary }]}
        onPress={() => router.push("/(tabs)/calendar")}
      >
        <Text style={[styles.secondaryText, { color: colors.somaButtonText }]}>View Calendar</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  scanBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanStage: {
    width: "165%",
    maxWidth: 980,
    height: "100%",
  },
  title: {
    fontSize: 48,
    marginBottom: 15,
    fontFamily: 'Plante',
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 38,
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: 'Biro',
  },
  primaryButton: {
    backgroundColor: "#c18c24ff",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 15,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  primaryText: {
    color: "#403F3A",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  secondaryText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
