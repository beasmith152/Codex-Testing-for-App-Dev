import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { getMoodStats, moodColors } from "../../src/hooks/useMoodStats";
import CircularProgress from "../../src/components/CircularProgress"; // ✅ import circular tracker

// 🌿 Supportive mood message function
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

export default function CalendarScreen() {
  const [stats, setStats] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dayData, setDayData] = useState<any[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        const data = await getMoodStats();
        setStats(data);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      };
      loadStats();
    }, [])
  );

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Calendar 🗓️</Text>
        <Text style={styles.subtitle}>No data yet — start a session!</Text>
      </View>
    );
  }

  // ✅ Fix UTC offset by forcing the date to local midnight
  const fixUTCOffset = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    const localDate = new Date(
      utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
    );
    return localDate;
  };

  const toLocalKey = (dateString: string) => {
    const d = fixUTCOffset(dateString);
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  };

  const markedDates: Record<string, any> = {};
  Object.entries(stats.byDay).forEach(([day, sessions]: any) => {
    const localKey = toLocalKey(day);
    const avgMood = sessions[Math.floor(sessions.length / 2)].mood || "Neutral";
    markedDates[localKey] = {
      marked: true,
      dotColor: moodColors[avgMood] || "#E0E0E0",
    };
  });

  const handleDayPress = (day: any) => {
    const localKey = toLocalKey(day.dateString);
    const sessions = stats.byDay[localKey] || [];
    setSelectedDay(localKey);
    setDayData(sessions);
  };

  // 🧮 Progress data for circular tracker (1 full circle = 60 min)
  const totalMinutes = Math.floor(stats.totalTime / 60);
  const progress = Math.min((totalMinutes / 60) * 100, 100);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Mood Chart</Text>

        {/* Summary cards */}
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

        <Animated.Text style={[styles.moodMessageFull, { opacity: fadeAnim }]}>
          {getMoodMessage(stats.avgMood)}
        </Animated.Text>

        {/* 🗓️ Calendar */}
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
          style={styles.calendar}
          theme={{
            backgroundColor: "#F6EDE3",
            calendarBackground: "#F6EDE3",
            textSectionTitleColor: "#403F3A",
            selectedDayBackgroundColor: "#EFAF2E",
            todayTextColor: "#EFAF2E",
            dayTextColor: "#403F3A",
            monthTextColor: "#403F3A",
            arrowColor: "#403F3A",
          }}
        />

        {/* 🌿 Circular progress BELOW calendar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressHeader}>Time spent maintaining peace!</Text>
          <CircularProgress progress={progress} totalMinutes={totalMinutes} />
        </View>
      </View>

      {/* 🌙 Scrollable modal */}
      <Modal visible={!!selectedDay} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedDay &&
                fixUTCOffset(selectedDay).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </Text>

            <ScrollView
              contentContainerStyle={{
                alignItems: "center",
                paddingBottom: 20,
              }}
              showsVerticalScrollIndicator={false}
            >
              {dayData.length === 0 ? (
                <Text style={styles.modalText}>No sessions recorded 🌿</Text>
              ) : (
                dayData.map((s, i) => (
                  <View key={i} style={styles.modalCard}>
                    <Text style={styles.modalText}>
                      Mood: {s.mood} | {s.exercise}
                    </Text>
                    <Text style={styles.modalSubText}>
                      Duration: {s.duration}s
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>

            <Pressable
              onPress={() => setSelectedDay(null)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#F6EDE3",
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 120,
    paddingBottom: 20, // 🧭 prevents clipping at bottom
  },
  innerContainer: {
    width: "100%",
    alignItems: "",
  },
  title: {
    fontSize: 26,
    color: "#1B3100",
    fontWeight: "700",
    marginBottom: 16,
    marginLeft: 24,
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
  statCard: { alignItems: "center", width: "30%" },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#403F3A",
  },
  statLabel: { color: "#507050", fontSize: 13 },
  moodMessageFull: {
    marginBottom: 6,
    marginTop: 10,
    paddingHorizontal: 24,
    fontSize: 14,
    color: "#507050",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
  },
  calendar: {
    width: "95%",
    marginBottom: 24, // adds space before progress tracker
    marginLeft: 10,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  progressHeader: {
    fontSize: 15,
    color: "#507050",
    fontWeight: "600",
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxHeight: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#403F3A",
    marginBottom: 12,
  },
  modalCard: {
    backgroundColor: "#F6EDE3",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    width: "90%",
  },
  modalText: { color: "#403F3A", fontSize: 15, marginBottom: 4 },
  modalSubText: { color: "#507050", fontSize: 13 },
  modalButton: {
    marginTop: 10,
    backgroundColor: "#EFAF2E",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#403F3A",
    fontWeight: "700",
  },
});
