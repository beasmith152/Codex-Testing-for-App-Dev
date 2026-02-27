import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  ImageBackground,
  Image,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useMood } from "../../src/context/MoodContext";
import MoodSelector from "../../src/components/MoodSelector";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from 'expo-font';
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Typography } from '@/constants/theme';
import SomaLogo from "../../assets/images/soma-logo.svg";

const DOT_COLORS = ["#F16C5B", "#D48EB0", "#A6C49F", "#79A9D1", "#97BA7A"];

// 🔍 Searchable list (moods + exercises)
const exerciseList = [
  { label: "Box Breathing", mood: "Stressed" },
  { label: "Clench & Release", mood: "Stressed" },
  { label: "Shake Out", mood: "Restless" },
  { label: "Feet Grounding", mood: "Restless" },
  { label: "Spine Stretch", mood: "Drained" },
  { label: "Self-Hug", mood: "Drained" },
  { label: "5-4-3-2-1 Grounding", mood: "Distracted" },
  { label: "Eye Palming / Orientation", mood: "Distracted" },
  { label: "Belly / Diaphragmatic Breath", mood: "Baseline" },
  { label: "Mini Body Scan", mood: "Baseline" },
  { label: "Stressed", mood: "Stressed" },
  { label: "Restless", mood: "Restless" },
  { label: "Drained", mood: "Drained" },
  { label: "Distracted", mood: "Distracted" },
  { label: "Baseline", mood: "Baseline" },
];



// 🌿 Exercise of the Day Library (with all context)
const exerciseLibrary = [
  {
    id: "stressed-micro-box-breathing",
    label: "Box Breathing",
    vibe: "Too much pressure or racing thoughts.",
    definition: "Feeling tight, overwhelmed, or tense.",
    concept:
      "Inhale for 4 seconds, hold for 4, exhale for 4, and pause for 4. Repeat slowly.",
    gif: "https://boxbreathingexercise.com/wp-content/uploads/2025/09/5-4-5-4-Box-Breathing.gif",
    mood: "Stressed",
    duration: 30,
  },
  {
    id: "restless-micro-shake-out",
    label: "Shake Out",
    vibe: "Can’t sit still — need to discharge energy.",
    definition: "Feeling fidgety or full of buzzing energy.",
    concept:
      "Shake arms, hands, and legs to release energy while keeping your breath steady.",
    gif: "https://static.wixstatic.com/media/95de45_57bfe9af1af54a3aa65830212e25dfe8~mv2.gif",
    mood: "Restless",
    duration: 30,
  },
  {
    id: "drained-micro-spine-stretch",
    label: "Spine Stretch",
    vibe: "Low energy, needing to recharge gently.",
    definition: "Feeling heavy, tired, or unmotivated.",
    concept:
      "Sit upright, gently arch back, roll shoulders, and stretch your neck slowly.",
    gif: "https://media.post.rvohealth.io/wp-content/uploads/sites/3/2023/11/400x400_SEATED-BACK_PAIN_STRETCHES_FOR_SENIORS_Seated_Ceiling_Reach_Stretch.gif",
    mood: "Drained",
    duration: 30,
  },
  {
    id: "distracted-regular-54321",
    label: "5-4-3-2-1 Grounding",
    vibe: "Hard to focus or stay in the moment.",
    definition: "Feeling scattered, distracted, or foggy.",
    concept:
      "Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
    gif: "https://veteranbenefitsaustralia.com/wp-content/uploads/2023/10/6.gif",
    mood: "Distracted",
    duration: 60,
  },
  {
    id: "baseline-regular-belly-breath",
    label: "Belly / Diaphragmatic Breath",
    vibe: "Calm and centered.",
    definition: "Feeling neutral or steady — maintaining your baseline.",
    concept:
      "Place your hand on your belly, inhale so it rises, then exhale slowly to relax your body.",
    gif: "https://drconniedepinho.org/wp-content/uploads/2024/01/image.gif",
    mood: "Baseline",
    duration: 60,
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const sideDotsAnim = useRef(new Animated.Value(0)).current;
  const { setMood } = useMood();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [fontsLoaded] = useFonts({
  Plante: require("../../assets/fonts/Plante.ttf"),Biro: require("../../assets/fonts/biro.otf")  // <-- update path if different
});
  const [profileUri, setProfileUri] = useState<string | null>(null);
  
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
      sideDotsAnim.setValue(0);

      const dotsAnimation = Animated.sequence([
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
      ]);

      dotsAnimation.start();

      return () => {
        dotsAnimation.stop();
      };
    }, [sideDotsAnim])
  );

  const filteredExercises = exerciseList.filter((ex) =>
    ex.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exerciseOfTheDay = useMemo(() => {
    const dayIndex = new Date().getDate() % exerciseLibrary.length;
    return exerciseLibrary[dayIndex];
  }, []);

  return (
    
    <SafeAreaView style={[styles.safeArea, { paddingBottom: insets.bottom || 16, backgroundColor: colors.somaBackground }]}>
       <ImageBackground
      
      style={{ flex: 1 }}
      
    >
       <Pressable
  style={styles.avatarWrap}
  onPress={() => router.push("/(tabs)/dashboard")}
  accessibilityRole="button"
  accessibilityLabel="Open dashboard"
>
  {profileUri ? (
    <Image source={{ uri: profileUri }} style={styles.avatarSmall} />
  ) : (
    <View style={[styles.avatarSmall, styles.avatarFallback]}>
      <Text style={styles.avatarEmoji}>🙂</Text>
    </View>
  )}
</Pressable>
    <View style={styles.container}>
          <View style={styles.logo}>
            <SomaLogo color={colors.somaLogo} width="175%" height="175%" />
          </View>
      <Text style={[Typography.subtitle, { color: colors.somaText }]}>Welcome, how are you?</Text>

      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchBar, { color: colors.somaButtonText, backgroundColor: colors.somaSearch }]}
          placeholder="Search exercises or moods..."
          placeholderTextColor={colors.somaTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Text style={[styles.clearText, { color: colors.somaSecondary }]}>×</Text>
          </Pressable>
        )}
      </View>

      {/* 🔎 Floating Overlay for Search Results */}
      {searchQuery.length > 0 && (
        <View style={[styles.overlay, { backgroundColor: colors.somaTertiary }]}>
          <ScrollView
            contentContainerStyle={styles.resultsContainer}
            showsVerticalScrollIndicator={false}
          >
            {filteredExercises.length > 0 ? (
              filteredExercises.map((ex, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.resultCard,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => {
                    setMood(ex.mood.toLowerCase());
                    setSearchQuery("");
                    router.push("/(tabs)/exercise-flow");
                  }}
                >
                  <Text style={[styles.resultLabel, { color: colors.somaSecondary }]}>{ex.label}</Text>
                  <Text style={[styles.resultSub, { color: colors.somaTertiary }]}>{ex.mood}</Text>
                </Pressable>
              ))
            ) : (
              <Text style={[styles.noResults, { color: colors.somaSecondary }]}>No results found</Text>
            )}
          </ScrollView>
        </View>
      )}
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
                      outputRange: [0, isLeftDot ? (isOuterDot ? -18 : -12) : (isOuterDot ? 18 : 12)],
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
      {/* 🌿 Mood Selector + Exercise of the Day (stacked) */}
      <View style={styles.bottomStack}>
        <MoodSelector />

        <View style={styles.exerciseContainer}>
          <Text style={[styles.dailyHeader, { color: colors.somaText }]}>Exercise of the Day</Text>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(tabs)/exercise-flow/do-exercise",
                params: {
                  id: exerciseOfTheDay.id,
                  exerciseTitle: exerciseOfTheDay.label,
                  duration: String(exerciseOfTheDay.duration),
                  gif: exerciseOfTheDay.gif,
                  definition: exerciseOfTheDay.definition,
                  vibe: exerciseOfTheDay.vibe,
                  concept: exerciseOfTheDay.concept,
                },
              })
            }
          >
            <ImageBackground
              source={{ uri: exerciseOfTheDay.gif }}
              style={styles.exerciseImage}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.exerciseOverlay}>
                <Text style={[styles.exerciseTitle, { color: colors.somaCardText }]}>
                  {exerciseOfTheDay.label}
                </Text>
                <Text style={[styles.exerciseVibe, { color: colors.somaButtonText }]}>
                  {exerciseOfTheDay.vibe}
                </Text>
                <Text style={[styles.exerciseDefinition,{ color: colors.somaButtonText }]}>
                  {exerciseOfTheDay.definition}
                </Text>
              </View>
            </ImageBackground>
          </Pressable>
        </View>
      </View>
    </View>
    </ImageBackground>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  logo: {
    width: 100,
    height: 65,
    marginTop:-20,
    marginBottom: 15,
    marginLeft: -50,
  },
  title: {
    fontSize: 24,
    color: "#1B3100",
    marginBottom: 12,
    textAlign: "left",
    fontFamily: 'Biro',
  },
  searchContainer: { position: "relative", width: "100%" },
  searchBar: {
    width: "100%",
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: "#403F3A",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  clearButton: {
    position: "absolute",
    right: 12,
    top: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
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
  backgroundColor: "#E07A5F",
},
avatarEmoji: {
  fontSize: 20,
},
     dotsRow: {
    flexDirection: "row",
    marginBottom: 0,
    marginTop: 24,
    justifyContent: "center",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 5,
  },
  clearText: { fontSize: 20, color: "#403F3A", fontWeight: "700" },
  overlay: {
    position: "absolute",
    top: 150,
    left: 24,
    right: 24,
    backgroundColor: "#f2f1f0ff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 50,
    maxHeight: 220,
    opacity: 0.85,
    padding: 12,
  },
  resultsContainer: { paddingVertical: 10 },
  resultCard: {
    backgroundColor: "#fffefdff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
    opacity:0.95,
  },
  resultLabel: { fontSize: 16, fontWeight: "700", color: "#403F3A" },
  resultSub: { fontSize: 13, color: "#507050" },
  noResults: { textAlign: "center", color: "#403F3A", fontStyle: "italic" },

  // 🧩 Updated layout for proper spacing
  bottomStack: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 5,
  },
  exerciseContainer: {
    width: "100%",
    alignItems: "left",
    marginTop: 0, // 👈 This actually controls spacing below the MoodSelector now
    marginBottom: 40,
  },
  dailyHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#403F3A",
    marginBottom: 12,
    textAlign: "left",
  },
  exerciseImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  exerciseOverlay: {
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  exerciseVibe: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#EAD8CA",
    marginBottom: 2,
  },
  exerciseDefinition: { fontSize: 13, color: "#F6EDE3" },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
