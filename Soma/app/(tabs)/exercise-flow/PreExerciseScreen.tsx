import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useRef, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Image } from "react-native";

export default function PreExerciseScreen() {
  // keep Animated.Value stable across renders
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // grab all params including the runId from the choice screen
  const params = useLocalSearchParams();
  const { id, label, gif, definition, vibe, concept, duration } = params as Record<string, string>;

  // ensure we always have a unique runId for this flow (forward if provided)
  const runId = useMemo(() => (params.runId as string) || String(Date.now()), [params.runId]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleContinue = () => {
    router.replace({
      pathname: "/(tabs)/exercise-flow/do-exercise",
      params: {
        id,
        label,
        gif,
        definition,
        vibe,
        concept,
        duration, // already string from upstream
        runId,    // ← pass through to force Timer remount
      },
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <Image
          source={require("../../../assets/images/soma-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Feel Grounded Again.</Text>

        <View style={styles.dotsRow}>
          {["#F16C5B", "#D48EB0", "#A6C49F", "#79A9D1", "#97BA7A"].map((c, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: c }]} />
          ))}
        </View>

        <Text style={styles.message}>
          "Do what feels okay; skip any movement that hurts."
        </Text>

        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6EDE3",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 180,
    height: 80,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 16,
    color: "#3E3E3E",
    fontWeight: "600",
    marginBottom: 12,
  },
  dotsRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 5,
  },
  message: {
    fontSize: 15,
    color: "#403F3A",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 22,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#EFAF2E",
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 2,
  },
  buttonText: {
    color: "#403F3A",
    fontWeight: "700",
    fontSize: 15,
  },
});
