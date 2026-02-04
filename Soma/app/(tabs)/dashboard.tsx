import React, { useCallback, useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from 'expo-font';
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const colors = useThemeColors();
 const [fontsLoaded] = useFonts({
  Plante: require("../../assets/fonts/Plante.ttf"),Biro: require("../../assets/fonts/biro.otf")  // <-- update path if different
});
// Profile picture state (persisted locally for now)
  const [profileUri, setProfileUri] = useState<string | null>(null);

  // load persisted profile URI when screen mounts
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("profilePicUri");
        if (saved) setProfileUri(saved);
      } catch (e) {
        // ignore load errors for now
      }
    })();
  }, []);
  
  // Stub: replace this with your backend upload logic when ready
  const uploadProfilePic = async (localUri: string) => {
    // Example: POST the file to your server and return remote URL
    // const form = new FormData();
    // form.append('file', { uri: localUri, name: 'avatar.jpg', type: 'image/jpeg' } as any)
    // await fetch('/api/upload', { method: 'POST', body: form })
    await new Promise((r) => setTimeout(r, 700)); // simulate latency
    return { success: true, remoteUrl: localUri }; // currently just echo local one
  };

  const pickImage = async () => {
  try {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // permission object shape varies by version: check both fields
    if (perm?.status === "denied" || (typeof (perm as any)?.granted === "boolean" && !(perm as any).granted)) {
      alert("Permission required to choose a profile picture.");
      return;
    }

    // Safely resolve a mediaTypes constant without throwing if properties are missing
    const anyPicker = ImagePicker as any;
    const pickerMediaTypes =
      (anyPicker.MediaTypeOptions && anyPicker.MediaTypeOptions.Images) ||
      (anyPicker.MediaType && anyPicker.MediaType.Images) ||
      undefined;

    const result = await ImagePicker.launchImageLibraryAsync({
      // only pass mediaTypes when we resolved one — otherwise omit it for maximum compatibility
      ...(pickerMediaTypes ? { mediaTypes: pickerMediaTypes } : {}),
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    // Normalize result shape:
    // new: { canceled: boolean, assets: [{ uri, ... }] }
    // old: { cancelled: boolean, uri }
    let uri: string | undefined;
    if ("canceled" in result) {
      if (result.canceled) return; // user cancelled
      uri = result.assets?.[0]?.uri;
    } else if ((result as any).cancelled === false && (result as any).uri) {
      uri = (result as any).uri;
    } else if (Array.isArray((result as any).assets) && (result as any).assets[0]) {
      uri = (result as any).assets[0].uri;
    }

    if (!uri) return; // cancelled or unexpected shape

    setProfileUri(uri);

    // persist locally (wrap in try/catch)
    try {
      await AsyncStorage.setItem("profilePicUri", uri);
    } catch (e) {
      console.warn("Unable to persist profile URI:", e);
    }

    // call upload stub (replace with actual API)
    await uploadProfilePic(uri);
  } catch (e) {
    console.warn("Image pick error", e);
    alert("Could not select image. Try again.");
  }
};

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
      <View style={[styles.container, { alignItems: "center", backgroundColor: colors.somaBackground }]}>
        <Text style={[styles.title2, { color: colors.somaText }]}>Complete your first exercise to unlock your dashboard</Text>
        <Pressable
          style={({ pressed }) => [
            styles.settingsButton, { marginTop:450 },
            { backgroundColor: colors.somaPrimary, borderColor: colors.somaPrimary },
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => router.push("/settings")}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Text style={styles.settingsText}>Settings</Text>
        </Pressable>
        <Text style={[styles.note, { color: colors.somaTextMuted }]}>
                  Note: Change your color scheme here.
                </Text>
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
      style={[styles.container, { backgroundColor: colors.somaBackground }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
      
      style={{ flex: 1 }}
      
    >
      {/* Summary Section */}
        <Image
        source={require("../../assets/images/soma-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Pressable
        style={styles.profileContainer}
        onPress={pickImage}
        accessibilityRole="button"
        accessibilityLabel="Edit profile picture"
      >
        {profileUri ? (
          <Image source={{ uri: profileUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarEmoji}>🙂</Text>
          </View>
        )}
        <View style={styles.editBadge}>
          <Text style={styles.editText}>✏️</Text>
        </View>
      </Pressable>
<Text style={[styles.note, { color: colors.somaTextMuted }]}>
                        Change profile picture by tapping on the avatar.
                      </Text>
      <Text style={[styles.title, { color: colors.somaText }]}>Dashboard</Text>
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

      {/* 🌿 Last Completed Section */}
      <Animated.View style={[styles.exerciseCard, { backgroundColor: colors.somaCard, opacity: fadeAnim }]}>
        <Text style={[styles.sectionHeader, { color: colors.somaText }]}>Last Completed</Text>

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
          <Text style={[styles.noExerciseText, { color: colors.somaTextMuted }]}>
            You haven't completed any exercises yet 🌿
          </Text>
        )}
      </Animated.View>
          {/* Settings CTA (below Last Completed) */}
      <View style={styles.settingsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.settingsButton,
            { backgroundColor: colors.somaPrimary, borderColor: colors.somaPrimary },
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
    height: '110%',
  },
  title: {
    fontSize: 26,
    color: "#1B3100",
    fontFamily: "Plante",
    marginBottom: 20,
    textAlign: "center",
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
    marginBottom: 50,
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
    marginTop: 0,
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
   profileContainer: {
    alignSelf: "flex-start",
    marginLeft: 0,
    marginBottom: 8,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 130,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 68,
    backgroundColor: "#E0DAD6",
    overflow: "hidden",
  },
  avatarFallback: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E07A5F",
  },
  avatarEmoji: {
    fontSize: 30,
  },
  editBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    backgroundColor: "#1B3100",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  editText: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 14,
  },
  container: {
    flex: 1,
    backgroundColor: "#F6EDE3",
  },
  title2: {
    fontSize: 26,
    color: "#1B3100",
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    width: "80%",
    alignSelf: "center",
    position: "absolute",
    top: "40%",
  },
  note: {
    marginTop: 14,
    color: "#80776F",
    fontSize: 10,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});
