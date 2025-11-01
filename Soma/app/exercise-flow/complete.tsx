import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Complete() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Good job! 🎉</Text>
      <Text style={styles.subtitle}>Take a moment to notice how you feel.</Text>

      <Pressable style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>Return Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6EDE3", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "700", color: "#403F3A", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#507050", marginBottom: 24 },
  button: { backgroundColor: "#EFAF2E", padding: 14, borderRadius: 10 },
  buttonText: { color: "#403F3A", fontWeight: "700" },
});
