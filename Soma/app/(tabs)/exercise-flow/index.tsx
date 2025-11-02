import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

// Hide the default header (black bar)
export const unstable_settings = {
  headerShown: false,
};

export default function ExerciseChoice() {
  const insets = useSafeAreaInsets();

  const exercises = [
    {
      id: "breath30",
      label: "30-Second Breath",
      duration: 30,
      gif: "https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif",
    },
    {
      id: "ground60",
      label: "1-Minute Grounding",
      duration: 60,
      gif: "https://media.giphy.com/media/8YutMatqkTfSE/giphy.gif",
    },
  ];

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
        <Text style={styles.title}>Pick your practice 🌿</Text>

        {exercises.map((ex) => (
          <Pressable
            key={ex.id}
            style={({ pressed }) => [
              styles.card,
              pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
            ]}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/exercise-flow/do-exercise",
                params: { id: ex.id, duration: ex.duration, gif: ex.gif },
              })
            }
          >
            <Image source={{ uri: ex.gif }} style={styles.preview} />
            <Text style={styles.label}>{ex.label}</Text>
            <Text style={styles.duration}>{ex.duration} seconds</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6EDE3",
  },
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
  preview: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#403F3A",
    marginBottom: 4,
  },
  duration: {
    color: "#507050",
    fontSize: 14,
  },
});
