import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useMood } from "../../../src/context/MoodContext";

export const unstable_settings = {
  headerShown: false,
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
      gif: "https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif",
      link: "https://missionconnectionhealthcare.com/mental-health/anxiety/breathwork-and-grounding-techniques/",
    },
    regular: {
      label: "Clench & Release",
      definition: "Feeling physical or mental tension building up.",
      vibe: "Need to release the pressure inside.",
      concept:
        "Make fists, hold tight for 3–5 seconds, then release and notice the tension leaving your body.",
      duration: 60,
      gif: "https://media.giphy.com/media/8YutMatqkTfSE/giphy.gif",
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
      gif: "https://media.giphy.com/media/l1J9EdzfOSgfyueLm/giphy.gif",
      link: "https://rickhanson.com/somatic-exercises-for-anxiety/",
    },
    regular: {
      label: "Feet Grounding",
      definition: "Feeling scattered or jittery.",
      vibe: "Need to anchor yourself in the present.",
      concept:
        "Press your feet firmly into the ground, wiggle your toes, and feel the weight settle.",
      duration: 60,
      gif: "https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.gif",
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
      gif: "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
      link: "https://www.hopkinsmedicine.org/office-of-well-being/connection-support/somatic-self-care",
    },
    regular: {
      label: "Self-Hug",
      definition: "Feeling emotionally or physically depleted.",
      vibe: "Wanting to feel safe and comforted.",
      concept:
        "Wrap your arms around yourself, squeeze gently, breathe deeply, and soften your shoulders.",
      duration: 60,
      gif: "https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif",
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
      gif: "https://media.giphy.com/media/l4FGuhL4U2WyjdkaY/giphy.gif",
      link: "https://missionconnectionhealthcare.com/mental-health/anxiety/breathwork-and-grounding-techniques/",
    },
    regular: {
      label: "Eye Palming / Orientation",
      definition: "Mind racing or attention drifting.",
      vibe: "Overstimulated and foggy.",
      concept:
        "Close eyes, gently place palms over them, then open slowly and take in your surroundings calmly.",
      duration: 60,
      gif: "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
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
      gif: "https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif",
      link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10741869/",
    },
    regular: {
      label: "Mini Body Scan",
      definition: "Feeling balanced but wanting to check in.",
      vibe: "Steady and aware.",
      concept:
        "Bring awareness from feet to head. Notice tension and gently release each area as you breathe.",
      duration: 60,
      gif: "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
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

  const normalizedMood = mood?.toLowerCase() || "baseline";
  const mappedMood = moodToExerciseGroup[normalizedMood] || "Baseline";
  const moodExercises = exerciseLibrary[mappedMood];

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingBottom: insets.bottom || 16, backgroundColor: "#F6EDE3" },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {mood
            ? `${mood.charAt(0).toUpperCase() + mood.slice(1)} Exercises 🌿`
            : "Pick your practice 🌿"}
        </Text>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F6EDE3" },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#403F3A",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#EAD8CA",
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
