import { View, Text, StyleSheet } from "react-native";

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard 📊</Text>
      <Text style={styles.subtitle}>
        Track your moods and sessions here.
      </Text>

      {/* future area for mood chart / summaries */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Mood data visualization coming soon 🌿
        </Text>
      </View>
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
    marginBottom: 24,
  },
  placeholder: {
    borderWidth: 1,
    borderColor: "#EFAF2E",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  placeholderText: {
    color: "#507050",
    fontSize: 14,
    textAlign: "center",
  },
});
