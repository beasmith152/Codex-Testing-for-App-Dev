import { useEffect } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Timer from "../../src/components/Timer";

export default function DoExercise() {
  const { duration, gif } = useLocalSearchParams();

  const handleStop = () => router.replace("/exercise-flow");
  const handleComplete = () => router.replace("/exercise-flow/complete");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Follow along 🌬️</Text>
      <Image source={{ uri: gif as string }} style={styles.gif} />

        {/* auto-starting timer now calls handleComplete */}
    <Timer initialSeconds={Number(duration)} onComplete={handleComplete} />

      <Pressable style={styles.dislike} onPress={handleStop}>
        <Text style={styles.dislikeText}>I don’t like this</Text>
      </Pressable>

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6EDE3", alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 24, color: "#403F3A", fontWeight: "700", marginBottom: 12 },
  gif: { width: 250, height: 150, borderRadius: 12, marginBottom: 20 },
  dislike: { backgroundColor: "#EAD8CA", padding: 12, borderRadius: 8, marginTop: 10 },
  dislikeText: { color: "#403F3A", fontWeight: "700" },
  complete: { backgroundColor: "#EFAF2E", padding: 12, borderRadius: 8, marginTop: 10 },
  completeText: { color: "#403F3A", fontWeight: "700" },
});
