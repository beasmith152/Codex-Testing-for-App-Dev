import { useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Easing,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { getMoodStats, moodColors } from "../../src/hooks/useMoodStats";
import CircularProgress from "../../src/components/CircularProgress"; // ✅ import circular tracker
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useFonts } from 'expo-font';
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useTheme } from "@/src/context/ThemeContext";
import { Typography} from '@/constants/theme';
import SomaLogo from "../../assets/images/soma-logo.svg";

const DOT_COLORS = ["#F16C5B", "#D48EB0", "#A6C49F", "#79A9D1", "#97BA7A"];

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
  const sideDotsAnim = useRef(new Animated.Value(0)).current;
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const colors = useThemeColors();
  const { theme } = useTheme();
  const [fontsLoaded] = useFonts({
  Plante: require("../../assets/fonts/Plante.ttf"),Biro: require("../../assets/fonts/biro.otf")  // <-- update path if different
});
useEffect(() => {
  (async () => {
    try {
      const saved = await AsyncStorage.getItem("profilePicUri");
      if (saved) setProfileUri(saved);
    } catch (e) {
      // ignore load errors for now
      console.warn("Could not load profile URI:", e);
    }
  })();
}, []);

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        fadeAnim.setValue(0);
        sideDotsAnim.setValue(0);

        const data = await getMoodStats();
        setStats(data);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(160),
            Animated.timing(sideDotsAnim, {
              toValue: 1,
              duration: 900,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(sideDotsAnim, {
              toValue: 0,
              duration: 900,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      };
      loadStats();
    }, [fadeAnim, sideDotsAnim])
  );

  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.somaBackground }]}>
        <Text style={[Typography.title, { color: colors.somaText }]}>Mood Tracker</Text>
        <Text style={[Typography.subtitle, { color: colors.somaTextMuted }]}>No data yet — start a session and come back to track your progress!</Text>
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
      style={[styles.scrollContainer, { backgroundColor: colors.somaBackground }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
       <ImageBackground
     
    >
      <View style={styles.innerContainer}>
          <Pressable
  style={styles.avatarWrap}
  onPress={() => router.push("/(tabs)/dashboard")}
  accessibilityRole="button"
  accessibilityLabel="Open dashboard"
>
  {profileUri ? (
    <Image source={{ uri: profileUri }} style={styles.avatarSmall} />
  ) : (
    <View style={[styles.avatarSmall, styles.avatarFallback, { backgroundColor: colors.somaPrimary }]}>
      <Text style={styles.avatarEmoji}>🙂</Text>
    </View>
  )}
</Pressable>
        <View style={styles.logo}>
            <SomaLogo color={colors.somaLogo} width="175%" height="175%" />
          </View>
        <Text style={[styles.title, { color: colors.somaText }]}>Mood Chart</Text>

        {/* Summary cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.somaTertiary + '100' }]}>
            <Text style={[styles.statNumber, { color: colors.somaText }]}>{stats.totalExercises}</Text>
            <Text style={[styles.statLabel, { color: colors.somaTextMuted }]}>Exercises</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.somaTertiary + '100' }]}>
            <Text style={[styles.statNumber, { color: colors.somaText }]}>
              {Math.floor(stats.totalTime / 60)}m {stats.totalTime % 60}s
            </Text>
            <Text style={[styles.statLabel, { color: colors.somaTextMuted }]}>Time Spent</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.somaTertiary + '100' }]}>
            <Text style={[styles.statNumber, { color: colors.somaText }]}>{stats.avgMood}</Text>
            <Text style={[styles.statLabel, { color: colors.somaTextMuted }]}>Avg Mood</Text>
          </View>
        </View>

        <Animated.Text style={[Typography.body, { opacity: fadeAnim, color: colors.somaSecondary }]}>
          {getMoodMessage(stats.avgMood)}
        </Animated.Text>

          <View style={styles.dotsRow}>
            {DOT_COLORS.map((c, i) => {
              const isAnimatedSideDot = i !== 2;

              if (!isAnimatedSideDot) {
                return <View key={i} style={[styles.dot, { backgroundColor: c }]} />;
              }

              const isLeftDot = i < 2;
              const isOuterDot = i === 0 || i === 4;
              const translateX = sideDotsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, isLeftDot ? (isOuterDot ? -24 : -16) : (isOuterDot ? 24 : 16)],
              });

              const scale = sideDotsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              });

              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.dot,
                    { backgroundColor: c },
                    { transform: [{ translateX }, { scale }] },
                  ]}
                />
              );
            })}
          </View>

        {/* 🗓️ Calendar */}
        <Calendar
          key={`calendar-${theme}`}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          style={styles.calendar}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: colors.somaSecondary,
            selectedDayBackgroundColor: colors.somaText,
            todayTextColor: colors.somaLogo,
            dayTextColor: colors.somaTextMuted,
            monthTextColor: colors.somaSecondary,
            arrowColor: colors.somaLogo,
            borderRadius: 10,
          }}
        />

        {/* 🌿 Circular progress BELOW calendar */}
        <View style={styles.progressContainer}>
          <Text style={[styles.progressHeader, { color: colors.somaSecondary }]}>Time spent maintaining peace!</Text>
          <CircularProgress 
            progress={progress} 
            totalMinutes={totalMinutes}
            textColor={colors.somaSecondary}
            labelColor={colors.somaSecondary}
          />
        </View>
      </View>

      {/* 🌙 Scrollable modal */}
      <Modal visible={!!selectedDay} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContainer, { backgroundColor: colors.somaBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.somaText }]}>
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
                <Text style={[styles.modalText, { color: colors.somaText }]}>No sessions recorded 🌿</Text>
              ) : (
                dayData.map((s, i) => (
                  <View key={i} style={[styles.modalCard, { backgroundColor: colors.somaTertiary + '20' }]}>
                    <Text style={[styles.modalText, { color: colors.somaText }]}>
                      Mood: {s.mood} | {s.exercise}
                    </Text>
                    <Text style={[styles.modalSubText, { color: colors.somaTextMuted }]}>
                      Duration: {s.duration}s
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>

            <Pressable
              onPress={() => setSelectedDay(null)}
              style={[styles.modalButton, { backgroundColor: colors.somaPrimary }]}
            >
              <Text style={[styles.modalButtonText, { color: '#fff' }]}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
   logo: {
    width: 100,
    height: 65,
    marginTop:-20,
    marginBottom: 15,
    marginLeft: -25,
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingBottom: 20, // 🧭 prevents clipping at bottom
  },
  innerContainer: {
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontFamily: "Plante",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
  },
   dotsRow: {
    flexDirection: "row",
    marginBottom: 12,
    marginTop: 12,
    justifyContent: "center",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 5,
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
  },
  statLabel: { fontSize: 13 },
  moodMessageFull: {
    marginBottom: 6,
    marginTop: 10,
    paddingHorizontal: 24,
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
  },
  calendar: {
    width: "95%",
    marginBottom: 24, // adds space before progress tracker
    marginLeft: 10,
    borderRadius: 10,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  progressHeader: {
    fontSize: 26,
    fontFamily: "Biro",
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxHeight: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 12,
  },
  modalCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    width: "90%",
  },
  modalText: { fontSize: 18, marginBottom: 4 },
  modalSubText: { fontSize: 13 },
  modalButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalButtonText: {
    fontWeight: "700",
  },
    avatarWrap: {
  marginRight: 24,
  marginTop: 36,
  position: "relative",
  alignContent: "center",
  justifyContent: "center",
  alignItems: "flex-end",
},
avatarSmall: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "#E0DAD6",
  overflow: "hidden",
},
avatarFallback: {
  justifyContent: "center",
  alignItems: "center",
},
avatarEmoji: {
  fontSize: 20,
},
container: {
  flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title2:{
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "80%",
  },
});
