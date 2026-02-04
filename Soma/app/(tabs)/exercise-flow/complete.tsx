import { View, Text, Pressable, StyleSheet, Image, ImageBackground, Dimensions, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import ConfettiCannon from "react-native-confetti-cannon";
import { useFonts } from 'expo-font';
import { useThemeColors } from "@/hooks/use-theme-colors";

// 👇 Hide top header (keeps bottom tabs visible)
export const unstable_settings = {
  headerShown: false,
};

export default function Complete() {
  const insets = useSafeAreaInsets();
  const confetti = useRef<any>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const { width } = Dimensions.get("window");
  const [fontsLoaded] = useFonts({
  Plante: require("../../../assets/fonts/Plante.ttf"), Biro: require("../../../assets/fonts/biro.otf")   // <-- update path if different
});
  const colors = useThemeColors();

    useEffect(() => {
    // small delay to ensure layout is ready, then mount confetti so it reliably plays
    const startTimer = setTimeout(() => setShowConfetti(true), 80);
    // stop after ~4s
    const stopTimer = setTimeout(() => setShowConfetti(false), 4080);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, []);
  return (
    <SafeAreaView
      style={[styles.container, { paddingBottom: insets.bottom || 16, backgroundColor: colors.somaBackground }]}
    >
      {showConfetti && (
        <ConfettiCannon
          ref={confetti}
          key={String(showConfetti)} // forces mount when toggled
          count={140}
          origin={{ x: width / 2, y: 0 }}
          fadeOut={true}
          fallSpeed={3000}
          colors={[colors.somaPrimary, colors.somaBackground, colors.somaSecondary, colors.somaTertiary]}
        />
      )}

      <Text style={[styles.title, { color: colors.somaText }]}>Great Job!</Text>
      <Text style={[styles.subtitle, { color: colors.somaTextMuted }]}>Take a moment to notice how you feel.</Text>

      <Pressable
        style={[styles.secondaryButton, { backgroundColor: colors.somaPrimary }]}
        onPress={() => router.push("/(tabs)/calendar")}
      >
        <Text style={[styles.secondaryText, { color: colors.somaText }]}>View Calendar</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 48,
    marginBottom: 15,
    fontFamily: 'Plante',
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 38,
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: 'Biro',
  },
  primaryButton: {
    backgroundColor: "#c18c24ff",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 15,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  primaryText: {
    color: "#403F3A",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  secondaryText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
