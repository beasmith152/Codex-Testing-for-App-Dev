import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";


const moods = [
  { label: "😊", name: "Happy" },
  { label: "😌", name: "Calm" },
  { label: "😴", name: "Tired" },
  { label: "😔", name: "Sad" },
  { label: "😤", name: "Stressed" },
  { label: "😣", name: "Anxious" },
];

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>

      <View style={styles.grid}>
        {moods.map((mood) => (
          <Pressable
            key={mood.name}
            style={[
              styles.moodButton,
              selectedMood === mood.name && styles.selected,
            ]}
            onPress={() => {
  setSelectedMood(mood.name);
  router.push("/exercise-flow");
}}
          >
            <Text style={styles.emoji}>{mood.label}</Text>
            <Text
              style={[
                styles.moodLabel,
                selectedMood === mood.name && styles.selectedLabel,
              ]}
            >
              {mood.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {selectedMood && (
        <Text style={styles.confirm}>
          You’re feeling <Text style={styles.moodName}>{selectedMood}</Text> 🌿
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F6EDE3",
    paddingVertical: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: "#403F3A",
    fontWeight: "700",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  moodButton: {
    width: 90,
    height: 90,
    backgroundColor: "#EAD8CA",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
  },
  emoji: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: 14,
    color: "#403F3A",
    marginTop: 4,
  },
  selected: {
    backgroundColor: "#EFAF2E",
  },
  selectedLabel: {
    color: "#F6EDE3",
    fontWeight: "700",
  },
  confirm: {
    fontSize: 16,
    marginTop: 20,
    color: "#507050",
  },
  moodName: {
    fontWeight: "700",
  },
});
