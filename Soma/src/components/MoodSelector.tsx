import { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { useMood } from "../context/MoodContext";

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
  const { setMood } = useMood();
  const screenWidth = Dimensions.get("window").width;

  // 👇 slightly wider buttons (better text fit) and more spacing
  const totalSpacing = 36; // total horizontal gap space
  const buttonWidth = (screenWidth - totalSpacing) / moods.length;

  const animations = useRef(moods.map(() => new Animated.Value(0))).current;

  const handlePressIn = (index: number) => {
    Animated.spring(animations[index], {
      toValue: -8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index: number, moodName: string) => {
    Animated.spring(animations[index], {
      toValue: 0,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start(() => {
      setSelectedMood(moodName);
      setMood(moodName);
      router.push("/exercise-flow");
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>

      <View style={styles.row}>
        {moods.map((mood, index) => (
          <Animated.View
            key={mood.name}
            style={{
              transform: [{ translateY: animations[index] }],
            }}
          >
            <Pressable
              style={[
                styles.moodButton,
                { width: buttonWidth },
                selectedMood === mood.name && styles.selected,
              ]}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index, mood.name)}
            >
              <Text style={styles.emoji}>{mood.label}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  selectedMood === mood.name && styles.selectedLabel,
                ]}
                numberOfLines={1} // 👈 ensures no wrapping
              >
                {mood.name}
              </Text>
            </Pressable>
          </Animated.View>
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
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    color: "#403F3A",
    fontWeight: "700",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  moodButton: {
    height: 85, // slightly taller for breathing room
    backgroundColor: "#EAD8CA",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3, // slightly more spacing between each
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  emoji: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: 13,
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
