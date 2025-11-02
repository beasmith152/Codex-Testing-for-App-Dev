import { useEffect } from "react";
import { View, Text, Image, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import Timer from "../../../src/components/Timer";
import { saveSession } from "../../../src/hooks/useSessionStorage";
import { useMood } from "../../../src/context/MoodContext";

// 👇 Hide header (no top bar)
export const unstable_settings = {
  headerShown: false,
};

export default function DoExercise() {
  const insets = useSafeAreaInsets();
  const { duration, gif } = useLocalSearchParams();
  const parsedDuration = Number(duration); // ✅ ensure numeric
  const { mood } = useMood();

  const handleStop = () => router.replace("/(tabs)/exercise-flow");

  const handleComplete = async () => {
    const session = {
      mood: mood || "Unknown",
      exercise: parsedDuration === 30 ? "30-Second Breath" : "1-Minute Grounding",
      duration: parsedDuration,
      date: new Date().toISOString(),
    };

    await saveSession(session);
    router.replace("/(tabs)/exercise-flow/complete"); // ✅ stays inside (tabs)
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingBottom: insets.bottom || 16, backgroundColor: "#F6EDE3" },
      ]}
    >
      <Text style={styles.title}>Follow along 🌬️</Text>

      <Image source={{ uri: gif as string }} style={styles.gif} />

      {/* ✅ Timer now counts down properly */}
      <Timer initialSeconds={parsedDuration} onComplete={handleComplete} />

      <Pressable style={styles.dislike} onPress={handleStop}>
        <Text style={styles.dislikeText}>I don’t like this</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6EDE3",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    color: "#403F3A",
    fontWeight: "700",
    marginBottom: 16,
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
    marginTop: 28,
  },
  dislikeText: {
    color: "#403F3A",
    fontWeight: "700",
    fontSize: 15,
  },
});
