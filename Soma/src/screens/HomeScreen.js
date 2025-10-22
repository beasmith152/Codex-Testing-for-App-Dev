import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.hi}>Welcome to Soma 🌿</Text>
      <Text style={styles.sub}>Feel grounded again.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6EDE3", // warm beige
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  hi: { fontSize: 28, color: "#403F3A", fontWeight: "700", marginBottom: 8 },
  sub: { fontSize: 16, color: "#403F3A" },
});
