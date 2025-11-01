import { View, Text, StyleSheet } from "react-native";

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar 🗓️</Text>
      <Text style={styles.subtitle}>
        View your daily moods and exercise history.
      </Text>

      {/* placeholder grid */}
      <View style={styles.grid}>
        {Array.from({ length: 30 }).map((_, i) => (
          <View key={i} style={styles.dayBox}>
            <Text style={styles.dayText}>{i + 1}</Text>
          </View>
        ))}
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
    padding: 16,
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
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "90%",
  },
  dayBox: {
    width: 40,
    height: 40,
    margin: 5,
    backgroundColor: "#EAD8CA",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  dayText: {
    color: "#403F3A",
    fontWeight: "600",
  },
});
