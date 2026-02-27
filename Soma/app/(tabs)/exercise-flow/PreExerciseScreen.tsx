import { useLocalSearchParams, router } from "expo-router";
import React, { useRef, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Easing } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { useThemeColors } from "@/hooks/use-theme-colors";
import SomaLogo from "../../../assets/images/soma-logo.svg";

const DOT_COLORS = ["#F16C5B", "#D48EB0", "#A6C49F", "#79A9D1", "#97BA7A"];

export default function PreExerciseScreen() {
  // keep Animated.Value stable across renders
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.9)).current;
  const dotOrbitAnims = useRef(DOT_COLORS.map(() => new Animated.Value(0))).current;
const [fontsLoaded] = useFonts({
  Plante: require("../../../assets/fonts/Plante.ttf"),Biro: require("../../../assets/fonts/biro.otf")  // <-- update path if different
});
  const colors = useThemeColors();
  // grab all params including the runId from the choice screen
  const params = useLocalSearchParams();
  const { id, label, gif, definition, vibe, concept, duration } = params as Record<string, string>;

  // ensure we always have a unique runId for this flow (forward if provided)
  const runId = useMemo(() => (params.runId as string) || String(Date.now()), [params.runId]);

  const orbitTurns = 2;
  const orbitRadiusX = 112;
  const orbitRadiusY = 82;
  const orbitSamples = 64;

  const orbitInputRange = useMemo(
    () => Array.from({ length: orbitSamples + 1 }, (_, index) => index / orbitSamples),
    [orbitSamples]
  );

  const orbitXOutputRange = useMemo(
    () =>
      orbitInputRange.map((progress) => {
        const theta = Math.PI / 2 - progress * Math.PI * 2 * orbitTurns;
        return Math.cos(theta) * orbitRadiusX;
      }),
    [orbitInputRange, orbitRadiusX, orbitTurns]
  );

  const orbitYOutputRange = useMemo(
    () =>
      orbitInputRange.map((progress) => {
        const theta = Math.PI / 2 - progress * Math.PI * 2 * orbitTurns;
        return Math.sin(theta) * orbitRadiusY - orbitRadiusY;
      }),
    [orbitInputRange, orbitRadiusY, orbitTurns]
  );

  useFocusEffect(
    React.useCallback(() => {
      logoOpacityAnim.setValue(0);
      logoScaleAnim.setValue(0.9);
      dotOrbitAnims.forEach((anim) => anim.setValue(0));

      const entryAnimation = Animated.parallel([
        Animated.timing(logoOpacityAnim, {
          toValue: 1,
          duration: 6800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoScaleAnim, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.stagger(
            260,
            dotOrbitAnims.map((dotAnim) =>
              Animated.timing(dotAnim, {
                toValue: 1,
                duration: 4200,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              })
            )
          ),
        ]),
      ]);

      entryAnimation.start();

      return () => {
        entryAnimation.stop();
      };
    }, [logoOpacityAnim, logoScaleAnim, dotOrbitAnims])
  );

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
    <View style={[styles.container, { backgroundColor: colors.somaBackground }]}> 
      <View style={{ alignItems: "center" }}>
        <Animated.View
          style={[
            styles.logo,
            {
              opacity: logoOpacityAnim,
              transform: [{ scale: logoScaleAnim }],
            },
          ]}
        >
          <SomaLogo color={colors.somaLogo} width="175%" height="175%" />
        </Animated.View>
        <Text style={[styles.tagline, { color: colors.somaText }]}>Feel Grounded Again.</Text>

        <View style={styles.dotsRow}>
          {DOT_COLORS.map((color, index) => {
            const dotProgress = dotOrbitAnims[index];
            const dotTranslateX = dotProgress.interpolate({
              inputRange: orbitInputRange,
              outputRange: orbitXOutputRange,
            });

            const dotTranslateY = dotProgress.interpolate({
              inputRange: orbitInputRange,
              outputRange: orbitYOutputRange,
            });

            const dotScale = dotProgress.interpolate({
              inputRange: [0, 0.3, 0.7, 1],
              outputRange: [1, 1.08, 1.05, 1],
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: color },
                  {
                    transform: [
                      { translateX: dotTranslateX },
                      { translateY: dotTranslateY },
                      { scale: dotScale },
                    ],
                  },
                ]}
              />
            );
          })}
        </View>

        <Text style={[styles.message, { color: colors.somaTextMuted }]}>"Do what feels okay; skip any movement that hurts."</Text>

        <Pressable style={[styles.button, { backgroundColor: colors.somaPrimary }]} onPress={handleContinue}>
          <Text style={[styles.buttonText, { color: colors.somaButtonText }]}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 230,
    height: 170,
    marginTop: 0,
    marginBottom: 10,
    marginLeft: -220,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
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
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 22,
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 2,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 18,
  },
});
