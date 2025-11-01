import { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // 👈 new import
import { getSessions, clearSessions } from "../../src/hooks/useSessionStorage";

export default function DashboardScreen() {
  const [sessions, setSessions] = useState([]);

  // 👇 replaces useEffect
  useFocusEffect(
    useCallback(() => {
      const loadSessions = async () => {
        const data = await getSessions();
        setSessions(data.reverse()); // newest first
      };
      loadSessions();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard 📊</Text>
      <Text style={styles.subtitle}>Track your moods and sessions here.</Text>

      {sessions.length === 0 ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Mood data visualization coming soon 🌿
          </Text>
          <Text style={styles.empty}>No sessions yet — start one today!</Text>
        </View>
      ) : (
        <View style={styles.sessionList}>
          {sessions.map((s, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.cardText}>
                {new Date(s.date).toLocaleString()}
              </Text>
              <Text style={styles.cardText}>
                Mood: <Text style={styles.bold}>{s.mood}</Text>
              </Text>
              <Text style={styles.cardText}>
                Exercise: <Text style={styles.bold}>{s.exercise}</Text>
              </Text>
              <Text style={styles.cardText}>Duration: {s.duration}s</Text>
            </View>
          ))}

          <Pressable style={styles.clearButton} onPress={clearSessions}>
            <Text style={styles.clearText}>Clear History</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6EDE3",
    alignItems: "center",
    justifyContent: "flex-start",
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
    marginBottom: 10,
  },
  empty: {
    color: "#507050",
    marginTop: 4,
    fontStyle: "italic",
  },
  sessionList: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#EAD8CA",
    padding: 10,
    borderRadius: 12,
    marginVertical: 6,
    width: "90%",
  },
  cardText: { color: "#403F3A" },
  bold: { fontWeight: "700" },
  clearButton: {
    marginTop: 20,
    backgroundColor: "#EFAF2E",
    padding: 10,
    borderRadius: 8,
  },
  clearText: { color: "#403F3A", fontWeight: "700" },
});
