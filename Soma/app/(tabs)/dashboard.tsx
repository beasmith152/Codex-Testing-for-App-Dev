import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getSessions, clearSessions } from "../../src/hooks/useSessionStorage";
import { getMoodStats } from "../../src/hooks/useMoodStats";

// 🌿 Supportive mood message
function getMoodMessage(mood: string) {
  switch (mood) {
    case "Happy":
      return "You’re radiating good energy today ✨ Keep it flowing!";
    case "Calm":
      return "Peaceful and steady — keep honoring that balance 🌿";
    case "Neutral":
      return "You’re grounded. Some days are just about being present.";
    case "Sad":
      return "Gentle reminder: feelings ebb and flow. You’re doing fine 💛";
    case "Stressed":
      return "Take a deep breath — even small pauses make a difference 💨";
    case "Anxious":
      return "Slow and steady, one breath at a time. You’re safe here 🤍";
    default:
      return "Checking in with yourself is what matters most 💚";
  }
}

export default function DashboardScreen() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const data = await getSessions();
        const moodData = await getMoodStats();
        setSessions(data.reverse());
        setStats(moodData);

        // 🌿 Fade-in animation for message
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      };
      loadData();
    }, [])
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={{ backgroundColor: "#F6EDE3" }}
    >
      <Text style={styles.title}>Dashboard </Text>
    

      {/* 🌿 Top stats section */}
      {stats && (
        <>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalExercises}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
  {Math.floor(stats.totalTime / 60)}m {stats.totalTime % 60}s
</Text>
              <Text style={styles.statLabel}>Time Spent</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.avgMood}</Text>
              <Text style={styles.statLabel}>Avg Mood</Text>
            </View>
          </View>

          {/* 💬 Animated supportive message */}
          <Animated.Text style={[styles.moodMessage, { opacity: fadeAnim }]}>
            {getMoodMessage(stats.avgMood)}
          </Animated.Text>
        </>
      )}

      {/* 🌿 Session list */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 24,
    paddingBottom: 80,
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 16,
  },
  statCard: {
    alignItems: "center",
    width: "30%",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#403F3A",
  },
  statLabel: {
    color: "#507050",
    fontSize: 13,
  },
  moodMessage: {
    fontSize: 14,
    color: "#507050",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 24,
    paddingHorizontal: 24,
    lineHeight: 20,
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
    marginBottom: 60,
  },
  clearText: {
    color: "#403F3A",
    fontWeight: "700",
  },
});
