import { View, Text, StyleSheet } from "react-native";

export default function ExercisesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Somatic Exercises 💨</Text>
      <Text style={styles.subtitle}>
        Choose a grounding practice to reconnect with your body.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
import { View, Text, StyleSheet } from "react-native";

export default function ExercisesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Somatic Exercises 💨</Text>
      <Text style={styles.subtitle}>
        Choose a grounding practice to reconnect with your body.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
