import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function ExerciseChoice() {
  const exercises = [
    { id: "breath30", label: "30-Second Breath", duration: 30, gif: "https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif" },
    { id: "ground60", label: "1-Minute Grounding", duration: 60, gif: "https://media.giphy.com/media/8YutMatqkTfSE/giphy.gif" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick your practice 🌿</Text>
      {exercises.map((ex) => (
        <Pressable
          key={ex.id}
          style={styles.card}
          onPress={() => router.push({ pathname: "/exercise-flow/do-exercise", params: { id: ex.id, duration: ex.duration, gif: ex.gif } })}
        >
          <Image source={{ uri: ex.gif }} style={styles.preview} />
          <Text style={styles.label}>{ex.label}</Text>
          <Text style={styles.duration}>{ex.duration} seconds</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6EDE3", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#403F3A", marginBottom: 20, textAlign: "center" },
  card: {
    backgroundColor: "#EAD8CA",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  preview: { width: 250, height: 150, borderRadius: 12 },
  label: { fontSize: 18, fontWeight: "700", color: "#403F3A", marginTop: 8 },
  duration: { color: "#507050" },
});
