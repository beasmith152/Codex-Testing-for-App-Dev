// ...existing code...
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function ExercisesScreen() {
  const startExercise = () => {
    Alert.alert("Start Exercise", "Beginning the somatic exercise.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Somatic Exercises 💨</Text>
      <Text style={styles.subtitle}>
        Choose a grounding practice to reconnect with your body.
      </Text>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Start Exercise"
        style={styles.startButton}
        activeOpacity={0.85}
        onPress={startExercise}
      >
        <Text style={styles.startButtonText}>Start Exercise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // ...existing code...
  container: {
    flex: 1,
    backgroundColor: "#F6EDE3",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    color: "#403F3A",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#403F3A",
    textAlign: "center",
  },

  // Start button using Soma's theme colors (harmonizes with existing palette)
  startButton: {
    marginTop: 20,
    backgroundColor: "#E07A5F", // Soma accent color
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    elevation: 2,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});