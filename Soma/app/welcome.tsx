import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Animated, {
  Easing,
  Extrapolation,
  clamp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { Radii, Shadows, Spacing, Typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import SomaLogo from '../assets/images/soma-logo.svg';

const TEST_MODE = false;

const DIAL_NODE_POINTS = [
  { x: 0, y: -88 },
  { x: 62, y: -62 },
  { x: 88, y: 0 },
  { x: 62, y: 62 },
  { x: 0, y: 88 },
  { x: -62, y: 62 },
  { x: -88, y: 0 },
  { x: -62, y: -62 },
];

const BREATH_WAVE_PATHS = [
  'M0 70 C40 20, 80 120, 120 70 S200 20, 240 70 S320 120, 360 70',
  'M0 85 C40 35, 80 135, 120 85 S200 35, 240 85 S320 135, 360 85',
  'M0 100 C40 50, 80 150, 120 100 S200 50, 240 100 S320 150, 360 100',
];

const BODY_SCAN_POINTS = [
  { x: 102, y: 46 },
  { x: 118, y: 74 },
  { x: 86, y: 74 },
  { x: 102, y: 103 },
  { x: 116, y: 138 },
  { x: 88, y: 138 },
  { x: 102, y: 173 },
];

function useSectionProgress(
  scrollY: SharedValue<number>,
  index: number,
  sectionHeight: number
) {
  return useDerivedValue(() => {
    const start = index * sectionHeight - sectionHeight * 0.88;
    const end = index * sectionHeight - sectionHeight * 0.18;

    return clamp((scrollY.value - start) / (end - start), 0, 1);
  }, [index, sectionHeight]);
}

function useSectionBlendStyle(
  scrollY: SharedValue<number>,
  index: number,
  sectionHeight: number
) {
  return useAnimatedStyle(() => {
    const relative = scrollY.value / sectionHeight - index;

    return {
      opacity: interpolate(relative, [-0.68, -0.22, 0.18, 0.78], [0, 1, 1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(
            relative,
            [-0.68, -0.22, 0.18, 0.78],
            [48, 0, -10, -40],
            Extrapolation.CLAMP
          ),
        },
        { scale: interpolate(relative, [-0.68, -0.22, 0.18, 0.78], [0.95, 1, 1, 0.96], Extrapolation.CLAMP) },
      ],
    };
  }, [index, sectionHeight]);
}

function AmbientBackdrop({
  colors,
  scrollY,
  sectionHeight,
}: {
  colors: ReturnType<typeof useThemeColors>;
  scrollY: SharedValue<number>;
  sectionHeight: number;
}) {
  const blobOneStyle = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;
    const loopProgress = clamp(global / 5.9, 0, 1);
    const theta = loopProgress * Math.PI * 2;

    // Full loop over the onboarding scroll; starts and ends at the original placement.
    const orbitX = (Math.cos(theta) - 1) * 210;
    const orbitY = Math.sin(theta) * 210;
    const floatY = Math.sin(global * 1.2) * 16;
    const scale = interpolate(global, [0, 1, 2, 3, 4, 5], [1, 0.92, 0.8, 0.64, 0.5, 0.36], Extrapolation.CLAMP);

    return {
      opacity: interpolate(
        global,
        [0, 1, 2, 3, 4, 4.55, 4.85, 5.0],
        [0.08, 0.1, 0.07, 0.09, 0.07, 0.03, 0.005, 0],
        Extrapolation.CLAMP
      ),
      transform: [{ translateX: orbitX }, { translateY: orbitY + floatY }, { scale }],
    };
  }, [sectionHeight]);

  const blobTwoStyle = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;

    return {
      opacity: interpolate(global, [0, 1, 2, 3, 4, 5], [0.06, 0.09, 0.1, 0.07, 0.08, 0.06], Extrapolation.CLAMP),
      transform: [{ translateY: Math.cos(global * 1.05) * 18 }],
    };
  }, [sectionHeight]);

  const blobThreeStyle = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;

    return {
      opacity: interpolate(global, [0, 1, 2, 3, 4, 5], [0.05, 0.06, 0.09, 0.1, 0.08, 0.06], Extrapolation.CLAMP),
      transform: [{ translateY: Math.sin(global * 0.9) * 16 }],
    };
  }, [sectionHeight]);

  const blobFourStyle = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;

    return {
      opacity: interpolate(global, [0, 1, 2, 3, 4, 5], [0.06, 0.07, 0.06, 0.09, 0.1, 0.08], Extrapolation.CLAMP),
      transform: [{ translateY: Math.cos(global * 1.35) * 20 }],
    };
  }, [sectionHeight]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.backdropBlob,
          {
            backgroundColor: colors.somaAccent1,
            width: 220,
            height: 220,
            top: sectionHeight * 0.22,
            right: -80,
          },
          blobOneStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.backdropBlob,
          {
            backgroundColor: colors.somaAccent3,
            width: 280,
            height: 280,
            top: sectionHeight * 1.65,
            left: -120,
          },
          blobTwoStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.backdropBlob,
          {
            backgroundColor: colors.somaAccent4,
            width: 240,
            height: 240,
            top: sectionHeight * 3.2,
            right: -90,
          },
          blobThreeStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.backdropBlob,
          {
            backgroundColor: colors.somaAccent2,
            width: 260,
            height: 260,
            top: sectionHeight * 4.55,
            left: -100,
          },
          blobFourStyle,
        ]}
      />
    </View>
  );
}

function StoryDot({
  index,
  color,
  scrollY,
  sectionHeight,
}: {
  index: number;
  color: string;
  scrollY: SharedValue<number>;
  sectionHeight: number;
}) {
  const rowX = [-72, -36, 0, 36, 72][index] ?? 0;
  const rowY = [-6, -2, 0, -2, -6][index] ?? 0;

  const moodX = [0, 60, 38, -38, -60][index] ?? 0;
  const moodY = [-66, -20, 52, 52, -20][index] ?? 0;

  const durationX = [-66, -44, 0, 44, 66][index] ?? 0;
  const durationY = [-16, 18, -6, 18, -16][index] ?? 0;

  const breathX = [-72, -36, 0, 36, 72][index] ?? 0;
  const breathY = [-20, 8, 24, 8, -20][index] ?? 0;

  const scanX = [0, 0, 0, 0, 0][index] ?? 0;
  const scanY = [-82, -40, 0, 40, 82][index] ?? 0;

  const ctaX = [-22, -11, 0, 11, 22][index] ?? 0;
  const ctaY = [60, 68, 74, 68, 60][index] ?? 0;

  const style = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;
    const local = 1 - Math.abs((global % 1) - 0.5) * 2;
    const drift = Math.sin(global * Math.PI * 2 + index * 0.8);

    const x = interpolate(
      global,
      [0, 1, 2, 3, 4, 5],
      [rowX, moodX, durationX, breathX, scanX, ctaX],
      Extrapolation.CLAMP
    );

    const y = interpolate(
      global,
      [0, 1, 2, 3, 4, 5],
      [rowY, moodY, durationY, breathY, scanY, ctaY],
      Extrapolation.CLAMP
    );

    const stageScale = interpolate(global, [0, 1, 2, 3, 4, 5], [1, 1.06, 0.98, 1.05, 0.96, 1], Extrapolation.CLAMP);
    const stageOpacity = interpolate(global, [0, 1, 2, 3, 4, 5], [0.18, 0.3, 0.26, 0.32, 0.26, 0.22], Extrapolation.CLAMP);

    return {
      opacity: stageOpacity + local * 0.14,
      transform: [
        { translateX: x + drift * 4 },
        { translateY: y + drift * 3 },
        { scale: stageScale + local * 0.08 },
      ],
    };
  }, [index, sectionHeight]);

  const trailStyle = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;
    const local = 1 - Math.abs((global % 1) - 0.5) * 2;
    const drift = Math.sin(global * Math.PI * 2 + index * 0.8);

    const x = interpolate(
      global,
      [0, 1, 2, 3, 4, 5],
      [rowX, moodX, durationX, breathX, scanX, ctaX],
      Extrapolation.CLAMP
    );

    const y = interpolate(
      global,
      [0, 1, 2, 3, 4, 5],
      [rowY, moodY, durationY, breathY, scanY, ctaY],
      Extrapolation.CLAMP
    );

    const stageOpacity = interpolate(global, [0, 1, 2, 3, 4, 5], [0.12, 0.2, 0.18, 0.22, 0.18, 0.14], Extrapolation.CLAMP);

    return {
      opacity: stageOpacity + local * 0.08,
      transform: [
        { translateX: x - drift * 10 },
        { translateY: y - drift * 8 },
        { scale: 1.35 + local * 0.1 },
      ],
    };
  }, [index, sectionHeight]);

  return (
    <>
      <Animated.View style={[styles.storyDotTrail, { backgroundColor: color }, trailStyle]} />
      <Animated.View style={[styles.storyDot, { backgroundColor: color }, style]} />
    </>
  );
}

function StoryDotsLayer({
  colors,
  scrollY,
  sectionHeight,
}: {
  colors: ReturnType<typeof useThemeColors>;
  scrollY: SharedValue<number>;
  sectionHeight: number;
}) {
  const accentDots = [
    colors.somaAccent1,
    colors.somaAccent2,
    colors.somaAccent3,
    colors.somaAccent4,
    colors.somaAccent5,
  ];

  const layerStyle = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;
    const edgeFade = interpolate(
      global,
      [0, 0.45, 1.0, 4.9, 5.35, 5.9],
      [0, 0, 1, 1, 0.35, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity:
        interpolate(global, [0, 0.35, 0.72, 1.12], [0, 0, 0.45, 1], Extrapolation.CLAMP) * edgeFade,
    };
  }, [sectionHeight]);

  return (
    <Animated.View pointerEvents="none" style={[styles.storyDotsLayer, layerStyle]}>
      {accentDots.map((dotColor, dotIndex) => (
        <StoryDot
          key={`${dotColor}-${dotIndex}`}
          color={dotColor}
          index={dotIndex}
          scrollY={scrollY}
          sectionHeight={sectionHeight}
        />
      ))}
    </Animated.View>
  );
}

function InterSectionAura({
  colors,
  scrollY,
  sectionHeight,
}: {
  colors: ReturnType<typeof useThemeColors>;
  scrollY: SharedValue<number>;
  sectionHeight: number;
}) {
  const auraClock = useSharedValue(0);

  useEffect(() => {
    auraClock.value = withRepeat(withTiming(1, { duration: 22000, easing: Easing.linear }), -1, false);
  }, [auraClock]);

  const sharedEnvelope = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;
    const phase = ((global % 1) + 1) % 1;
    const between = 1 - Math.abs(phase - 0.5) * 2;
    const betweenVisibility = interpolate(
      between,
      [0, 0.18, 0.45, 0.72, 1],
      [0.5, 0.58, 0.68, 0.76, 0.82],
      Extrapolation.CLAMP
    );
    const bottomZone = interpolate(global, [4.6, 4.95, 5.9], [0, 1, 1], Extrapolation.CLAMP);
    const visibility = betweenVisibility * (1 - bottomZone) + bottomZone;
    const edgeFade = interpolate(
      global,
      [0, 0.45, 1.0, 4.9, 5.35, 5.9],
      [0, 0, 1, 1, 0.94, 0.9],
      Extrapolation.CLAMP
    );
    const bottomBreath = 0.5 + 0.5 * Math.sin(auraClock.value * Math.PI * 2 * 0.45);
    const breathScale = interpolate(bottomBreath, [0, 1], [0.98, 1.12], Extrapolation.CLAMP);

    return {
      opacity: clamp(
        edgeFade * visibility,
        0,
        0.94
      ),
      transform: [{ scale: interpolate(bottomZone, [0, 1], [1, breathScale], Extrapolation.CLAMP) }],
    };
  }, [sectionHeight, auraClock]);

  const auraOuterStyle = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;
    const phase = ((global % 1) + 1) % 1;
    const between = 1 - Math.abs(phase - 0.5) * 2;
    const betweenSections = interpolate(
      between,
      [0, 0.18, 0.45, 0.72, 1],
      [0.72, 0.76, 0.82, 0.88, 0.92],
      Extrapolation.CLAMP
    );
    const bottomPresence = interpolate(global, [4.6, 4.95, 5.9], [0, 1, 1], Extrapolation.CLAMP);
    const visibility = betweenSections * (1 - bottomPresence) + bottomPresence;
    const breath = 0.5 + 0.5 * Math.sin(auraClock.value * Math.PI * 2 * 0.5 + 0);
    const growth = interpolate(global, [0, 1, 2, 3, 4, 5], [0.62, 0.7, 0.78, 0.86, 0.94, 1], Extrapolation.CLAMP);
    const layerOpacity = 0.16;

    return {
      opacity: clamp(layerOpacity * visibility, 0, 0.25),
      transform: [
        {
          scale: interpolate(breath, [0, 1], [0.96, 1.08], Extrapolation.CLAMP) * growth,
        },
      ],
      borderColor: colors.somaPrimary,
    };
  }, [sectionHeight, colors, auraClock]);

  const auraMidLargeStyle = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;
    const phase = ((global % 1) + 1) % 1;
    const between = 1 - Math.abs(phase - 0.5) * 2;
    const betweenSections = interpolate(
      between,
      [0, 0.18, 0.45, 0.72, 1],
      [0.7, 0.74, 0.8, 0.86, 0.9],
      Extrapolation.CLAMP
    );
    const bottomPresence = interpolate(global, [4.6, 4.95, 5.9], [0, 1, 1], Extrapolation.CLAMP);
    const visibility = betweenSections * (1 - bottomPresence) + bottomPresence;
    const breath = 0.5 + 0.5 * Math.sin(auraClock.value * Math.PI * 2 * 0.5 + 0.6);
    const growth = interpolate(global, [0, 1, 2, 3, 4, 5], [0.62, 0.7, 0.78, 0.86, 0.94, 1], Extrapolation.CLAMP);
    const layerOpacity = 0.14;

    return {
      opacity: clamp(layerOpacity * visibility, 0, 0.22),
      transform: [
        {
          scale: interpolate(breath, [0, 1], [0.95, 1.07], Extrapolation.CLAMP) * growth,
        },
      ],
      borderColor: colors.somaPrimary,
    };
  }, [sectionHeight, colors, auraClock]);

  const auraInnerStyle = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;
    const phase = ((global % 1) + 1) % 1;
    const between = 1 - Math.abs(phase - 0.5) * 2;
    const betweenSections = interpolate(
      between,
      [0, 0.18, 0.45, 0.72, 1],
      [0.72, 0.76, 0.82, 0.88, 0.92],
      Extrapolation.CLAMP
    );
    const bottomPresence = interpolate(global, [4.6, 4.95, 5.9], [0, 1, 1], Extrapolation.CLAMP);
    const visibility = betweenSections * (1 - bottomPresence) + bottomPresence;
    const breath = 0.5 + 0.5 * Math.sin(auraClock.value * Math.PI * 2 * 0.5 + 1.2);
    const growth = interpolate(global, [0, 1, 2, 3, 4, 5], [0.62, 0.7, 0.78, 0.86, 0.94, 1], Extrapolation.CLAMP);
    const layerOpacity = 0.15;

    return {
      opacity: clamp(layerOpacity * visibility, 0, 0.28),
      transform: [
        {
          scale: interpolate(breath, [0, 1], [0.94, 1.06], Extrapolation.CLAMP) * growth,
        },
      ],
      borderColor: colors.somaPrimary,
    };
  }, [sectionHeight, colors, auraClock]);

  const auraMidSmallStyle = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;
    const phase = ((global % 1) + 1) % 1;
    const between = 1 - Math.abs(phase - 0.5) * 2;
    const betweenSections = interpolate(
      between,
      [0, 0.18, 0.45, 0.72, 1],
      [0.68, 0.72, 0.78, 0.84, 0.88],
      Extrapolation.CLAMP
    );
    const bottomPresence = interpolate(global, [4.6, 4.95, 5.9], [0, 1, 1], Extrapolation.CLAMP);
    const visibility = betweenSections * (1 - bottomPresence) + bottomPresence;
    const breath = 0.5 + 0.5 * Math.sin(auraClock.value * Math.PI * 2 * 0.5 + 1.8);
    const growth = interpolate(global, [0, 1, 2, 3, 4, 5], [0.62, 0.7, 0.78, 0.86, 0.94, 1], Extrapolation.CLAMP);
    const layerOpacity = 0.13;

    return {
      opacity: clamp(layerOpacity * visibility, 0, 0.24),
      transform: [
        {
          scale: interpolate(breath, [0, 1], [0.93, 1.05], Extrapolation.CLAMP) * growth,
        },
      ],
      borderColor: colors.somaPrimary,
    };
  }, [sectionHeight, colors, auraClock]);

  const auraCoreStyle = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;
    const phase = ((global % 1) + 1) % 1;
    const between = 1 - Math.abs(phase - 0.5) * 2;
    const betweenSections = interpolate(
      between,
      [0, 0.18, 0.45, 0.72, 1],
      [0.72, 0.76, 0.82, 0.88, 0.92],
      Extrapolation.CLAMP
    );
    const bottomPresence = interpolate(global, [4.6, 4.95, 5.9], [0, 1, 1], Extrapolation.CLAMP);
    const visibility = betweenSections * (1 - bottomPresence) + bottomPresence;
    const breath = 0.5 + 0.5 * Math.sin(auraClock.value * Math.PI * 2 * 0.5 + 2.4);
    const growth = interpolate(global, [0, 1, 2, 3, 4, 5], [0.62, 0.7, 0.78, 0.86, 0.94, 1], Extrapolation.CLAMP);
    const layerOpacity = 0.12;

    return {
      opacity: clamp(layerOpacity * visibility, 0, 0.22),
      transform: [
        {
          scale: interpolate(breath, [0, 1], [0.92, 1.04], Extrapolation.CLAMP) * growth,
        },
      ],
      borderColor: colors.somaPrimary,
    };
  }, [sectionHeight, colors, auraClock]);

  return (
    <Animated.View pointerEvents="none" style={[styles.interSectionAuraLayer, sharedEnvelope]}>
      <Animated.View style={[styles.interSectionAuraOuter, auraOuterStyle]} />
      <Animated.View style={[styles.interSectionAuraMidLarge, auraMidLargeStyle]} />
      <Animated.View style={[styles.interSectionAuraInner, auraInnerStyle]} />
      <Animated.View style={[styles.interSectionAuraMidSmall, auraMidSmallStyle]} />
      <Animated.View style={[styles.interSectionAuraCore, auraCoreStyle]} />
    </Animated.View>
  );
}

function TransitionVeil({
  colors,
  scrollY,
  sectionHeight,
}: {
  colors: ReturnType<typeof useThemeColors>;
  scrollY: SharedValue<number>;
  sectionHeight: number;
}) {
  const veilStyle = useAnimatedStyle(() => {
    const global = scrollY.value / sectionHeight;
    const phase = global % 1;
    const distanceFromCenter = Math.abs(phase - 0.5) * 2;
    const veil = interpolate(distanceFromCenter, [0, 0.45, 0.8, 1], [0, 0.02, 0.09, 0.14], Extrapolation.CLAMP);
    const edgeFade = interpolate(
      global,
      [0, 0.45, 1.0, 4.9, 5.35, 5.9],
      [0, 0, 1, 1, 0.45, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity: veil * edgeFade,
    };
  }, [sectionHeight]);

  return <Animated.View pointerEvents="none" style={[styles.transitionVeil, { backgroundColor: colors.somaBackground }, veilStyle]} />;
}

function IntroDot({
  index,
  color,
  progress,
}: {
  index: number;
  color: string;
  progress: SharedValue<number>;
}) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 + index * 150, easing: Easing.sin }),
        withTiming(0, { duration: 1200 + index * 150, easing: Easing.sin })
      ),
      -1,
      false
    );
  }, [pulse, index]);

  const animatedStyle = useAnimatedStyle(() => {
    const local = clamp((progress.value - index * 0.08) / 0.38, 0, 1);
    const pulseScale = 0.9 + pulse.value * 0.2;

    return {
      opacity: local,
      transform: [
        { translateY: interpolate(local, [0, 1], [14, 0], Extrapolation.CLAMP) },
        { scale: interpolate(local, [0, 1], [0.5, 1], Extrapolation.CLAMP) * pulseScale },
      ],
    };
  }, [index]);

  return <Animated.View style={[styles.introDot, { backgroundColor: color }, animatedStyle]} />;
}

function IntroSection({
  colors,
  scrollY,
  sectionHeight,
}: {
  colors: ReturnType<typeof useThemeColors>;
  scrollY: SharedValue<number>;
  sectionHeight: number;
}) {
  const progress = useSectionProgress(scrollY, 0, sectionHeight);
  const sectionStyle = useSectionBlendStyle(scrollY, 0, sectionHeight);
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [float]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(float.value, [0, 1], [0, -10], Extrapolation.CLAMP) },
      { scale: interpolate(progress.value, [0, 1], [0.88, 1], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(progress.value, [0, 1], [0.2, 1], Extrapolation.CLAMP),
  }));

  return (
    <View style={[styles.section, { minHeight: sectionHeight }]}>
      <Animated.View style={[styles.sectionInner, sectionStyle]}>
        <Text style={[styles.kicker, { color: colors.somaPrimary }]}>SOMA</Text>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <View style={[styles.logoHalo, { backgroundColor: colors.somaSurfaceStrong }]} />
            <SomaLogo width="100%" height="100%" color={colors.somaLogo} />
        </Animated.View>
        <Text style={[styles.heroTitle, { color: colors.somaText }]}>Scroll to Begin your Daily Peace.</Text>
        <Text style={[styles.heroBody, { color: colors.somaTextMuted }]}>A soft check-in, one breath, and a calmer start.</Text>
        <View style={styles.introDotsRow}>
          {[colors.somaAccent1, colors.somaAccent2, colors.somaAccent3, colors.somaAccent4, colors.somaAccent5].map(
            (dotColor, dotIndex) => (
              <IntroDot key={`${dotColor}-${dotIndex}`} color={dotColor} index={dotIndex} progress={progress} />
            )
          )}
        </View>
      </Animated.View>
    </View>
  );
}

function MoodNode({
  index,
  point,
  progress,
  pulse,
  colors,
}: {
  index: number;
  point: { x: number; y: number };
  progress: SharedValue<number>;
  pulse: SharedValue<number>;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const local = clamp((progress.value - index * 0.07) / 0.34, 0, 1);
    const size = 14 * local * (0.92 + pulse.value * 0.08);

    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity: local,
      transform: [
        { translateX: point.x },
        { translateY: point.y },
        { scale: interpolate(local, [0, 1], [0.4, 1], Extrapolation.CLAMP) },
      ],
    };
  }, [index, point.x, point.y]);

  return <Animated.View style={[styles.moodNode, { backgroundColor: colors.somaAccent2 }, animatedStyle]} />;
}

function MoodDialSection({
  colors,
  scrollY,
  sectionHeight,
}: {
  colors: ReturnType<typeof useThemeColors>;
  scrollY: SharedValue<number>;
  sectionHeight: number;
}) {
  const progress = useSectionProgress(scrollY, 1, sectionHeight);
  const sectionStyle = useSectionBlendStyle(scrollY, 1, sectionHeight);
  const pulse = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    rotation.value = withRepeat(withTiming(360, { duration: 10000, easing: Easing.linear }), -1, false);
  }, [pulse, rotation]);

  const ringOuterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.98 + pulse.value * 0.08 }],
    opacity: 0.45 + pulse.value * 0.2,
  }));

  const ringInnerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.98 + pulse.value * 0.06 }],
    opacity: 0.55 + pulse.value * 0.2,
  }));

  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.12 }],
  }));

  const nodesRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.section, { minHeight: sectionHeight }]}>
      <Animated.View style={[styles.sectionInner, sectionStyle]}>
        <Text style={[styles.sectionTitle, { color: colors.somaText }]}>Choose how you feel</Text>
        <Text style={[styles.sectionBody, { color: colors.somaTextMuted }]}>A quiet orbit for emotional awareness before the exercise begins.</Text>
        <View style={styles.moodStage}>
          <View style={[styles.moodAuraLarge, { backgroundColor: colors.somaAccent4, opacity: 0.1 }]} />
          <View style={[styles.moodAuraSmall, { backgroundColor: colors.somaAccent3, opacity: 0.14 }]} />
          <Animated.View style={[styles.moodRingOuter, { borderColor: colors.somaPrimary }, ringOuterStyle]} />
          <Animated.View style={[styles.moodRingInner, { borderColor: colors.somaAccent5 }, ringInnerStyle]} />
          <Animated.View style={[styles.moodCore, { backgroundColor: colors.somaAccent1 }, coreStyle]} />
          <Animated.View style={[styles.moodNodesLayer, nodesRotationStyle]}>
            {DIAL_NODE_POINTS.map((point, nodeIndex) => (
              <MoodNode
                key={`${point.x}-${point.y}`}
                colors={colors}
                index={nodeIndex}
                point={point}
                progress={progress}
                pulse={pulse}
              />
            ))}
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

function DurationOption({
  label,
  detail,
  index,
  progress,
  colors,
}: {
  label: string;
  detail: string;
  index: number;
  progress: SharedValue<number>;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const local = clamp((progress.value - index * 0.18) / 0.45, 0, 1);

    return {
      opacity: 0.35 + local * 0.65,
      transform: [
        { translateY: interpolate(local, [0, 1], [22, 0], Extrapolation.CLAMP) },
        { scale: interpolate(local, [0, 1], [0.92, 1], Extrapolation.CLAMP) },
      ],
    };
  }, [index]);

  return (
    <Animated.View
      style={[
        styles.durationPill,
        {
          backgroundColor: colors.somaSurface,
          borderColor: colors.somaOutline,
        },
        Shadows.soft,
        animatedStyle,
      ]}
    >
      <Text style={[styles.durationLabel, { color: colors.somaText }]}>{label}</Text>
      <Text style={[styles.durationDetail, { color: colors.somaTextMuted }]}>{detail}</Text>
    </Animated.View>
  );
}

function DurationSection({
  colors,
  scrollY,
  sectionHeight,
}: {
  colors: ReturnType<typeof useThemeColors>;
  scrollY: SharedValue<number>;
  sectionHeight: number;
}) {
  const progress = useSectionProgress(scrollY, 2, sectionHeight);
  const sectionStyle = useSectionBlendStyle(scrollY, 2, sectionHeight);

  return (
    <View style={[styles.section, { minHeight: sectionHeight }]}>
      <Animated.View style={[styles.sectionInner, sectionStyle]}>
        <Text style={[styles.sectionTitle, { color: colors.somaText }]}>Choose a 30 sec or 1 minute exercise</Text>
        <Text style={[styles.sectionBody, { color: colors.somaTextMuted }]}>A brief reset when you need it, or a little more room when you have it.</Text>
        <View style={styles.durationWrap}>
          <DurationOption colors={colors} detail="quick grounding" index={0} label="30 seconds" progress={progress} />
          <DurationOption colors={colors} detail="a deeper pause" index={1} label="1 minute" progress={progress} />
        </View>
      </Animated.View>
    </View>
  );
}

function BreathWave({
  colors,
  index,
  phase,
  progress,
  d,
}: {
  colors: ReturnType<typeof useThemeColors>;
  index: number;
  phase: SharedValue<number>;
  progress: SharedValue<number>;
  d: string;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const amplitude = (12 - index * 2) * progress.value;
    const offset = Math.sin(phase.value * Math.PI * 2 + index * 0.55) * amplitude;

    return {
      opacity: 0.28 + progress.value * (0.28 + index * 0.08),
      transform: [{ translateY: offset }],
    };
  }, [index]);

  return (
    <Animated.View style={[styles.waveLayer, animatedStyle]}>
      <Svg viewBox="0 0 360 140" width="100%" height="100%">
        <Path
          d={d}
          fill="none"
          stroke={index === 1 ? colors.somaAccent4 : colors.somaAccent5}
          strokeLinecap="round"
          strokeWidth={index === 1 ? 6 : 5}
        />
      </Svg>
    </Animated.View>
  );
}

function BreathSection({
  colors,
  scrollY,
  sectionHeight,
}: {
  colors: ReturnType<typeof useThemeColors>;
  scrollY: SharedValue<number>;
  sectionHeight: number;
}) {
  const progress = useSectionProgress(scrollY, 3, sectionHeight);
  const sectionStyle = useSectionBlendStyle(scrollY, 3, sectionHeight);
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.sin) }), -1, false);
  }, [phase]);

  return (
    <View style={[styles.section, { minHeight: sectionHeight }]}>
      <Animated.View style={[styles.sectionInner, sectionStyle]}>
        <Text style={[styles.sectionTitle, { color: colors.somaText }]}>Follow Along & Breathe</Text>
        <Text style={[styles.sectionBody, { color: colors.somaTextMuted }]}>The waves open and settle like an inhale and exhale rhythm.</Text>
        <View style={styles.waveStage}>
          <View style={[styles.waveGlow, { backgroundColor: colors.somaAccent4, opacity: 0.12 }]} />
          {BREATH_WAVE_PATHS.map((d, waveIndex) => (
            <BreathWave key={`${d}-${waveIndex}`} colors={colors} d={d} index={waveIndex} phase={phase} progress={progress} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

function ScanPoint({
  index,
  point,
  cycle,
  progress,
  colors,
}: {
  index: number;
  point: { x: number; y: number };
  cycle: SharedValue<number>;
  progress: SharedValue<number>;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const target = index / (BODY_SCAN_POINTS.length - 1);
    const distance = Math.abs(cycle.value - target);
    const active = clamp(1 - distance / 0.16, 0, 1) * progress.value;
    const size = 12 + active * 8;

    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity: 0.2 + active * 0.8,
      transform: [
        { translateX: point.x - size / 2 },
        { translateY: point.y - size / 2 },
        { scale: 0.92 + active * 0.18 },
      ],
    };
  }, [index, point.x, point.y]);

  return <Animated.View style={[styles.scanPoint, { backgroundColor: colors.somaAccent1 }, animatedStyle]} />;
}

function BodyScanSection({
  colors,
  scrollY,
  sectionHeight,
}: {
  colors: ReturnType<typeof useThemeColors>;
  scrollY: SharedValue<number>;
  sectionHeight: number;
}) {
  const progress = useSectionProgress(scrollY, 4, sectionHeight);
  const sectionStyle = useSectionBlendStyle(scrollY, 4, sectionHeight);
  const cycle = useSharedValue(0);

  useEffect(() => {
    cycle.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 0 }),
        withTiming(0, { duration: 550 })
      ),
      -1,
      false
    );
  }, [cycle]);

  return (
    <View style={[styles.section, { minHeight: sectionHeight }]}>
      <Animated.View style={[styles.sectionInner, sectionStyle]}>
        <Text style={[styles.sectionTitle, { color: colors.somaText }]}>Settle into your body</Text>
        <Text style={[styles.sectionBody, { color: colors.somaTextMuted }]}>Scan points wake up from head to toe, then ease back into stillness.</Text>
        <View style={styles.bodyStage}>
          <View style={[styles.bodyGlow, { backgroundColor: colors.somaAccent3, opacity: 0.12 }]} />
          <Svg viewBox="0 0 204 220" width="204" height="220">
            <Path
              d="M102 20 C137 20, 137 60, 122 86 C112 102, 112 138, 102 184 C92 138, 92 102, 82 86 C67 60, 67 20, 102 20 Z"
              fill={colors.somaSurfaceStrong}
              stroke={colors.somaOutline}
              strokeWidth={2}
            />
          </Svg>
          <View pointerEvents="none" style={styles.scanPointOverlay}>
            {BODY_SCAN_POINTS.map((point, pointIndex) => (
              <ScanPoint key={`${point.x}-${point.y}`} colors={colors} cycle={cycle} index={pointIndex} point={point} progress={progress} />
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function CTASection({
  colors,
  scrollY,
  sectionHeight,
  onContinue,
}: {
  colors: ReturnType<typeof useThemeColors>;
  scrollY: SharedValue<number>;
  sectionHeight: number;
  onContinue: () => Promise<void>;
}) {
  const sectionStyle = useSectionBlendStyle(scrollY, 5, sectionHeight);

  return (
    <View style={[styles.section, styles.ctaSection, { minHeight: sectionHeight * 0.92 }]}>
      <Animated.View style={[styles.sectionInner, sectionStyle]}>
        <Text style={[styles.kicker, { color: colors.somaPrimary }]}>FINAL STEP</Text>
        <Text style={[styles.heroTitle, { color: colors.somaText }]}>Notice a Difference.</Text>
        <Text style={[styles.sectionBody, { color: colors.somaTextMuted }]}>Small shifts count. Start here, then let the rest of the day meet you differently.</Text>
        <Pressable
          accessibilityHint="Begins the app experience and hides onboarding for future visits"
          accessibilityLabel="Let's Begin"
          accessibilityRole="button"
          onPress={onContinue}
          style={({ pressed }) => [
            styles.ctaButton,
            {
              backgroundColor: colors.somaPrimary,
              borderColor: colors.somaPrimary,
            },
            Shadows.soft,
            pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] },
          ]}
        >
          <Text style={[styles.ctaButtonText, { color: colors.somaButtonText }]}>Let&apos;s Begin</Text>
        </Pressable>
        {TEST_MODE ? (
          <Text style={[styles.noteText, { color: colors.somaTextMuted }]}>Test mode is active, so onboarding will continue to show until TEST_MODE is disabled.</Text>
        ) : null}
        <Text style={[styles.noteText, { color: colors.somaTextMuted }]}>All data is currently stored locally on your device. Account features are coming soon.</Text>
      </Animated.View>
    </View>
  );
}

export default function Welcome() {
  const colors = useThemeColors();
  const { height, width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const [checking, setChecking] = useState(true);
  const sectionHeight = Math.max(height * 0.9, 620);

  useEffect(() => {
    if (TEST_MODE) {
      setChecking(false);
      return;
    }

    (async () => {
      const seen = await AsyncStorage.getItem('hasSeenWelcome');

      if (seen) {
        router.replace('/(tabs)');
        return;
      }

      setChecking(false);
    })();
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  async function onContinue() {
    if (!TEST_MODE) {
      await AsyncStorage.setItem('hasSeenWelcome', '1');
    }

    router.replace('/(tabs)');
  }

  if (checking) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.somaBackground }]}>
      <View style={styles.screen}>
        <AmbientBackdrop colors={colors} scrollY={scrollY} sectionHeight={sectionHeight} />
        <InterSectionAura colors={colors} scrollY={scrollY} sectionHeight={sectionHeight} />
        <StoryDotsLayer colors={colors} scrollY={scrollY} sectionHeight={sectionHeight} />
        <Animated.ScrollView
          contentContainerStyle={{
            paddingBottom: Spacing.section,
            paddingHorizontal: Spacing.lg,
          }}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <View style={[styles.flowWrap, { maxWidth: width > 768 ? 520 : undefined }]}>
            <IntroSection colors={colors} scrollY={scrollY} sectionHeight={sectionHeight} />
            <MoodDialSection colors={colors} scrollY={scrollY} sectionHeight={sectionHeight} />
            <DurationSection colors={colors} scrollY={scrollY} sectionHeight={sectionHeight} />
            <BreathSection colors={colors} scrollY={scrollY} sectionHeight={sectionHeight} />
            <BodyScanSection colors={colors} scrollY={scrollY} sectionHeight={sectionHeight} />
            <CTASection colors={colors} onContinue={onContinue} scrollY={scrollY} sectionHeight={sectionHeight} />
          </View>
        </Animated.ScrollView>
        <TransitionVeil colors={colors} scrollY={scrollY} sectionHeight={sectionHeight} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  flowWrap: {
    alignSelf: 'center',
    width: '100%',
  },
  backdropBlob: {
    position: 'absolute',
    borderRadius: 999,
  },
  storyDotsLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  interSectionAuraLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  interSectionAuraOuter: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 999,
    borderWidth: 26,
    backgroundColor: 'transparent',
  },
  interSectionAuraInner: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    borderWidth: 18,
    backgroundColor: 'transparent',
  },
  interSectionAuraMidLarge: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 999,
    borderWidth: 22,
    backgroundColor: 'transparent',
  },
  interSectionAuraMidSmall: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 999,
    borderWidth: 14,
    backgroundColor: 'transparent',
  },
  interSectionAuraCore: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 999,
    borderWidth: 12,
    backgroundColor: 'transparent',
  },
  storyDot: {
    position: 'absolute',
    top: '50%',
    width: 11,
    height: 11,
    borderRadius: 999,
  },
  storyDotTrail: {
    position: 'absolute',
    top: '50%',
    width: 17,
    height: 17,
    borderRadius: 999,
  },
  transitionVeil: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  section: {
    justifyContent: 'center',
  },
  ctaSection: {
    paddingBottom: Spacing.xl,
  },
  sectionInner: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  kicker: {
    ...Typography.caption,
    fontSize: 12,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  logoWrap: {
    width: 240,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoHalo: {
    position: 'absolute',
    width: 214,
    height: 150,
    borderRadius: 999,
    opacity: 0.65,
  },
  heroTitle: {
    ...Typography.title,
    fontSize: 38,
    lineHeight: 46,
    maxWidth: 360,
  },
  heroBody: {
    ...Typography.body,
    maxWidth: 320,
  },
  introDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  introDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
  sectionTitle: {
    ...Typography.bodyHeadingTitle,
    fontSize: 28,
    lineHeight: 34,
    maxWidth: 360,
  },
  sectionBody: {
    ...Typography.body,
    maxWidth: 336,
  },
  moodStage: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodAuraLarge: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 999,
  },
  moodAuraSmall: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 999,
  },
  moodRingOuter: {
    position: 'absolute',
    width: 164,
    height: 164,
    borderRadius: 999,
    borderWidth: 2,
  },
  moodRingInner: {
    position: 'absolute',
    width: 98,
    height: 98,
    borderRadius: 999,
    borderWidth: 2,
  },
  moodCore: {
    width: 20,
    height: 20,
    borderRadius: 999,
  },
  moodNodesLayer: {
    position: 'absolute',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodNode: {
    position: 'absolute',
    left: 143,
    top: 143,
  },
  durationWrap: {
    width: '100%',
    gap: Spacing.md,
  },
  durationPill: {
    borderRadius: Radii.xl,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    gap: 4,
  },
  durationLabel: {
    ...Typography.bodyHeadingTitle,
    fontSize: 24,
    marginBottom: 0,
  },
  durationDetail: {
    ...Typography.body,
    fontSize: 14,
  },
  waveStage: {
    width: '100%',
    maxWidth: 360,
    height: 220,
    justifyContent: 'center',
  },
  waveGlow: {
    position: 'absolute',
    alignSelf: 'center',
    width: 260,
    height: 140,
    borderRadius: 999,
  },
  waveLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  bodyStage: {
    width: 220,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyGlow: {
    position: 'absolute',
    width: 180,
    height: 220,
    borderRadius: 999,
  },
  scanPointOverlay: {
    position: 'absolute',
    width: 204,
    height: 220,
  },
  scanPoint: {
    position: 'absolute',
  },
  ctaButton: {
    minWidth: 220,
    borderRadius: Radii.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    ...Typography.bodyHeadingTitle,
    fontSize: 18,
    marginBottom: 0,
  },
  noteText: {
    ...Typography.caption,
    maxWidth: 320,
  },
});
