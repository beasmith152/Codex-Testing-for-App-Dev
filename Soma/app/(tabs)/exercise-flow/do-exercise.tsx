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

export const unstable_settings = {
  headerShown: false,
};

export default function DoExercise() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { mood } = useMood();

  // ✅ Normalize all params (handles string[] cases)
  const normalize = (v: any, fallback = "") =>
    Array.isArray(v) ? v[0] ?? fallback : v ?? fallback;

  const id = normalize(params.id, "exercise");
  const exerciseTitle = normalize(params.exerciseTitle, params.label || "Exercise"); // ✅ main title
  const gif = normalize(params.gif);
  const definition = normalize(params.definition);
  const vibe = normalize(params.vibe);
  const concept = normalize(params.concept);
  const parsedDuration = Number(normalize(params.duration, "60")) || 60;

  const timerRef = useRef<{ stop: () => void } | null>(null);

  // Unique key ensures timer resets per exercise
  const timerKey = useMemo(
    () => `${id}-${parsedDuration}-${Date.now()}`,
    [id, parsedDuration]
  );

  const handleStop = () => {
    if (timerRef.current?.stop) timerRef.current.stop();
    router.replace("/(tabs)/exercise-flow");
  };

  const handleComplete = async () => {
    const session = {
      mood: mood || "Unknown",
      exercise: exerciseTitle,
      duration: parsedDuration,
      date: new Date().toISOString(),
    };
    await saveSession(session);
    router.replace("/(tabs)/exercise-flow/complete");
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingBottom: insets.bottom || 16, backgroundColor: "#F6EDE3" },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerWrapper}>
          {/* ✅ Exercise Title */}
          <Text style={styles.exerciseTitle}>{exerciseTitle}</Text>

          {/* 🌿 Context Info */}
          <View style={styles.infoBox}>
            <Text style={styles.sectionTitle}>Definition</Text>
            <Text style={styles.sectionText}>
              {definition || "No definition provided."}
            </Text>

            <Text style={styles.sectionTitle}>Vibe</Text>
            <Text style={styles.sectionText}>
              {vibe || "No vibe description provided."}
            </Text>

            <Text style={styles.sectionTitle}>What to Do</Text>
            <Text style={styles.sectionText}>
              {concept || "No instructions available."}
            </Text>
          </View>

          {/* 🌿 Exercise Visual */}
          {gif ? (
            <Image source={{ uri: gif }} style={styles.gif} />
          ) : (
            <View style={[styles.gif, { justifyContent: "center" }]}>
              <Text style={{ color: "#403F3A" }}>No image provided.</Text>
            </View>
          )}

          {/* 🌿 Timer */}
          <Timer
            key={timerKey}
            ref={timerRef}
            initialSeconds={parsedDuration}
            onComplete={handleComplete}
          />

          {/* 🌿 Exit Button */}
          <Pressable style={styles.dislike} onPress={handleStop}>
            <Text style={styles.dislikeText}>I don’t like this</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6EDE3" },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center", // vertically centered
    alignItems: "center", // horizontally centered
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  centerWrapper: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
  },
  exerciseTitle: {
    fontSize: 28,
    color: "#403F3A",
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#EAD8CA",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#403F3A",
    fontWeight: "700",
    marginBottom: 4,
    marginTop: 8,
  },
  sectionText: {
    color: "#507050",
    fontSize: 14,
    lineHeight: 20,
  },
  gif: {
    width: 260,
    height: 160,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  dislike: {
    backgroundColor: "#EAD8CA",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  dislikeText: {
    color: "#403F3A",
    fontWeight: "700",
    fontSize: 15,
  },
});
