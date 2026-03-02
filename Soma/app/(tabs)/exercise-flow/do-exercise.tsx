import React, { useRef, useMemo } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Svg, { Rect, Text as SvgText, Path } from "react-native-svg";
import Timer from "../../../src/components/Timer";
import { saveSession } from "../../../src/hooks/useSessionStorage";
import { useMood } from "../../../src/context/MoodContext";
import { useFonts } from 'expo-font';
import { useThemeColors } from "@/hooks/use-theme-colors";

export const unstable_settings = {
  headerShown: false,
};
// Predefined wave Y positions for the breathing background

const WAVE_Y_POSITIONS = [20, 54, 88, 122, 156, 190, 224, 258, 292, 326, 360];

const buildWavePath = (y: number) =>
  `M0 ${y} C40 ${y - 44}, 80 ${y + 44}, 120 ${y} S200 ${y - 44}, 240 ${y} S320 ${y + 44}, 360 ${y}`;

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

function BreathWavesBackground({
  colors,
}: {
  colors: ReturnType<typeof useThemeColors>;
}) {
  const waveAnims = useRef(
    WAVE_Y_POSITIONS.map(() => new Animated.Value(0))
  ).current;

  useFocusEffect(
    React.useCallback(() => {
      waveAnims.forEach((anim) => anim.setValue(0));

      const timing = (value: Animated.Value, toValue: number) =>
        Animated.timing(value, {
          toValue,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        });

      const inhale = Animated.stagger(
        100,
        waveAnims.map((value) => timing(value, 1))
      );

      const exhale = Animated.stagger(
        100,
        waveAnims.map((value) => timing(value, 0))
      );

      const breathLoop = Animated.loop(Animated.sequence([inhale, exhale]));
      breathLoop.start();

      return () => {
        breathLoop.stop();
      };
    }, [waveAnims])
  );

  return (
    <View pointerEvents="none" style={styles.breathBackground}>
      <View style={styles.breathStage}>
        <Svg width="100%" height="100%" viewBox="0 0 420 220">
          <Rect
            x="20"
            y="20"
            width="380"
            height="180"
            rx="18"
            fill={colors.somaBackground}
          />
          <SvgText
            x="210"
            y="55"
            textAnchor="middle"
            fill={withAlpha(colors.somaText,1.0)}
            fontSize="15"
            fontWeight="700"
            letterSpacing={3}
          >
            BREATHE
          </SvgText>
        </Svg>

        <View style={styles.wavesOverlay}>
          {WAVE_Y_POSITIONS.map((waveY, index) => {
            const opacity = waveAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0.35, 0.95],
            });

            const translateY = waveAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [8, 0],
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.waveLayer,
                  {
                    opacity,
                    transform: [{ translateY }],
                  },
                ]}
              >
                <Svg width="100%" height="100%" viewBox="0 0 360 420">
                  <Path
                    d={buildWavePath(waveY)}
                    fill="none"
                    stroke={
                      index % 3 === 0
                        ? withAlpha(colors.somaPrimary, 0.72)
                        : index % 3 === 1
                        ? withAlpha(colors.somaTime, 0.62)
                        : withAlpha(colors.somaMode, 0.56)
                    }
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                </Svg>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function DoExercise() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { mood } = useMood();
const [fontsLoaded] = useFonts({
    Plante: require("../../../assets/fonts/Plante.ttf"),Biro: require("../../../assets/fonts/biro.otf")  // <-- update path if different
  });
  const colors = useThemeColors();
  // Normalize handle (string | string[]) values
  const norm = (v: any, fallback = "") =>
    Array.isArray(v) ? (v[0] ?? fallback) : (v ?? fallback);

  const id = norm(params.id, "exercise");
  const label = norm(params.label, "Exercise");
  const exerciseTitle = norm(params.exerciseTitle, label);
  const gif = norm(params.gif);
  const definition = norm(params.definition);
  const vibe = norm(params.vibe);
  const concept = norm(params.concept);
  const runId = norm(params.runId, "default"); // stable run id from PreExerciseScreen
  const parsedDuration = Number(norm(params.duration, "60")) || 60;

  const timerRef = useRef<{ stop: () => void } | null>(null);

  // Use runId to force a true remount when re-selecting the same exercise
  const timerKey = useMemo(
    () => `${id}-${parsedDuration}-${runId}`,
    [id, parsedDuration, runId]
  );

  const handleStop = () => {
    if (timerRef.current?.stop) timerRef.current.stop();
    router.replace("/(tabs)/exercise-flow");
  };

  const handleComplete = async () => {
    // ⏱️ stamp with local-time day key + numeric ts (prevents UTC “yesterday” bug)
    const now = new Date();
    const ts = now.getTime();
    const dateLocalKey = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    const session = {
      mood: mood || "Unknown",
      exercise: exerciseTitle,
      duration: parsedDuration,
      // keep all three for compatibility with older readers
      ts,
      dateLocalKey,
      dateISO: now.toISOString(),
    };

    await saveSession(session);
    router.replace("/(tabs)/exercise-flow/complete");
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingBottom: insets.bottom || 16, backgroundColor: colors.somaBackground }]}
    >
      <BreathWavesBackground colors={colors} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerWrapper}>
           {/* Timer */}
          <Timer
            key={timerKey} // forces remount/reset when runId changes
            ref={timerRef}
            initialSeconds={parsedDuration}
            onComplete={handleComplete}
          />
          {/* Visual */}
          {gif ? (
            <Image source={{ uri: gif }} style={[styles.gif, { shadowColor: colors.somaSecondary }]} />
          ) : (
            <View style={[styles.gif, { justifyContent: "center", shadowColor: colors.somaSecondary }]}> 
              <Text style={{ color: colors.somaText }}>No image provided.</Text>
            </View>
          )}

          {/* Context */}
          <View style={[styles.infoBox, { backgroundColor: colors.somaCard, borderRadius: 16, shadowColor: colors.somaSecondary }]}> 
            <Text style={[styles.sectionTitle, { color: colors.somaText }]} >Definition</Text>
            <Text style={[styles.sectionText, { color: colors.somaTextMuted }]}>
              {definition || "No definition provided."}
            </Text>

            <Text style={[styles.sectionTitle, { color: colors.somaText }]}>Vibe</Text>
            <Text style={[styles.sectionText, { color: colors.somaTextMuted }]}>
              {vibe || "No vibe description provided."}
            </Text>

            <Text style={[styles.sectionTitle, { color: colors.somaText }]}>What to Do</Text>
            <Text style={[styles.sectionText, { color: colors.somaTextMuted }]}>
              {concept || "No instructions available."}
            </Text>
          </View>

         

          {/* Exit */}
          <Pressable style={[styles.dislike, { backgroundColor: colors.somaPrimary }]} onPress={handleStop}>
            <Text style={[styles.dislikeText, { color: colors.somaButtonText}]}>I don’t like this</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  breathBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 0,
  },
  breathStage: {
    width: "145%",
    maxWidth: 760,
    height: 620,
  },
  wavesOverlay: {
    position: "absolute",
    left: 62,
    right: 62,
    top: 64,
    bottom: 24,
  },
  waveLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 0,
  },
  centerWrapper: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
  },
  exerciseTitle: {
    fontSize: 28,
    fontFamily: "Plante",
    marginBottom: 8,
    paddingTop: 60,
    textAlign: "center",
  },
  infoBox: {
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginBottom: 30,
    marginTop: 30,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 4,
    marginTop: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  gif: {
    width: 260,
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 20,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  dislike: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 0,
  },
  dislikeText: {
    fontWeight: "700",
    fontSize: 15,
  },
});
