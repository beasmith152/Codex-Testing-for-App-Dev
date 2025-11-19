import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { getMoodStats } from "../../src/hooks/useMoodStats";
import { exerciseLibrary } from "./exercise-flow"; // ✅ make sure this import path matches your folder
import { moodColors } from "../../src/hooks/useMoodStats";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
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
        <Text style={styles.title}>Loading Dashboard...</Text>
      </View>
    );
  }

  // ✅ Select “Exercise of the Day”
  let exerciseOfTheDay: any = null;

  if (stats?.recentExercise) {
    // Try to find the recorded exercise in your library (case-insensitive)
    const searchName = stats.recentExercise.toLowerCase();
    for (const category of Object.values(exerciseLibrary)) {
      for (const variant of Object.values(category)) {
        if (variant.label.toLowerCase() === searchName) {
          exerciseOfTheDay = variant;
          break;
        }
      }
      if (exerciseOfTheDay) break;
    }
  }

  // ✅ fallback: pick a random exercise if none matched
  if (!exerciseOfTheDay) {
    const categories = Object.values(exerciseLibrary);
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomVariant =
      Object.values(randomCategory)[
        Math.floor(Math.random() * Object.values(randomCategory).length)
      ];
    exerciseOfTheDay = randomVariant;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
      source={require("../../assets/images/soma-bg.png")}
      style={{ flex: 1 }}
      imageStyle={{ resizeMode: "cover", opacity: 0.3, marginTop: -40, height: '100%'  }}
    >
      {/* Summary Section */}
       <Image
                     source={require("../../assets/images/soma-logo.png")}
                      style={styles.logo}
                      resizeMode="contain"
                    />
      <Text style={styles.title}>Dashboard</Text>
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

      {/* 🌿 Last Completed Section */}
      <Animated.View style={[styles.exerciseCard, { opacity: fadeAnim }]}>
        <Text style={styles.sectionHeader}>Last Completed</Text>

        {exerciseOfTheDay ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(tabs)/exercise-flow/do-exercise",
                params: {
                  id: exerciseOfTheDay.label,
                  duration: exerciseOfTheDay.duration,
                  gif: exerciseOfTheDay.gif,
                  label: exerciseOfTheDay.label,
                  definition: exerciseOfTheDay.definition,
                  vibe: exerciseOfTheDay.vibe,
                  concept: exerciseOfTheDay.concept,
                },
              })
            }
          >
            <View style={styles.cardContent}>
              <Image
                source={{ uri: exerciseOfTheDay.gif }}
                style={styles.exerciseImage}
              />
              <View style={styles.overlay}>
                <Text style={styles.exerciseLabel}>
                  {exerciseOfTheDay.label}
                </Text>
                <Text style={styles.exerciseVibe}>
                  {exerciseOfTheDay.vibe}
                </Text>
                <Text style={styles.exerciseDef}>
                  {exerciseOfTheDay.definition}
                </Text>
              </View>
            </View>
          </Pressable>
        ) : (
          <Text style={styles.noExerciseText}>
            You haven’t completed any exercises yet 🌿
          </Text>
        )}
      </Animated.View>
          {/* Settings CTA (below Last Completed) */}
      <View style={styles.settingsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.settingsButton,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => router.push("/settings")}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Text style={styles.settingsText}>Settings</Text>
        </Pressable>
      </View>
       </ImageBackground>
    </ScrollView>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6EDE3",
  },
   logo: {
    width: 100,
    height: 65,
    marginTop:0,
    marginBottom: 15,
    marginLeft: 20,
  },
  scrollContent: {
    paddingTop: 70,
    paddingBottom: 100,
  },
  title: {
    fontSize: 26,
    color: "#1B3100",
    fontWeight: "700",
    marginBottom: 20,
    marginLeft: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
  },
  statCard: { alignItems: "center", width: "30%" },
  statNumber: { fontSize: 18, fontWeight: "700", color: "#403F3A" },
  statLabel: { color: "#507050", fontSize: 13 },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#403F3A",
    marginBottom: 12,
  },
  exerciseCard: {
    width: "90%",
    backgroundColor: "#EAD8CA",
    borderRadius: 16,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginLeft:20,
    marginBottom: 110,
  },
  cardContent: {
    position: "relative",
    alignItems: "center",
  },
  exerciseImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(64,63,58,0.7)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 10,
  },
  exerciseLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  exerciseVibe: {
    color: "#EFAF2E",
    fontSize: 14,
    marginBottom: 2,
  },
  exerciseDef: {
    color: "#FFF",
    fontSize: 13,
  },
  noExerciseText: {
    color: "#403F3A",
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
  },
  settingsRow: {
    width: "100%",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 36,
  },
  settingsButton: {
    width: "90%",
    backgroundColor: "#1B3100",
    borderColor: "#1B3100",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  settingsText: {
    color: "#ffffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});
