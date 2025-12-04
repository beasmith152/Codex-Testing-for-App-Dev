import {
  View,
  Text,
  Pressable,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useMood } from "../../../src/context/MoodContext";
import { useFonts } from 'expo-font';

export const unstable_settings = {
  headerShown: false,
};
const moodEmojiMap: Record<string, string> = {
  happy: "😊",
  calm: "😌",
  tired: "😴",
  sad: "😔",
  stressed: "😤",
  anxious: "😣",
  baseline: "🙂", // fallback for neutral baseline
};
// ✅ Exported so it can be imported elsewhere (like dashboard.tsx)
export const exerciseLibrary = {
  Stressed: {
    micro: {
      label: "Box Breathing",
      definition: "Feeling tight, overwhelmed, or tense.",
      vibe: "Too much pressure or racing thoughts.",
      concept:
        "Inhale for 4s, hold for 4s, exhale for 4s, pause for 4s. Repeat 2–3 cycles slowly.",
      duration: 30,
      gif: "https://boxbreathingexercise.com/wp-content/uploads/2025/09/5-4-5-4-Box-Breathing.gif",
      link: "https://missionconnectionhealthcare.com/mental-health/anxiety/breathwork-and-grounding-techniques/",
    },
    regular: {
      label: "Clench & Release",
      definition: "Feeling physical or mental tension building up.",
      vibe: "Need to release the pressure inside.",
      concept:
        "Make fists, hold tight for 3–5 seconds, then release and notice the tension leaving your body.",
      duration: 60,
      gif: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/db159c46-651f-4d6d-8a47-7bcfbe2c4f09/d6x0r2x-4c4ba06e-f607-45a0-b77b-2d526cb07f42.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi9kYjE1OWM0Ni02NTFmLTRkNmQtOGE0Ny03YmNmYmUyYzRmMDkvZDZ4MHIyeC00YzRiYTA2ZS1mNjA3LTQ1YTAtYjc3Yi0yZDUyNmNiMDdmNDIuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.43uLXV2aRRvBh5Cd5BNIyk82NXEJ9TvGkkBxoCEEigo",
      link: "https://en.wikipedia.org/wiki/Progressive_muscle_relaxation",
    },
  },
  Restless: {
    micro: {
      label: "Shake Out",
      definition: "Feeling fidgety or full of buzzing energy.",
      vibe: "Can’t sit still — need to discharge energy.",
      concept:
        "Shake arms, hands, and legs to let kinetic energy move through. Keep breathing steadily.",
      duration: 30,
      gif: "https://static.wixstatic.com/media/95de45_57bfe9af1af54a3aa65830212e25dfe8~mv2.gif",
      link: "https://rickhanson.com/somatic-exercises-for-anxiety/",
    },
    regular: {
      label: "Feet Grounding",
      definition: "Feeling scattered or jittery.",
      vibe: "Need to anchor yourself in the present.",
      concept:
        "Press your feet firmly into the ground, wiggle your toes, and feel the weight settle.",
      duration: 60,
      gif: "https://dropinblog.com/uploaded/blogs/34239387/files/PF_Exercises/Plantar_Fasciitis_1.gif",
      link: "https://therapywisdom.com/somatic-exercises-anxiety-thai/",
    },
  },
  Drained: {
    micro: {
      label: "Spine Stretch",
      definition: "Feeling heavy, tired, or unmotivated.",
      vibe: "Low energy, needing to recharge gently.",
      concept:
        "Sit upright, gently arch back, roll shoulders up and down, then stretch your neck slowly.",
      duration: 30,
      gif: "https://media.post.rvohealth.io/wp-content/uploads/sites/3/2023/11/400x400_SEATED-BACK_PAIN_STRETCHES_FOR_SENIORS_Seated_Ceiling_Reach_Stretch.gif",
      link: "https://www.hopkinsmedicine.org/office-of-well-being/connection-support/somatic-self-care",
    },
    regular: {
      label: "Self-Hug",
      definition: "Feeling emotionally or physically depleted.",
      vibe: "Wanting to feel safe and comforted.",
      concept:
        "Wrap your arms around yourself, squeeze gently, breathe deeply, and soften your shoulders.",
      duration: 60,
      gif: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/01/GRT-2.01.BearHugStretch.gif",
      link: "https://rickhanson.com/somatic-exercises-for-anxiety/",
    },
  },
  Distracted: {
    micro: {
      label: "5-4-3-2-1 Grounding",
      definition: "Feeling scattered, distracted, or foggy.",
      vibe: "Hard to focus or stay in the moment.",
      concept:
        "Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste — reconnect to your senses.",
      duration: 30,
      gif: "https://veteranbenefitsaustralia.com/wp-content/uploads/2023/10/6.gif",
      link: "https://missionconnectionhealthcare.com/mental-health/anxiety/breathwork-and-grounding-techniques/",
    },
    regular: {
      label: "Eye Palming / Orientation",
      definition: "Mind racing or attention drifting.",
      vibe: "Overstimulated and foggy.",
      concept:
        "Close eyes, gently place palms over them, then open slowly and take in your surroundings calmly.",
      duration: 60,
      gif: "https://media.happiesthealth.com/2022/10/3_palming.gif",
      link: "https://life-care-wellness.com/5-somatic-experiencing-techniques-that-anyone-can-use-to-stay-grounded/",
    },
  },
  Baseline: {
    micro: {
      label: "Belly / Diaphragmatic Breath",
      definition: "Feeling neutral or steady — maintaining your baseline.",
      vibe: "Calm and centered.",
      concept:
        "Place your hand on your belly. Inhale so it rises, then exhale slowly to relax your body.",
      duration: 30,
      gif: "https://drconniedepinho.org/wp-content/uploads/2024/01/image.gif",
      link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10741869/",
    },
    regular: {
      label: "Mini Body Scan",
      definition: "Feeling balanced but wanting to check in.",
      vibe: "Steady and aware.",
      concept:
        "Bring awareness from feet to head. Notice tension and gently release each area as you breathe.",
      duration: 60,
      gif: "https://miro.medium.com/1*mbP9PCrVgPiESgElVE12Xw.gif",
      link: "https://www.yogawithrachelmarie.com/post/somatic-grounding-exercises",
    },
  },
};

// 🧭 Map app moods → exercise categories
const moodToExerciseGroup: Record<string, keyof typeof exerciseLibrary> = {
  happy: "Baseline",
  calm: "Baseline",
  tired: "Drained",
  sad: "Drained",
  stressed: "Stressed",
  anxious: "Restless",
};

export default function ExerciseChoice() {
  const insets = useSafeAreaInsets();
  const { mood } = useMood();
  const [fontsLoaded] = useFonts({
    Plante: require("../../../assets/fonts/Plante.ttf"),Biro: require("../../../assets/fonts/biro.otf")  // <-- update path if different
  });

  const normalizedMood = mood?.toLowerCase() || "baseline";
const mappedMood = moodToExerciseGroup[normalizedMood] || "Baseline";
const moodExercises = exerciseLibrary[mappedMood];

const emoji = moodEmojiMap[normalizedMood] ?? "🌿";
const capitalizedMood =
  normalizedMood.charAt(0).toUpperCase() + normalizedMood.slice(1);

  return (
     
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingBottom: insets.bottom || 16, backgroundColor: "#F6EDE3" },
      ]}
    >
      <ImageBackground
      source={require("../../../assets/images/soma-bg.png")}
      style={{ flex: 1 }}
      imageStyle={{ resizeMode: "cover", opacity: 0.3 }}
    >

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {mood
            ? `${mood.charAt(0).toUpperCase() + mood.slice(1)} Exercises `
            : "Pick your practice "}
        </Text>
       {mood ? (
  <View style={styles.emojiFrame} accessibilityLabel={`${capitalizedMood} emoji`}>
    <Text style={styles.emojiText}>{emoji}</Text>
  </View>
) : (
  <Text style={styles.title2}>Pick your practice 🌿</Text>
)}

        {Object.entries(moodExercises).map(([type, ex]) => (
          <Pressable
            key={type}
            style={({ pressed }) => [
              styles.card,
              pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
            ]}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/exercise-flow/PreExerciseScreen",
                params: {
                  id: `${mappedMood}-${type}`,
                  duration: String(ex.duration),     // ← stringify for params
                  gif: ex.gif,
                  label: ex.label,
                  definition: ex.definition,
                  vibe: ex.vibe,
                  concept: ex.concept,
                  runId: String(Date.now()),         // ← NEW: unique per tap
                },
              })
            }
          >
            <Image source={{ uri: ex.gif }} style={styles.preview} />
            <Text style={styles.label}>
              {type === "micro" ? "Micro Exercise" : "Regular Exercise"}: {ex.label}
            </Text>
            <Text style={styles.concept}>{ex.concept}</Text>
            <Text style={styles.duration}>{ex.duration} seconds</Text>

            <Pressable onPress={() => Linking.openURL(ex.link)}>
              <Text style={styles.link}>Learn More ↗</Text>
            </Pressable>
          </Pressable>
        ))}
      </ScrollView>
       </ImageBackground>
    </SafeAreaView>
   
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
     paddingTop: 70,
    alignItems: "",
  },
  title: {
    fontSize: 25,
    fontFamily: "Plante",
    color: "#1B3100",
    marginBottom: 24,
    textAlign: "center",
  },
 emojiFrame: {
  width: 72,
  height: 72,
  borderRadius: 36,
  backgroundColor: "#fafafaff", // dark circle color — change to match theme
  alignSelf: "center",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 18,
  // subtle elevation / shadow
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.48,
  shadowRadius: 8,
  elevation: 4,
},
emojiText: {
  fontSize: 34,
  color: "#FFFFFF", // white emoji for contrast
  lineHeight: 36,
},
  card: {
    backgroundColor: "#fff6f0ff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  preview: { width: "100%", height: 160, borderRadius: 12, marginBottom: 10 },
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#403F3A",
    marginBottom: 6,
    textAlign: "center",
  },
  concept: { fontSize: 14, color: "#403F3A", marginBottom: 8, textAlign: "center" },
  duration: { color: "#507050", fontSize: 13, marginBottom: 6 },
  link: { color: "#507050", fontSize: 13, textDecorationLine: "underline" },
});
