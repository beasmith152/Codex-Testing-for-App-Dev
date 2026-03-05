import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Platform,
  Vibration,
  type TextStyle,
} from "react-native";
import { router } from "expo-router";
import { useMood } from "../context/MoodContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Typography } from '@/constants/theme';

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
  const [confirmedMood, setConfirmedMood] = useState<string | null>(null);
  const { setMood } = useMood();
  const colors = useThemeColors();

  const liftAnimations = useRef(moods.map(() => new Animated.Value(0))).current;
  const fadeAnimations = useRef(moods.map(() => new Animated.Value(1))).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0)).current;
  const messageFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    moods.forEach((_, i) => {
      if (selectedMood === moods[i].name) {
        Animated.spring(liftAnimations[i], {
          toValue: -10,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }).start();
        Animated.timing(fadeAnimations[i], {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(liftAnimations[i], {
          toValue: 0,
          friction: 5,
          tension: 70,
          useNativeDriver: true,
        }).start();
        Animated.timing(fadeAnimations[i], {
          toValue: selectedMood ? 0.6 : 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    });

    Animated.timing(messageFade, {
      toValue: selectedMood ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [selectedMood]);

  const triggerPulse = () => {
    pulseScale.setValue(1);
    pulseOpacity.setValue(0.6);
    Animated.parallel([
      Animated.timing(pulseScale, {
        toValue: 1.8,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(pulseOpacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = (moodName: string) => {
    if (selectedMood === moodName) {
      // Confirm mood
      triggerPulse();
      if (Platform.OS !== "web") Vibration.vibrate(50);
      setConfirmedMood(moodName);
      // ✅ route into the (tabs) structure so bottom nav stays visible
      setTimeout(() => router.push("/(tabs)/exercise-flow"), 600);
    } else {
      // Select mood
      setSelectedMood(moodName);
      setMood(moodName);
      if (Platform.OS !== "web") Vibration.vibrate(30);
    }
  };

  const handleOutsidePress = () => {
    if (selectedMood) {
      setSelectedMood(null);
      setConfirmedMood(null);
      setMood(null);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <Text style={[styles.title, Typography.bodyHeadingTitle as TextStyle, { color: colors.somaText }]}>Moods</Text>

        <View style={styles.row}>
          {moods.map((mood, index) => {
            const isSelected = selectedMood === mood.name;
            return (
              <Animated.View
                key={mood.name}
                style={{
                  transform: [{ translateY: liftAnimations[index] }],
                  opacity: fadeAnimations[index],
                }}
              >
                <Pressable
                  style={[
                    styles.moodButton,
                    { backgroundColor: colors.somaMoodBg, shadowColor: colors.somaSecondary },
                    isSelected && [styles.selected, { backgroundColor: colors.somaMoodSelBg, shadowColor: colors.somaSecondary }],
                  ]}
                  onPress={() => handlePress(mood.name)}
                >
                  {isSelected && (
                    <Animated.View
                      style={[
                        styles.pulse,
                        {
                          transform: [{ scale: pulseScale }],
                          opacity: pulseOpacity,
                          backgroundColor: colors.somaPrimary,
                        },
                      ]}
                    />
                  )}
                  <Text style={styles.emoji}>{mood.label}</Text>
                  <Text
                    style={[
                      styles.moodLabel,
                      { color: colors.somaSecondary },
                      isSelected && [styles.selectedLabel, { color: colors.somaBackground }],
                    ]}
                    numberOfLines={1}
                  >
                    {mood.name}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View style={{ opacity: messageFade }}>
          {selectedMood && (
            <Text style={[styles.confirm, { color: colors.somaSecondary }]}>
              Tap <Text style={[styles.moodName, { color: colors.somaPrimary }]}>{selectedMood}</Text> again to begin.
            </Text>
          )}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 18,
    marginBottom: 14,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  moodButton: {
    width: 48,
    height: 48,
    borderRadius: 68,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
    overflow: "hidden",
    shadowOpacity: 0.95,
    shadowRadius: 10,
    shadowOffset: { width: 3, height: 10 },
  },
  pulse: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  emoji: { fontSize: 36, marginBottom: 0, paddingBottom: 0 },
  moodLabel: { fontSize: 13, marginTop: 4, display: "none" },
  selected: {
    shadowOpacity: 0.95,
    shadowRadius: 10,
  },
  selectedLabel: { fontWeight: "700" },
  confirm: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  moodName: { fontWeight: "600" },
});
