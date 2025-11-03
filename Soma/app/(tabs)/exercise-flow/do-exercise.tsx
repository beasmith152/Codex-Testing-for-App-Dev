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
  const { id, duration, gif, label, definition, vibe, concept } =
    useLocalSearchParams();
  const parsedDuration = Number(duration);
  const { mood } = useMood();

  const timerRef = useRef<{ stop: () => void } | null>(null);

  const timerKey = useMemo(
    () => `${id || "exercise"}-${parsedDuration}-${Date.now()}`,
    [id, parsedDuration]
  );

  const handleStop = () => {
    if (timerRef.current?.stop) {
      timerRef.current.stop();
    }
    router.replace("/(tabs)/exercise-flow");
  };

  const handleComplete = async () => {
    const session = {
      mood: mood || "Unknown",
      exercise: label || "Unknown Exercise",
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
          <Text style={styles.exerciseTitle}>{label || "Exercise"}</Text>

          {/* 🌿 Context Info */}
          <View style={styles.infoBox}>
            <Text style={styles.sectionTitle}>Definition</Text>
            <Text style={styles.sectionText}>{definition}</Text>

            <Text style={styles.sectionTitle}>Vibe</Text>
            <Text style={styles.sectionText}>{vibe}</Text>

            <Text style={styles.sectionTitle}>What to Do</Text>
            <Text style={styles.sectionText}>{concept}</Text>
          </View>

          {/* 🌿 Exercise Visual */}
          <Image source={{ uri: gif as string }} style={styles.gif} />

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
  container: {
    flex: 1,
    backgroundColor: "#F6EDE3",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center", // ✅ centers vertically
    alignItems: "center", // ✅ centers horizontally
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  centerWrapper: {
    width: "100%",
    maxWidth: 380, // ✅ keeps layout neat on wide screens
    alignItems: "center",
  },
  exerciseTitle: {
    fontSize: 28,
    color: "#403F3A",
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    color: "#507050",
    fontWeight: "600",
    marginBottom: 16,
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
