import React, { useRef, useMemo } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import Timer from "../../../src/components/Timer";
import { saveSession } from "../../../src/hooks/useSessionStorage";
import { useMood } from "../../../src/context/MoodContext";
import { useFonts } from 'expo-font';
import { useThemeColors } from "@/hooks/use-theme-colors";

export const unstable_settings = {
  headerShown: false,
};

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerWrapper}>
          

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

          {/* Visual */}
          {gif ? (
            <Image source={{ uri: gif }} style={[styles.gif, { shadowColor: colors.somaSecondary }]} />
          ) : (
            <View style={[styles.gif, { justifyContent: "center", shadowColor: colors.somaSecondary }]}> 
              <Text style={{ color: colors.somaText }}>No image provided.</Text>
            </View>
          )}

          {/* Timer */}
          <Timer
            key={timerKey} // forces remount/reset when runId changes
            ref={timerRef}
            initialSeconds={parsedDuration}
            onComplete={handleComplete}
          />

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
    marginBottom: 24,
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
    marginBottom: 24,
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
